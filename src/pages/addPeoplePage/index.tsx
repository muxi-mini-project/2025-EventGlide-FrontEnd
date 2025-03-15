import { View, Input } from "@tarojs/components";
import { navigateBack } from "@tarojs/taro";
import { useState } from "react";
import "./index.scss";
import useSignersStore from "@/store/SignersStore";

const Index = () => {
  const { signers, setAddSigner } = useSignersStore();
  const [name, setName] = useState("");
  const [idCard, setIdCard] = useState("");
  const handleClick = () => {
    setAddSigner({ id: signers.length + 1, name, studentId: idCard });
    navigateBack();
  };
  return (
    <View className="addPeoplepage">
      <View className="addPeoplepage-title">添加信息</View>
      <View className="addPeoplepage-form">
        <View className="addPeoplepage-form-item">
          <Input
            className="addPeoplepage-form-input1"
            value={name}
            onInput={(e) => setName(e.detail.value)}
            placeholder="输入姓名"
            placeholderClass={"placeholder"}
          ></Input>
        </View>
        <View className="addPeoplepage-form-item">
          <Input
            className="addPeoplepage-form-input2"
            value={idCard}
            onInput={(e) => setIdCard(e.detail.value)}
            placeholder="输入一站式账号"
            placeholderClass={"placeholder"}
          ></Input>
        </View>
      </View>
      <View className="addPeoplepage-button" onClick={handleClick}>
        完成
      </View>
    </View>
  );
};

export default Index;
