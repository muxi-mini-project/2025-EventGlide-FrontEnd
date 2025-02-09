import { View, Image } from "@tarojs/components";
import { useState } from "react";
import './index.scss'
import { Form, FormWindow } from "@/modules/Form";
import formList from "@/common/const/Formconst";
import Button from "@/common/components/Button";
import draft from "@/common/assets/add/存草稿.png";
import PostWindow from "@/modules/PostWindow";
import DraftWinodw from "@/modules/draftWinow";
import { navigateTo } from "@tarojs/taro";

const Index = () => {
  const [showPostWindow, setShowPostWindow] = useState(false);
  const [showDraftWindow, setShowDraftWindow] = useState(false);
  const [showFormWindow, setShowFormWindow] = useState(false);
  const [showFormIndex, setShowFormIndex] = useState<number>(0);


  const setSafeFormIndex = (value: number) => {
    const safeValue = Math.min(Math.max(value, 0), 7);
    setShowFormIndex(safeValue);
  };
  const btn = {
    text: "下一步",
    backgroundColor: "#CF79FA",
    textColor: "#FFFEFF",
    isBorder: false
  }

  return (
    <View className="add-label">
      <View className="add-label-form-container">
        <View className="add-label-title">活动名称</View>
        {formList.map((item, index) => (
          <View key={index} className="add-label-form">
            <Form id={index} text={item.text} type={item.type} reminder={item.reminder} required={item.required}
              disabled={item.disabled} setFormIndex={setSafeFormIndex} setIsVisable={setShowFormWindow}></Form>
          </View>
        ))}
        <View className="add-label-last" onClick={() => navigateTo({ url: "/pages/addPeopleIndex/index" })}>申报人身份认证</View>
      </View>
      <View className="add-label-floor">
        <View className="add-label-floor-draft" onClick={() => setShowDraftWindow(true)}>
          <Image src={draft} mode='widthFix' style={{ width: '60rpx' }}></Image>
          <View className="add-label-floor-draft-text">存草稿</View>
        </View>
        <View className="add-label-floor-btn" onClick={() => setShowPostWindow(true)}>
          <Button {...btn} />
        </View>
      </View>
      {showDraftWindow && <DraftWinodw title="是否保存草稿？" setIsShow={setShowDraftWindow} ></DraftWinodw>}
      {showPostWindow && <PostWindow WindowType="add" setShowPostWindow={setShowPostWindow} ></PostWindow>}
      {showFormWindow && formList[showFormIndex].options !== undefined && showFormIndex < formList.length && <FormWindow type={showFormIndex === 2 ? "dateChoice" : "SimpChoice"}
        options={formList[showFormIndex].options??[]} isVisiable={showFormWindow} showFormIndex={showFormIndex} setIsVisiable={setShowFormWindow}></FormWindow>}
    </View>
  );
};

export default Index;
