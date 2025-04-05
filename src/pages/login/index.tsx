import { View, Image, Input, Text } from "@tarojs/components";
import "./index.scss";
import logo from "@/common/svg/login/logo.svg";
import eye from "@/common/assets/logo/小眼睛.png";
import eye1 from "@/common/assets/logo/小眼睛1.png";
import { useState } from "react";
import { switchTab } from "@tarojs/taro";
import handleUserLogin from "@/common/api/Login";

const Index = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [studentid, setStudentid] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);
  const [isCheck, setIsCheck] = useState(true);

  const handleLogin = () => {
    // switchTab({ url: "/pages/mineHome/index" });
    if (isCheck) {
      handleUserLogin({ params: { studentid, password, setShowError } })
    } else {
      setShowError(true);
    }
  };

  return (
    <View className="login-page">
      <View className="login-page-logo">
        <Image src={logo} mode="widthFix" className="login-page-logo-img" />
        <Text className="login-page-logo-text">校灵通</Text>
        <Text className="login-page-logo-desc">EventGlide</Text>
      </View>
      <View className="login-page-form">
        <View className="login-page-form-container">
          <View className="login-page-form-title">&nbsp;账号</View>
          <View className="login-page-form-input">
            <Input
              className="login-page-form-input-text"
              placeholder="请输入账号"
              placeholderTextColor={"color: #5E5064;"}
              placeholderClass={"login-page-form-input-text"}
              type="text"
              value={studentid}
              onInput={(e) => {
                setStudentid(e.detail.value);
                setShowError(false);
              }}
            />
          </View>
          <View className="login-page-form-title">&nbsp;密码</View>
          <View className="login-page-form-input">
            <Input
              className="login-page-form-input-text"
              placeholder="请输入密码"
              placeholderTextColor={"color: #5E5064;"}
              placeholderClass={"login-page-form-input-text"}
              style={"font-size: 24rpx; font-family: SimHei;"}
              type="text"
              password={!showPassword}
              value={password}
              onInput={(e) => {
                setPassword(e.detail.value);
                setShowError(false);
              }}
            />
            <Image
              src={showPassword ? eye1 : eye}
              mode="widthFix"
              className="login-page-form-input-icon"
              onClick={() => setShowPassword(!showPassword)}
            />
          </View>
          {showError && (
            <View className="login-page-form-error">
              账号或密码错误，请重新输入
            </View>
          )}
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
            <Text style={"color: #A84ADF"}>《用户协议》</Text>及
            <Text style={"color: #A84ADF"}>《隐私政策》</Text>
          </View>
        </View>
      </View>
      <View className="login-page-btn" onClick={handleLogin}>
        登录
      </View>
    </View>
  );
};

export default Index;
