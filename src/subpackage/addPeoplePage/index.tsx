import { View, Input } from '@tarojs/components';
import Taro, { navigateBack } from '@tarojs/taro';
import { useState } from 'react';
import './index.scss';
import useSignersStore from '@/store/SignersStore';
import { NavigationBarBack } from '@/common/components/NavigationBar';

const Index = () => {
  const { signers, setAddSigner } = useSignersStore();
  const [name, setName] = useState('');
  const [idCard, setIdCard] = useState('');
  const handleClick = () => {
    const is10DigitNumber = /^\d{10}$/.test(idCard);
    if (!is10DigitNumber) {
      Taro.showToast({
        title: '该一站式账号格式不正确',
        icon: 'none',
      });
      return;
    }
    const isIdExists = signers.some((signer) => signer.studentId === idCard);
    if (isIdExists) {
      Taro.showToast({
        title: '该一站式账号已添加',
        icon: 'none',
      });
      return;
    }
    setAddSigner({ id: signers.length + 1, name, studentId: idCard });
    navigateBack();
  };
  return (
    <>
      <NavigationBarBack backgroundColor="#F9F8FC" title="添加" url="/pages/mineHome/index" />
      <View className="addPeoplepage">
        <View className="addPeoplepage-title">添加信息</View>
        <View className="addPeoplepage-form">
          <View className="addPeoplepage-form-item">
            <Input
              className="addPeoplepage-form-input1"
              value={name}
              onInput={(e) => setName(e.detail.value)}
              placeholder="输入姓名"
              placeholderClass={'placeholder'}
            ></Input>
          </View>
          <View className="addPeoplepage-form-item">
            <Input
              className="addPeoplepage-form-input2"
              value={idCard}
              onInput={(e) => setIdCard(e.detail.value)}
              placeholder="输入一站式账号"
              placeholderClass={'placeholder'}
            ></Input>
          </View>
        </View>
        <View className="addPeoplepage-button" onClick={handleClick}>
          完成
        </View>
      </View>
    </>
  );
};

export default Index;
