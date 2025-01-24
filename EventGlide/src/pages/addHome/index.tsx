import { View, Image } from "@tarojs/components";
import './index.scss'
import addpic from "@/common/assets/add/addHome.png";
import remindpic from "@/common/assets/add/remind.png";
import Button from "@/common/components/Button";
import BtnType from "@/common/types/BtnType";

const Index = () => {
  const addBtn: BtnType = {
    url: '/pages/addHome/addHome',
    text: "去填写",
    backgroundColor: "#CF79FA",
    textColor: "#fff",
    isBorder: false,
  }

  return (
    <View className="add-page">
      <View className="add-main">
        <Image src={addpic} className="add-pic" mode="widthFix"></Image>
        <View className="add-text">活动填写后可在主页发布</View>
      </View>
      <View className="add-begin">
        <View className="add-btn">
          <Button url={addBtn.url} text={addBtn.text} backgroundColor={addBtn.backgroundColor} textColor={addBtn.textColor} isBorder={addBtn.isBorder}></Button>
        </View>
        <View className="add-remind">
          <Image src={remindpic} className="remind-pic" mode="widthFix"></Image>
          <View className="remind-text">查看注意事项</View>
        </View>
      </View>

    </View>
  );
};

export default Index;
