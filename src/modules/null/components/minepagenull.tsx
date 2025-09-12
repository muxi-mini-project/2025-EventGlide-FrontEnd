import { View, Text,Image } from '@tarojs/components';
import './style.scss';
import Null from "@/common/assets/activity/null.png"
const MinePageNull: React.FC = () => {
  return (
    <View className="mine-page-null">
      <Image src={Null} className="null-img" mode="widthFix" style={{width: "25%",height:"25%"}}/>
      <Text className="mine-page-null-text">暂时还没有活动</Text>
      <Text className="mine-page-null-text">QAQ</Text>
    </View>
  );
};

export default MinePageNull;