import { View, Image } from "@tarojs/components";
import { navigateTo } from "@tarojs/taro";
import './index.scss'
import avatar from "@/common/assets/Postlist/波奇.jpg";
import schoolSrc from "@/common/assets/mineInfo/学校.png";
import departmentSrc from "@/common/assets/mineInfo/院系.png";
import cardSrc from "@/common/assets/mineInfo/一卡通号.png";



const Index = () => {

  return (
    <View className="mineInfo-page">
      <View className="mineInfo-user">
        <View className="mineInfo-container-top">
          <View className="mineInfo-container-column">头像</View>
          <View className="mineInfo-container-avatar">
            <Image className="mineInfo-container-img" style={"border-radius: 50%;width: 80rpx;"} mode="widthFix" src={avatar} />
          </View>
        </View>
        <View className="mineInfo-container-bottom">
          <View className="mineInfo-container-column">昵称</View>
          <View className="mineInfo-container-desc">校灵通</View>
        </View>
      </View>
      <View className="mineInfo-desc">
        <View className="mineInfo-container-top">
          <View className="mineInfo-container-column">实名信息</View>
        </View>
        <View className="mineInfo-container">
          <View className="mineInfo-container-column">
            <Image className="mineInfo-container-img" mode="widthFix" src={schoolSrc} />
            学校</View>
          <View className="mineInfo-container-desc">华中师范大学</View>
        </View>
        <View className="mineInfo-container">
          <View className="mineInfo-container-column">
            <Image className="mineInfo-container-img" mode="widthFix" src={departmentSrc} />
            院系</View>
          <View className="mineInfo-container-desc">计算机学院</View>
        </View>
        <View className="mineInfo-container-bottom">
          <View className="mineInfo-container-column">
            <Image className="mineInfo-container-img" mode="widthFix" src={cardSrc} />
            一卡通号</View>
            <View className="mineInfo-container-desc">202*21****</View>
        </View>
      </View>
      <View className="mineInfo-floor-btn" onClick={() => navigateTo({ url: "/pages/login/index" })}>
        退出登录
      </View>
    </View>
  );
};

export default Index;
