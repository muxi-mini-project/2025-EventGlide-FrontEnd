import { View, Image, Input } from "@tarojs/components";
import { navigateTo } from "@tarojs/taro";
import { useState, useEffect } from "react";
import "./index.scss";
// import avatar from "@/common/assets/Postlist/波奇.jpg";
import schoolSrc from "@/common/assets/mineInfo/学校.png";
import departmentSrc from "@/common/assets/mineInfo/院系.png";
import cardSrc from "@/common/assets/mineInfo/一卡通号.png";
import useUserStore from "@/store/userStore";
import AlbumWindow from "@/modules/albumWindow";
import classnames from "classnames";
import post from "@/common/api/post";

const Index = () => {
  const { studentid: studentId, username, school, college, avatar } = useUserStore(
    (state) => state,
  );
  const { setUsername } = useUserStore();
  const [inputValue, setInputValue] = useState("");
  const [isVisiable, setIsVisiable] = useState(false);
  const [imgUrl, setImgUrl] = useState<string[]>([avatar]);
  const [isShowPlaceholder, setIsShowPlaceholder] = useState(true);
  const handleInputChange = (e) => {
    setInputValue(e.detail.value);
  };
  const handleConfirm = () => {
    post("/user/username", { new_name: inputValue, studentid: studentId }).then((res) => {
      console.log(res);
      setUsername(inputValue);
    });
    setUsername(inputValue);
    setInputValue("");
  }
  return (
    <>
      <View className="mineInfo-page">
        <View className="mineInfo-user">
          <View className="mineInfo-container-top">
            <View className="mineInfo-container-column">头像</View>
            <View className="mineInfo-container-avatar">
              <Image
                className="mineInfo-container-img"
                style={
                  "border-radius: 50%;height: 80rpx;width: 80rpx;background-color: #F9F8FC;"
                }
                mode="aspectFill"
                src={imgUrl[0]}
                onClick={() => setIsVisiable(true)}
              />
            </View>
          </View>
          <View className="mineInfo-container-bottom">
            <View className="mineInfo-container-column">昵称</View>
            <View className="mineInfo-container-desc">
              <Input
                className="mineInfo-container-input"
                placeholder={isShowPlaceholder ? (username ? username : "点击设置昵称") : ""}
                placeholderClass="mineInfo-container-desc-placeholder"
                placeholderStyle="text-align: right"
                value={inputValue}
                onInput={handleInputChange}
                onConfirm={handleConfirm}
                onFocus={() => setIsShowPlaceholder(false)}
                onBlur={() => setIsShowPlaceholder(true)}
              />
            </View>
          </View>
        </View>
        <View className="mineInfo-desc">
          <View className="mineInfo-container-top">
            <View className="mineInfo-container-column">实名信息</View>
          </View>
          <View className="mineInfo-container">
            <View className="mineInfo-container-column">
              <Image
                className="mineInfo-container-img"
                mode="widthFix"
                src={schoolSrc}
              />
              学校
            </View>
            <View className="mineInfo-container-desc">{school}</View>
          </View>
          <View className="mineInfo-container">
            <View className="mineInfo-container-column">
              <Image
                className="mineInfo-container-img"
                mode="widthFix"
                src={departmentSrc}
              />
              院系
            </View>
            <View className="mineInfo-container-desc">
              {college ? college : "计算机学院"}
            </View>
          </View>
          <View className="mineInfo-container-bottom">
            <View className="mineInfo-container-column">
              <Image
                className="mineInfo-container-img"
                mode="widthFix"
                src={cardSrc}
              />
              一卡通号
            </View>
            <View className="mineInfo-container-desc">{studentId}</View>
          </View>
        </View>
        <View
          className="mineInfo-floor-btn"
          onClick={() => navigateTo({ url: "/pages/login/index" })}
        >
          退出登录
        </View>
      </View>
      <AlbumWindow
        isVisiable={isVisiable}
        setIsVisiable={setIsVisiable}
        isOverlay={true}
        imgUrl={imgUrl}
        setImgUrl={setImgUrl}
        type="event"
        count={1}
        isRequest={true}
      />
    </>
  );
};

export default Index;
