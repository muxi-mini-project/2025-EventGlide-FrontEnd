import "./index.scss";
import { View, Image } from "@tarojs/components";
import { memo, useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import Picture from "@/common/components/Picture";
import useActiveInfoStore from "@/store/activeInfoStore";
import isChecking from "@/common/assets/isChecking/isChecking1.png";
import alPost from "@/common/assets/isChecking/alPost.png";
import falPost from "@/common/assets/isChecking/falPost.png";
import { ScrollView } from "@tarojs/components";
import get from "@/common/api/get";
import useUserStore from "@/store/userStore";
import { it } from "node:test";

export interface ActiveItem {
  title: string;
  introduce: string;
  type: string;
  isChecking: string;
  holderType: string;
  if_register: string;
  showImg: string[];
}

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
  const { studentid} =useUserStore();
  const [activeList, setActiveList] = useState<ActiveItem[]>([]);
  useEffect(() => {
    get(`/act/own/${studentid}`)
      .then((res) => {
        console.log(res.data);
        setActiveList(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.log(err);
        setActiveList([]);
      });
  }, []);
  function getImg(items: String) {
    if (items === "pending") return isChecking;
    if (items === "rejected") return falPost;
    return alPost;
  }
  return (
    <View className="isCheckingPage">
      <ScrollView 
      scrollY={true}
      style={{height: "100vh"}}
      >
      {activeList.length > 0 && activeList.map((item, index) => (
        <View key={index}>
          <View className="isCheckingPage-container">
          <View className="isCheckingPage-state">
            <Image
              src={getImg(item.isChecking)}
              mode="widthFix"
              className="isCheckingPage-state-img"
            ></Image>
          </View>
            <View className="isCheckingPage-header">
              {item.title}
            </View>
            <View className="isCheckingPage-gapline1"></View>
            <View className="isCheckingPage-content">
              {item.introduce}
            </View>
            <View className="isCheckingPage-label">
              <Label text={item.type}></Label>
              <Label text={item.holderType}></Label>
              <Label text={item.if_register === "是" ? "需要报名" : "无需报名"}></Label>
            </View>
            <View className="isCheckingPage-pic">
              {(item.showImg || []).map((item, index) => (
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
      ))}
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
      <View style={{height: "100rpx"}}/>
      </ScrollView>
    </View>
  );
};

export default Index;
