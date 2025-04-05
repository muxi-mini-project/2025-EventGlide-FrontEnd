import "./index.scss";
import { View, Image } from "@tarojs/components";
import { memo, useState } from "react";
import Taro from "@tarojs/taro";
import Picture from "@/common/components/Picture";
import useActiveInfoStore from "@/store/activeInfoStore";
import isChecking from "@/common/assets/isChecking/isChecking1.png";
import alPost from "@/common/assets/isChecking/alPost.png";
import falPost from "@/common/assets/isChecking/falPost.png";

const Label: React.FC<{ text: string }> = memo(({ text }) => {
  return <View className="isCheckingPage-label-item">{text}</View>;
});

const Index = () => {
  const { title, introduce: description, showImg: imgUrl, labelform } = useActiveInfoStore(
    (state) => state,
  );
  const [showImgList, setShowImgList] = useState<string[]>(imgUrl);
  let signText = "无需报名";
  if (labelform.if_register === "是") signText = "需要报名";
  const labelList = [labelform.type, labelform.holderType, signText];
  const defaultTitle = "活动名称";
  const defaultDescription =
    "为了让大家更好地了解该活动，请介绍一下活动亮点， 活动流程和注意事项等内容......";

  return (
    <View className="isCheckingPage">
      <View className="isCheckingPage-state">
        <Image
          src={alPost}
          mode="widthFix"
          className="isCheckingPage-state-img"
        ></Image>
      </View>
      <View className="isCheckingPage-container">
        <View className="isCheckingPage-header">
          {title !== "" ? title : defaultTitle}
        </View>
        <View className="isCheckingPage-gapline1"></View>
        <View className="isCheckingPage-content">
          {description !== "" ? description : defaultDescription}
        </View>
        <View className="isCheckingPage-label">
          {labelList.map((item, index) => (
            <Label key={index} text={item}></Label>
          ))}
        </View>
        <View className="isCheckingPage-pic">
          {showImgList.map((item, index) => (
            <Picture
              key={index}
              src={item}
              isShowDelete={true}
              imgUrl={[]}
              setImgUrl={([]) => {}}
            ></Picture>
          ))}
        </View>
      </View>
    </View>
  );
};

export default Index;
