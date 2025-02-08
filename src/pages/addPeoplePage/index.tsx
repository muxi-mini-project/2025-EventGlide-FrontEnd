import { View, Input } from "@tarojs/components";
import { navigateBack } from "@tarojs/taro";
import './index.scss'

const Index = () => {
  const handleClick = () => {
    navigateBack();
  }
  return (
    <View className="addPeoplepage">
      <View className="addPeoplepage-title">添加信息</View>
      <View className="addPeoplepage-form">
        <View className="addPeoplepage-form-item">
          <Input className="addPeoplepage-form-input1" placeholder="输入姓名" placeholderClass={"placeholder"}></Input>
        </View>
        <View className="addPeoplepage-form-item">
          <Input className="addPeoplepage-form-input2" placeholder="输入一站式账号" placeholderClass={"placeholder"}></Input>
        </View>
      </View>
      <View className="addPeoplepage-button" onClick={handleClick}>完成</View>
    </View>
  );
};

export default Index;
