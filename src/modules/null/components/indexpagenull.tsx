import { View, Text, Image } from '@tarojs/components';
import './style.scss';
import Null from "@/common/assets/activity/null.png"
const IndexPageNull: React.FC = () => {
  return (
    <View className="index-page-null">
      <Image src={Null} className="null-img" mode="widthFix" style={{width: "25%",height:"25%"}}/>
      <Text className="index-page-null-text">暂时还没有活动</Text>
      <Text className="index-page-null-text">QAQ</Text>
    </View>
  );
};

export default IndexPageNull;