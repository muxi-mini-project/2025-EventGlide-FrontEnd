import { View, Image } from "@tarojs/components";
import "./index.scss";
import MinePost from "@/modules/minePost/index";
import MineActivity from "@/modules/mineActivity/index";
import { navigateTo, useDidShow} from "@tarojs/taro";
import { useState, useEffect } from "react";
import classnames from "classnames";
import arrowheadw from "@/common/assets/arrowhead/引导箭头-白.png";
import arrowheadp from "@/common/assets/arrowhead/引导箭头-紫.png";
import search from "@/common/assets/Postlist/搜索.png";
import get from "@/common/api/get";
import useUserStore from "@/store/userStore";

const Index = () => {
  const [activePage, setActivePage] = useState<"activity" | "post">("post");
  const [activeIndex, setActiveIndex] = useState<"release" | "favourite">(
    "release",
  );
  const { studentid, avatar, username, school, setAvatar, setUsername, setSchool} =
    useUserStore();
  const testStudentid = "2023214563";
  
  useDidShow(() => {
    get(`/user/info/${testStudentid}`).then((res) => {
      console.log(res.data);
      setAvatar(res.data.avatar);
      setUsername(res.data.name);
      setSchool(res.data.school);
    }).catch ((err) => {
      console.log(err);
    });
  })

  return (
    <View className="mine-page">
      <View className="mine-user">
        <View className="mine-user-content">
          <Image className="mine-user-avatar" mode="aspectFit" src={avatar}></Image>
          <View className="mine-user-info">
            <View className="mine-user-name">{username}</View>
            <View className="mine-user-school">{school}</View>
          </View>
          <Image
            className="mine-user-arrowhead"
            mode="widthFix"
            src={arrowheadw}
            onClick={() => navigateTo({ url: "/pages/mineInfo/index" })}
          ></Image>
        </View>
        <View className="mine-user-check">
          <View className="mine-user-check-info">审核中</View>
          <Image
            className="mine-user-check-arrowhead"
            onClick={() => navigateTo({ url: "/pages/isChecking/index" })}
            mode="widthFix"
            src={arrowheadp}
          ></Image>
        </View>
      </View>
      <View className="mine-order">
        <View className="mine-order-title">
          <View className="mine-order-title-choice">
            <View
              className={classnames("mine-order-title-choice-left", {
                "active-decoration-left": activePage === "post",
              })}
              onClick={() => setActivePage("post")}
            >
              帖子
            </View>
            <View
              className={classnames("mine-order-title-choice-right", {
                "active-decoration-right": activePage === "activity",
              })}
              onClick={() => setActivePage("activity")}
            >
              活动
            </View>
          </View>
          <Image
            className="mine-order-title-search"
            mode="widthFix"
            src={search}
          ></Image>
          <View className="mine-order-title-line"></View>
          <View className="mine-order-title-index">
            <View
              className={classnames("mine-order-title-index-left", {
                "active-decoration-item": activeIndex === "release",
              })}
              onClick={() => setActiveIndex("release")}
            >
              发布
            </View>
            <View
              className={classnames("mine-order-title-index-right", {
                "active-decoration-item": activeIndex === "favourite",
              })}
              onClick={() => setActiveIndex("favourite")}
            >
              收藏
            </View>
          </View>
        </View>
        <View className="mine-order-content">
          {activePage === "post" ? (
            <MinePost activeIndex={activeIndex} activePage={activePage}  />
          ) : (
            <MineActivity activeIndex={activeIndex} activePage={activePage} />
          )}
        </View>
      </View>
    </View>
  );
};

export default Index;
