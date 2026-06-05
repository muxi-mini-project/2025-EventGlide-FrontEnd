import Button from '@/common/components/Button';
import { View, Image, Textarea } from '@tarojs/components';
import { useState } from 'react';
import './index.scss';
import Taro from '@tarojs/taro';
import Picture from '@/common/components/Picture';
import draft from '@/common/svg/add/draft.svg';
import ConfirmModal from '@/modules/ConfirmModal';
import ImagePicker from '@/modules/ImagePicker';
import useActiveInfoStore from '@/store/activeInfoStore';
import { useDidShow } from '@tarojs/taro';
import { getActivityDraft } from '@/common/api';
import { LabelForm } from '@/common/types';
import { useSaveDraft } from '@/common/hooks/useSaveDraft';
import { NavigationBarBack } from '@/common/components/NavigationBar';
const emptyLabelForm: LabelForm = {
  type: '',
  holderType: '',
  startTime: '',
  endTime: '',
  position: '',
  ifRegister: '',
  activeForm: '',
  registerMethod: '',
  signer: [],
};

const Index = () => {
  const [isShowDraft, setIsShowDraft] = useState(false);
  const [isShowAlbum, setIsShowAlbum] = useState(false);
  const [imgUrl, setImgUrl] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { setBasicInfo, setLabelForm, labelform, draftData, setDraftData } = useActiveInfoStore();
  const [count, setCount] = useState(0);
  const [writing, setWriting] = useState(false);
  const [isShowConfirmModal, setIsShowConfirmModal] = useState(false);

  const { saveDraft } = useSaveDraft({
    onSaveSuccess: () => {
      setIsShowDraft(false);
      setDraftData({
        title: title,
        introduce: description,
        showImg: imgUrl,
        labelform: labelform,
      });
    },
    onSaveError: (error) => {
      console.error('草稿保存失败:', error);
    },
  });

  useDidShow(async () => {
    try {
      const res = await getActivityDraft();
      if (res.msg === 'success' && !writing) {
        console.log(res.data);
        const draftTitle = res.data.title || '';
        const draftIntroduce = res.data.introduce || '';
        let draftShowImg: string[] = [];
        if (Array.isArray(res.data.showImg)) {
          draftShowImg = res.data.showImg.filter((item: string) => item !== '');
        } else if (typeof res.data.showImg === 'string' && res.data.showImg !== '') {
          draftShowImg = [res.data.showImg];
        }
        setTitle(draftTitle);
        setDescription(draftIntroduce);
        setImgUrl(draftShowImg);
        setCount(draftIntroduce.length || 0);
        setLabelForm(res.data.labelform || emptyLabelForm);

        // 存储草稿数据用于比较
        setDraftData({
          title: draftTitle,
          introduce: draftIntroduce,
          showImg: draftShowImg,
          labelform: res.data.labelform || emptyLabelForm,
        });
      }
      setWriting(true);
    } catch (error) {
      console.error('获取活动草稿失败:', error);
    }
  });

  const btn = {
    // url: "",
    text: '下一步',
    backgroundColor: '#7D73F0',
    textColor: '#FFFEFF',
    isBorder: false,
  };
  const handleNextClick = () => {
    if (!title.trim() || !description.trim()) {
      Taro.showToast({
        title: '请填写活动标题和活动内容',
        icon: 'none',
        duration: 2000,
      });
      return;
    } else if (imgUrl.length === 0) {
      Taro.showToast({
        title: '请上传至少一张图片',
        icon: 'none',
        duration: 2000,
      });
      return;
    }
    Taro.navigateTo({
      url: '/subpackage/addLabel/index',
    });
    setBasicInfo(title, description, imgUrl);
  };

  const stringifySorted = (obj: any) => {
    // 将 null、undefined、空数组视为相等
    if (obj === null || obj === undefined || (Array.isArray(obj) && obj.length === 0)) {
      return JSON.stringify([]);
    }
    if (typeof obj !== 'object') {
      return JSON.stringify(obj);
    }
    if (Array.isArray(obj)) {
      return JSON.stringify(obj.map((item) => stringifySorted(item)));
    }
    const sortedKeys = Object.keys(obj).sort();
    const sortedObj: Record<string, any> = {};
    for (const key of sortedKeys) {
      sortedObj[key] = stringifySorted(obj[key]);
    }
    return JSON.stringify(sortedObj);
  };

  const hasContentChanged = () => {
    if (title !== draftData.title) return true;
    if (description !== draftData.introduce) return true;
    if (imgUrl.length !== draftData.showImg.length) return true;

    for (let i = 0; i < imgUrl.length; i++) {
      if (imgUrl[i] !== draftData.showImg[i]) return true;
    }

    // 使用排序后的 stringify 比较，忽略属性顺序
    if (stringifySorted(labelform) !== stringifySorted(draftData.labelform)) return true;

    return false;
  };

  const handleBack = () => {
    if (hasContentChanged()) {
      setIsShowConfirmModal(true);
    } else {
      Taro.navigateBack();
    }
  };

  return (
    <>
      <NavigationBarBack
        backgroundColor="#F9F8FC"
        title="添加"
        url="/pages/mineHome/index"
        onBack={handleBack}
      />
      <View>
        <View className="add-introduce">
          <View className="add-introduce-container">
            <View className="add-introduce-container-title">{count}/1000</View>
            <View className="add-introduce-container-content">
              <Textarea
                style={
                  'color: #170A1E;font-family: SimHei;min-height: 50rpx;max-height: 100rpx;resize: none;'
                }
                className="add-introduce-container-content-title"
                value={title}
                onInput={(e) => setTitle(e.detail.value)}
                placeholderClass="add-introduce-container-content-title-placeholder"
                placeholder="清晰名称能更好地让人注意哦~"
                maxlength={30}
              ></Textarea>
              <Textarea
                className="add-introduce-container-content-desc"
                value={description}
                onInput={(e) => {
                  const value = e.detail.value;
                  setDescription(value);
                  setCount(value.length);
                }}
                placeholderClass="add-introduce-container-content-desc-placeholder"
                placeholder="为了让大家更好地了解该活动，请介绍一下活动亮点， 活动流程和注意事项等内容......"
                maxlength={1000}
                autoHeight={true}
              ></Textarea>
              <View className="add-introduce-container-content-pic">
                {imgUrl &&
                  imgUrl.map((item, index) => (
                    <Picture
                      key={index}
                      src={item}
                      isShowDelete={true}
                      imgUrl={imgUrl}
                      setImgUrl={setImgUrl}
                    />
                  ))}
                <View
                  className="add-introduce-container-content-pic-add"
                  onClick={() => setIsShowAlbum(true)}
                >
                  +
                </View>
              </View>
            </View>
          </View>
          <View className="add-introduce-floor">
            <View className="add-introduce-floor-draft" onClick={() => setIsShowDraft(true)}>
              <Image src={draft} mode="widthFix" style={{ width: '60rpx' }}></Image>
              <View className="add-introduce-floor-draft-text">存草稿</View>
            </View>
            <View className="add-introduce-floor-btn" onClick={handleNextClick}>
              <Button {...btn} />
            </View>
          </View>
        </View>

        {/* 草稿保存modal */}
        <ConfirmModal
          title="是否保存草稿？"
          visible={isShowDraft}
          onClose={() => setIsShowDraft(false)}
          onConfirm={() =>
            saveDraft({
              title: title,
              introduce: description,
              showImg: imgUrl,
              labelform: labelform,
            })
          }
          headerClassName="textmid"
        />

        <ConfirmModal
          title="您有未保存的内容，是否保存草稿？"
          visible={isShowConfirmModal}
          onClose={() => {
            Taro.navigateBack();
          }}
          onConfirm={() => {
            saveDraft({
              title: title,
              introduce: description,
              showImg: imgUrl,
              labelform: labelform,
            });
            Taro.navigateBack();
          }}
        />

        <ImagePicker
          isVisiable={isShowAlbum}
          setIsVisiable={setIsShowAlbum}
          imgUrl={imgUrl}
          setImgUrl={setImgUrl}
          type={'event'}
        />
      </View>
    </>
  );
};

export default Index;
