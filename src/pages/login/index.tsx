import { View, Image, Input, Text } from '@tarojs/components';
import './index.scss';
import eye from '@/common/assets/logo/小眼睛.png';
import eye1 from '@/common/assets/logo/小眼睛1.png';
import Logo from '@/common/svg/logo/mainlogo.svg';
import { useEffect, useState } from 'react';
import { handleUserLogin, handleCheckLogin } from '@/common/api';
import PolicyModal from '@/modules/PolicyModal';
import Message from '@/common/components/Message';
import { NavigationBarTabBar } from '@/common/components/NavigationBar';
import withDoorGuard from '@/common/hoc';

const Index = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [isCheck, setIsCheck] = useState(false);
  const [showPolicyWindow, setShowPolicyWindow] = useState(false);

  const handleLogin = () => {
    if (isCheck) {
      handleUserLogin({ studentId, password });
    } else {
      Message.error({ content: '请先阅读并同意隐私政策' });
    }
  };

  useEffect(() => {
    handleCheckLogin();
  }, []);

  const handlePolicyClick = () => {
    setShowPolicyWindow(true);
  };

  return (
    <>
      <NavigationBarTabBar backgroundColor="#FFFFFF" title="登录"></NavigationBarTabBar>
      <View className="login-page">
        <View className="login-page-logo">
          <Image src={Logo} mode="widthFix" className="login-page-logo-img" />
          <Text className="login-page-logo-text">校灵通</Text>
          <Text className="login-page-logo-desc">EventGlide</Text>
          {/* <Image src={Logo} mode="widthFix" style={{ width: 250, height: 250 }} />*/}
        </View>
        <View className="login-page-form">
          <View className="login-page-form-container">
            <View className="login-page-form-title">&nbsp;账号</View>
            <View className="login-page-form-input">
              <Input
                className="login-page-form-input-text"
                placeholder="请输入账号"
                placeholderTextColor={'color: #5E5064;'}
                placeholderClass={'login-page-form-input-text'}
                type="text"
                value={studentId}
                onInput={(e) => {
                  setStudentId(e.detail.value);
                }}
              />
            </View>
            <View className="login-page-form-title">&nbsp;密码</View>
            <View className="login-page-form-input">
              <Input
                className="login-page-form-input-text"
                placeholder="请输入密码"
                placeholderTextColor={'color: #5E5064;'}
                placeholderClass={'login-page-form-input-text'}
                style={'font-size: 24rpx; font-family: SimHei;'}
                type="text"
                password={!showPassword}
                value={password}
                onInput={(e) => {
                  setPassword(e.detail.value);
                }}
              />
              <Image
                src={showPassword ? eye1 : eye}
                mode="widthFix"
                className="login-page-form-input-icon"
                onClick={() => setShowPassword(!showPassword)}
              />
            </View>
          </View>
          <View className="login-page-form-privacy">
            {!isCheck && (
              <View
                className="login-page-form-privacy-check"
                onClick={() => setIsCheck(!isCheck)}
              ></View>
            )}
            {isCheck && (
              <View
                className="login-page-form-privacy-check-active"
                onClick={() => setIsCheck(!isCheck)}
              >
                <View className="login-page-form-privacy-check-active-icon"></View>
              </View>
            )}
            <View className="login-page-form-privacy-text">
              我已阅读并同意
              {/* <Text style={"color: #A84ADF"}>《用户协议》</Text>及 */}
              <Text style={'color: #7D73F0'} onClick={handlePolicyClick}>
                《校灵通隐私政策》
              </Text>
              中的内容
            </View>
          </View>
        </View>
        <View className="login-page-btn" onClick={handleLogin}>
          登录
        </View>
        {showPolicyWindow && <PolicyModal setShowPolicyWindow={setShowPolicyWindow} />}
      </View>
    </>
  );
};

export default Index;
