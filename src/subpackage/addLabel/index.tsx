import { View, Image, Form } from '@tarojs/components';
import { useEffect, useState } from 'react';
import './index.scss';
import withDoorGuard from '@/common/hoc';
import Taro from '@tarojs/taro';
import { FormItem, FormPicker } from '@/modules/Form';
import formList from '@/common/const/Formconst';
import Button from '@/common/components/Button';
import draft from '@/common/svg/add/draft.svg';
import ActivityModal from '@/modules/ActivityModal';
import ConfirmModal from '@/modules/ConfirmModal';
import { navigateTo, useDidShow } from '@tarojs/taro';
import { LabelForm } from '@/common/types';
import useActiveInfoStore from '@/store/activeInfoStore';
import useSignersStore from '@/store/SignersStore';
import { useSaveDraft } from '@/common/hooks/useSaveDraft';
import { getActivityDraft } from '@/common/api';
import { NavigationBarBack } from '@/common/components/NavigationBar';

const Index = () => {
  const { setLabelForm, labelform, setDraftData } = useActiveInfoStore();
  const { setAddSigner, setRemoveSigner } = useSignersStore();

  const { title, introduce, showImg } = useActiveInfoStore();
  const parseSignersString = (signersStr: string) => {
    if (!signersStr) return [];
    return signersStr.split(',').map((pair) => {
      const [studentId, name] = pair.split(':');
      return { name, studentId };
    });
  };
  const signers = useSignersStore((state) => state.signers).map((signer) => {
    const { id, ...rest } = signer;
    return rest;
  });
  const [showPostWindow, setShowPostWindow] = useState(false);
  const [showDraftWindow, setShowDraftWindow] = useState(false);
  const [showFormWindow, setShowFormWindow] = useState(false);
  const [showFormIndex, setShowFormIndex] = useState<number>(0);
  const [activeForm, setActiveForm] = useState<string[]>([]);

  const updateActiveForm = (values: string[]) => {
    setActiveForm(values);
    setFormValue((prev) => ({
      ...prev,
      activeForm: values.join(','), // 将数组转换为字符串存储
    }));
  };

  const [formValue, setFormValue] = useState<LabelForm>(labelform);
  useEffect(() => {
    setLabelForm(formValue);
  }, [formValue]);

  const { saveDraft } = useSaveDraft({
    onSaveSuccess: () => {
      setShowDraftWindow(false);
      setDraftData({
        title: title,
        introduce: introduce,
        showImg: showImg,
        labelform: formValue,
      });
    },
    onSaveError: (error) => {
      console.error('草稿保存失败:', error);
    },
  });

  useDidShow(async () => {
    setDraftData;
    try {
      const res = await getActivityDraft();
      console.log('label', res, labelform);
      if (res.msg === 'success') {
        const signerArray =
          typeof res.data.labelform.signer === 'string'
            ? parseSignersString(res.data.labelform.signer)
            : res.data.labelform.signer || [];
        const newLabelForm: LabelForm = {
          type: formValue.type || res.data.labelform.type,
          holderType: formValue.holderType || res.data.labelform.holderType,
          startTime: formValue.startTime || res.data.labelform.startTime,
          endTime: formValue.endTime || res.data.labelform.endTime,
          position: formValue.position || res.data.labelform.position,
          ifRegister: formValue.ifRegister || res.data.labelform.ifRegister,
          activeForm: formValue.activeForm || res.data.labelform.activeForm || '',
          registerMethod: formValue.registerMethod || res.data.labelform.registerMethod || '',
          signer: signers.length > 0 ? signers : signerArray,
        };
        console.log('newLabelForm', newLabelForm);
        setFormValue(newLabelForm);
        if (newLabelForm.activeForm && newLabelForm.activeForm.length > 0) {
          const array = [newLabelForm.activeForm];
          setActiveForm(array);
        }
        if (signerArray.length > 0 && signers.length === 0) {
          for (let i = 0; i < signerArray.length; i++) {
            setAddSigner(signerArray[i]);
          }
          setRemoveSigner(0);
        }
      }
    } catch (error) {
      console.error('获取活动草稿失败:', error);
    }
  });

  const typeChoice = (showFormIndex: number) => {
    if (showFormIndex === 2 || showFormIndex === 3) return 'dateChoice';
    else if (showFormIndex === 6) return 'albumChoice';
    else return 'SimpChoice';
  };

  const setSafeFormIndex = (value: number) => {
    const safeValue = Math.min(Math.max(value, 0), 8);
    setShowFormIndex(safeValue);
  };

  const handleFormSubmit = () => {
    const { type, holderType, startTime, endTime, position, ifRegister, registerMethod } =
      formValue;
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    const minTimeDiff = 30 * 60 * 1000;
    if (activeForm.length === 0 && holderType !== '个人') {
      Taro.showToast({
        title: '请添加活动申请表',
        icon: 'none',
        duration: 2000,
      });
      return;
    }
    if (signers.length < 3 && holderType == '个人') {
      Taro.showToast({
        title: '请至少添加3位申报人',
        icon: 'none',
        duration: 2000,
      });
      return;
    }
    if (signers.length < 1 && holderType !== '个人') {
      Taro.showToast({
        title: '请至少添加1位申报人',
        icon: 'none',
        duration: 2000,
      });
      return;
    }
    if (start >= end || end - start < minTimeDiff) {
      Taro.showToast({
        title: '请填写正确的开始时间和结束时间',
        icon: 'none',
        duration: 2000,
      });
      return;
    }
    if (!type || !holderType || !startTime || !endTime || !position || !ifRegister) {
      Taro.showToast({
        title: '还有必填项未选择，请检查',
        icon: 'none',
        duration: 2000,
      });
      return;
    }
    if (ifRegister === '是' && !registerMethod) {
      Taro.showToast({
        title: '请填写报名方式',
        icon: 'none',
        duration: 2000,
      });
      return;
    }
    setLabelForm({ ...labelform, ...formValue, signer: signers });
    setShowPostWindow(true);
  };

  const handleFormSubmitEvent = (e: any) => {
    console.log('Form submitted:', e.detail.value);
    handleFormSubmit();
  };

  const btn = {
    text: '下一步',
    backgroundColor: '#7D73F0',
    textColor: '#FFFEFF',
    isBorder: false,
  };

  return (
    <>
      <NavigationBarBack backgroundColor="#F9F8FC" title="添加" url="/pages/mineHome/index" />
      <View className="add-label">
        <Form onSubmit={handleFormSubmitEvent}>
          <View className="add-label-form-container">
            <View className="add-label-title">{title}</View>
            {formList.map((item, index) => (
              <View key={index} className="add-label-form">
                <FormItem
                  id={index}
                  text={item.text}
                  type={item.type}
                  reminder={item.reminder}
                  required={item.required}
                  disabled={item.disabled}
                  activeForm={activeForm}
                  setActiveForm={updateActiveForm}
                  value={
                    Object.values(formValue).filter((value) => typeof value === 'string')[index]
                  }
                  formValue={formValue}
                  setFormValue={setFormValue}
                  setFormIndex={setSafeFormIndex}
                  setIsVisable={setShowFormWindow}
                ></FormItem>
              </View>
            ))}
            <View
              className="add-label-last"
              onClick={() => navigateTo({ url: '/subpackage/addPeopleIndex/index' })}
            >
              申报人身份认证
            </View>
          </View>
          <View className="add-label-floor">
            <View className="add-label-floor-draft" onClick={() => setShowDraftWindow(true)}>
              <Image src={draft} mode="widthFix" style={{ width: '60rpx' }}></Image>
              <View className="add-label-floor-draft-text">存草稿</View>
            </View>
            <View className="add-label-floor-btn">
              <Button formType="submit" {...btn} />
            </View>
          </View>
        </Form>
        {/* 草稿保存modal */}
        <ConfirmModal
          title="是否保存草稿？"
          visible={showDraftWindow}
          onClose={() => setShowDraftWindow(false)}
          onConfirm={() =>
            saveDraft({
              title: title,
              introduce: introduce,
              showImg: showImg,
              labelform: formValue,
            })
          }
          headerClassName="textmid"
        />
        <ActivityModal
          isShowActivityWindow={showPostWindow}
          WindowType="add"
          setShowPostWindow={setShowPostWindow}
        ></ActivityModal>

        {showFormWindow && (
          <FormPicker
            type={typeChoice(showFormIndex)}
            options={formList[showFormIndex].options ?? []}
            isVisiable={showFormWindow}
            showFormIndex={showFormIndex}
            setIsVisiable={setShowFormWindow}
            formValue={formValue}
            setFormValue={setFormValue}
            activeForm={activeForm}
            setActiveForm={updateActiveForm}
          ></FormPicker>
        )}
      </View>
    </>
  );
};

export default withDoorGuard(Index);
