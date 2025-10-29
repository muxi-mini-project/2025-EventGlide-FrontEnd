import { View, Image, Input, Text } from "@tarojs/components";
import "./index.scss";
import logo from "@/common/svg/login/logo.svg";
import eye from "@/common/assets/logo/小眼睛.png";
import eye1 from "@/common/assets/logo/小眼睛1.png";
import Logo from "@/common/assets/logo/mainlogo.png";
import get from "@/common/api/get";
import useUserStore from "@/store/userStore";
import usePostStore from "@/store/PostStore";
import { useEffect, useState } from "react";
import { switchTab } from "@tarojs/taro";
import handleUserLogin from "@/common/api/Login";
import PolicyWindow from "@/modules/PolicyWindow";
import Taro from "@tarojs/taro";

const Index = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [studentid, setStudentid] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);
  const [isCheck, setIsCheck] = useState(true);
  const [showPolicyWindow,setShowPolicyWindow]=useState(false);

  const { setStudentId, setId, setAvatar, setUsername, setSchool } = useUserStore.getState();
  const { setPostStudentId } = usePostStore.getState();

  const handleLogin = () => {
    // switchTab({ url: "/pages/mineHome/index" });
    if (isCheck) {
      handleUserLogin({ params: { studentid, password, setShowError } })
    } else {
      setShowError(true);
    }
  };

  const quicklogin=()=>{
    setShowError(false);
    if (isCheck) {
      handleUserLogin({ params: { studentid: "2024214381", password: "", setShowError } })
    }
  }
  const frocelogin=()=>{
    switchTab({ url: '/pages/indexHome/index' })
  }
    useEffect(() => {
    if (Taro.getStorageSync("token") && Taro.getStorageSync("sid")) {
      const sid = Taro.getStorageSync("sid");
      get(`/user/info/${sid}`)
      .then((res) => {
        console.log("userinfo",res.data);
        setId(res.data.Id);
        setStudentId(res.data.studentId);
        setAvatar(res.data.avatar);
        setUsername(res.data.name);
        setSchool(res.data.school);
        setPostStudentId(sid);
        switchTab({ url: '/pages/indexHome/index' })
      })
      .catch((err) => {
        console.log(err);
      });
    }
  }, []);

  const handlePolicyClick=()=>{
    setShowPolicyWindow(true);
  }

  return (
    <View className="login-page">
      <View className="login-page-logo">
       {/* <Image src={logo} mode="widthFix" className="login-page-logo-img" />
        <Text className="login-page-logo-text">校灵通</Text>
        <Text className="login-page-logo-desc">EventGlide</Text>*/}
        <Image src={Logo} mode="widthFix" style={{width:250,height:250}} />
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
            {/* <Text style={"color: #A84ADF"}>《用户协议》</Text>及 */}
            <Text style={"color: #A84ADF"} onClick={handlePolicyClick}>《校灵通隐私政策》</Text>中的内容
          </View>
        </View>
      </View>
      <View className="login-page-btn" onClick={handleLogin}>
        登录
      </View>
      {/*<View onClick={quicklogin}>
        快速登录
      </View>
      <View onClick={frocelogin}>
        强制登录
      </View>*/}
      {showPolicyWindow && <PolicyWindow setShowPolicyWindow={setShowPolicyWindow}/>}
    </View>
  );
};

export default Index;
