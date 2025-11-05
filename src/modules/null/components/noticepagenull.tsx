import { View, Text,Image } from '@tarojs/components';
import './style.scss';
import Null from "@/common/assets/activity/null.png"
const MinePageNull: React.FC = () => {
  return (
    <View className="notice-page-null">
      <Image src={Null} className="null-img" mode="widthFix" style={{width: "25%",height:"25%"}}/>
      <Text className="notice-page-null-text">这里空空如也</Text>
      <Text className="notice-page-null-text">QAQ</Text>
    </View>
  );
};

export default MinePageNull;