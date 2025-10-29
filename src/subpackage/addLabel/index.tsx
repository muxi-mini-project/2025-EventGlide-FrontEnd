import { View, Image } from "@tarojs/components";
import { useState } from "react";
import "./index.scss";
import Taro from "@tarojs/taro";
import { Form, FormWindow } from "@/modules/Form";
import formList from "@/common/const/Formconst";
import Button from "@/common/components/Button";
import draft from "@/common/svg/add/draft.svg";
import PostWindow from "@/modules/PostWindow";
import DraftWinodw from "@/modules/draftWinow";
import { navigateTo, useDidShow } from "@tarojs/taro";
import LabelForm from "@/common/types/LabelForm";
import useActiveInfoStore from "@/store/activeInfoStore";
import useSignersStore from "@/store/SignersStore";
import get from "@/common/api/get";

const Index = () => {
  const { setLabelForm } = useActiveInfoStore();
  const { labelform } = useActiveInfoStore();

  const { title, introduce, showImg } = useActiveInfoStore();
  const signers = useSignersStore((state) => state.signers).map((signer) => {
    const { id, ...rest } = signer;
    return rest;
  });
  const [showPostWindow, setShowPostWindow] = useState(false);
  const [showDraftWindow, setShowDraftWindow] = useState(false);
  const [showFormWindow, setShowFormWindow] = useState(false);
  const [showFormIndex, setShowFormIndex] = useState<number>(0);
  const [activeForm, setActiveForm] = useState<string[]>([]);
  const [formValue, setFormValue] = useState<LabelForm>({
    type: "",
    holderType: "",
    startTime: "",
    endTime: "",
    position: "",
    if_register: "",
    activeForm: "",
    register_method: "",
    signer: [],
  });
  useDidShow(() => {
    get("/act/load").then((res) => {
      console.log("label", res);
      if (res.msg === "success") {
        const newLabelForm: LabelForm = {
          type: formValue.type || res.data.Type,
          holderType: formValue.holderType || res.data.HolderType,
          startTime: formValue.startTime || res.data.StartTime,
          endTime: formValue.endTime || res.data.EndTime,
          position: formValue.position || res.data.Position,
          if_register: formValue.if_register || res.data.IfRegister,
          activeForm: formValue.activeForm || res.data.ActiveForm || "",
          register_method: formValue.register_method || res.data.RegisterMethod || "",
          signer: (signers || res.data.Signer).map((signer) => ({
            name: signer.name,
            studentid: signer.studentid,
          })),
        }
        console.log("newLabelForm", newLabelForm);
        setFormValue(newLabelForm);
      }
    });
  });

  const typeChoice = (showFormIndex: number) => {
    if (showFormIndex === 2 || showFormIndex === 3) return "dateChoice";
    else if (showFormIndex === 6) return "albumChoice";
    else return "SimpChoice";
  };

  const setSafeFormIndex = (value: number) => {
    const safeValue = Math.min(Math.max(value, 0), 8);
    setShowFormIndex(safeValue);
  };

  const handleFormSubmit = () => {
    const { type, holderType, startTime, endTime, position, if_register, register_method } = formValue;
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    const minTimeDiff = 30 * 60 * 1000;
    if (start >= end || end - start < minTimeDiff) {
      Taro.showToast({
        title: '请填写正确的开始时间和结束时间',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    if (!type || !holderType || !startTime || !endTime || !position || !if_register) {
      Taro.showToast({
        title: '还有必填项未选择，请检查',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    if (if_register === "是" && !register_method) {
      Taro.showToast({
        title: '请填写报名方式',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    setLabelForm({ ...labelform, ...formValue, signer: signers });
    setShowPostWindow(true);
  };
  const btn = {
    text: "下一步",
    backgroundColor: "#CF79FA",
    textColor: "#FFFEFF",
    isBorder: false,
  };

  return (
    <View className="add-label">
      <View className="add-label-form-container">
        <View className="add-label-title">{title}</View>
        {formList.map((item, index) => (
          <View key={index} className="add-label-form">
            <Form
              id={index}
              text={item.text}
              type={item.type}
              reminder={item.reminder}
              required={item.required}
              disabled={item.disabled}
              activeForm={activeForm}
              setActiveForm={setActiveForm}
              value={
                Object.values(formValue).filter(
                  (value) => typeof value === "string",
                )[index]
              }
              formValue={formValue}
              setFormValue={setFormValue}
              setFormIndex={setSafeFormIndex}
              setIsVisable={setShowFormWindow}
            ></Form>
          </View>
        ))}
        <View
          className="add-label-last"
          onClick={() => navigateTo({ url: "/subpackage/addPeopleIndex/index" })}
        >
          申报人身份认证
        </View>
      </View>
      <View className="add-label-floor">
        <View
          className="add-label-floor-draft"
          onClick={() => setShowDraftWindow(true)}
        >
          <Image src={draft} mode="widthFix" style={{ width: "60rpx" }}></Image>
          <View className="add-label-floor-draft-text">存草稿</View>
        </View>
        <View
          className="add-label-floor-btn"
          onClick={() => handleFormSubmit()}
        >
          <Button {...btn} />
        </View>
      </View>
      {showDraftWindow && (
        <DraftWinodw
          windowTitle="是否保存草稿？"
          setIsShow={setShowDraftWindow}
          type="event"
          title={title}
          introduce={introduce}
          showImg={showImg}
          labelform={formValue}
        ></DraftWinodw>
      )}
      {showPostWindow && (
        <PostWindow
          WindowType="add"
          setShowPostWindow={setShowPostWindow}
        ></PostWindow>
      )}
      {showFormWindow && (
        <FormWindow
          type={typeChoice(showFormIndex)}
          options={formList[showFormIndex].options ?? []}
          isVisiable={showFormWindow}
          showFormIndex={showFormIndex}
          setIsVisiable={setShowFormWindow}
          formValue={formValue}
          setFormValue={setFormValue}
          activeForm={activeForm}
          setActiveForm={setActiveForm}
        ></FormWindow>
      )}
    </View>
  );
};

export default Index;
