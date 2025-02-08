import Button from "@/common/components/Button";
import { View, Image } from "@tarojs/components";
import { useState } from "react";
import './index.scss'
import Picture from "@/common/components/Picture";
import draft from "@/common/assets/add/存草稿.png";
import DraftWinodw from "@/modules/draftWinow";

const Index = () => {
  const [isShowDraft, setIsShowDraft] = useState(false);


  const btn = {
    url: "/pages/addLabel/index",
    text: "下一步",
    backgroundColor: "#CF79FA",
    textColor: "#FFFEFF",
    isBorder: false
  }

  //测试
  const picList: { src: string, isShowDelete: boolean }[] = new Array(7).fill({ src: '@/common/assets/Postlist/波奇.jpg' });

  return (
    <>
      <View className="add-introduce">
        <View className="add-introduce-container">
          <View className="add-introduce-container-title">12/1000</View>
          <View className="add-introduce-container-content">
            <View className="add-introduce-container-content-title">清晰名称能更好地让人注意哦~</View>
            <View className="add-introduce-container-content-desc">为了让大家更好地了解该活动，请介绍一下活动亮点， 活动流程和注意事项等内容......</View>
            <View className="add-introduce-container-content-pic">
              {picList.map((item, index) => (
                <Picture key={index} src={item.src} isShowDelete={true} />
              ))}
              <View className="add-introduce-container-content-pic-add">+</View>
            </View>
          </View>
        </View>
        <View className="add-introduce-floor">
          <View className="add-introduce-floor-draft" onClick={() => setIsShowDraft(true)}>
            <Image src={draft} mode='widthFix' style={{ width: '60rpx' }}></Image>
            <View className="add-introduce-floor-draft-text">存草稿</View>
          </View>
          <View className="add-introduce-floor-btn">
            <Button {...btn} />
          </View>
        </View>
      </View>
      {isShowDraft && <DraftWinodw title="是否保存草稿？" setIsShow={setIsShowDraft} />}
    </>
  );
};

export default Index;
