import { View, Image, ScrollView, GridView } from "@tarojs/components";
import "./index.scss";
import MineActivity from "@/modules/mineActivity/index";
import Taro, { navigateTo, useDidShow } from "@tarojs/taro";
import { useState, useEffect } from "react";
import classnames from "classnames";
import arrowheadw from "@/common/assets/arrowhead/引导箭头-白.png";
import arrowheadp from "@/common/assets/arrowhead/引导箭头-紫.png";
import get from "@/common/api/get";
import post from "@/common/api/post";
import useUserStore from "@/store/userStore";
import useActivityStore from "@/store/ActivityStore";
import { blogType } from "@/store/PostStore";
import { NavigationBarTabBar } from "@/common/components/NavigationBar";
import Post from "@/modules/Post";
import usePostStore from "@/store/PostStore";
import PostWindow from "@/modules/PostWindow";
import MinePageNull from "@/modules/null/components/minepagenull";
const Index = () => {
  const [activePage, setActivePage] = useState<"activity" | "post">("post");
  const [activeIndex, setActiveIndex] = useState<"release" |"like"| "favourite">(
    "release",
  );
  const [isShowActivityWindow, setIsShowActivityWindow] = useState(false);
  const [isShowList, setIsShowList] = useState<number[]>([0, 1, 2, 3]);
  const { setBlogIndex, setBackPage } = usePostStore();
  const [minePostList, setMinePostList] = useState<blogType[]>([]);
  const { avatar, studentid, username, school, setAvatar, setUsername, setSchool } =
    useUserStore();
  const { setIsSelect } = useActivityStore();

  useDidShow(() => {
    setIsSelect(false);
  });

  useDidShow(() => {
    get(`/user/info/${studentid}`)
      .then((res) => {
        console.log(res.data);
        setAvatar(res.data.avatar);
        setUsername(res.data.name);
        setSchool(res.data.school);
        console.log("avatar",avatar);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  useEffect(() => {
    if (activePage === "post") {
    if (activeIndex === "release") {
      get(`/post/own/${studentid}`)
        .then((res) => {
          console.log('发布：',res.data);
          if (res.data === null) {
            setMinePostList([]);
            return;
          }
          const newPostList: blogType[] = [];
          res.data.forEach((item) => {
            newPostList.push(item as blogType);
          });
          setMinePostList(newPostList);
          handleScroll();
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (activeIndex === "favourite") {
      post("/user/collect/post", { studentid })
        .then((res) => {
          console.log('收藏：',res);
          if (res.data === null) {
            setMinePostList([]);
            return;
          }
          const newPostList: blogType[] = [];
          if (res.msg === "success") {
            res.data.forEach((item) => {
              newPostList.push(item as blogType);
            });
            setMinePostList(newPostList);
          }
          handleScroll();
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (activeIndex === "like") {
      post("/user/like/post", { studentid })
        .then((res) => {
          console.log('点赞：',res);
          if (res.data === null) {
            setMinePostList([]);
            return;
          }
          const newPostList: blogType[] = [];
          if (res.msg === "success") {
            res.data.forEach((item) => {
              newPostList.push(item as blogType);
            });
            setMinePostList(newPostList);
          }
          handleScroll();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
  }, [activeIndex,activePage]);

  useEffect(() => {
    if (minePostList.length > 0 && activePage === "post") {
      console.log("handleScroll");
      handleScroll();
    }
  }, [activePage, minePostList]);

  const handleScroll = () => {
    const windowHeight = Taro.getWindowInfo().windowHeight;
    const query = Taro.createSelectorQuery();
    minePostList.forEach((_, index) => {
      query.select(`#post-item-${index}`).boundingClientRect();
    });
    query.exec((res) => {
      res.forEach((rect, index) => {
        if (!rect) return;
        const { top, bottom } = rect;
        if (top <= windowHeight && bottom >= 0) {
          setIsShowList((prevList) => {
            if (!prevList.includes(index)) {
              return [...prevList, index];
            }
            return prevList;
          });
        } else {
          setIsShowList((prevList) => {
            return prevList.filter((item) => item !== index);
          });
        }
      });
    });
  };

  return (
    <>
      <NavigationBarTabBar backgroundColor="#FFFFFF" title="我的" />
      <ScrollView
        className="mine-page"
        scrollY={true}
        type="custom"
        onScroll={() => handleScroll()}
        usingSticky={true}
        enhanced={true}
        showScrollbar={false}
        style={{ height: "calc(100vh - 180rpx)" }}
        id="scrollView"
      >
        <View className="mine-user">
          <View className="mine-user-content">
            <Image
              className="mine-user-avatar"
              mode="aspectFit"
              src={avatar}
            ></Image>
            <View className="mine-user-info">
              <View className="mine-user-name">{username}</View>
              <View className="mine-user-school">{school}</View>
            </View>
            <Image
              className="mine-user-arrowhead"
              mode="widthFix"
              src={arrowheadw}
              onClick={() => navigateTo({ url: "/subpackage/mineInfo/index" })}
            ></Image>
          </View>

        <View className="mine-user-check">
          <View className="mine-user-check-info">审核中</View>
          <Image
            className="mine-user-check-arrowhead"
            onClick={() => navigateTo({ url: "/subpackage/isChecking/index" })}
            mode="widthFix"
            src={arrowheadp}
          ></Image>
        </View>

        </View>
        <View className="mine-order-title" id="scrollView">
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
              className={classnames("mine-order-title-index-mid", {
                "active-decoration-item": activeIndex === "like",
              })}
              onClick={() => setActiveIndex("like")}
            >
              点赞
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
        {activePage === "post" ? (
          minePostList.length === 0 ? (
            <MinePageNull />
          ) : (
            <GridView type="masonry" crossAxisGap={5} mainAxisGap={5} padding={[10, 10, 10, 10]}>
              {minePostList.map((item, index) => (
                <View
                  key={index}
                  id={`post-item-${index}`}
                  onClick={() => {
                    setBlogIndex(item.bid);
                    setBackPage("mineHome");
                  }}
                >
                  <Post
                    item={item}
                    index={index}
                    isShowImg={isShowList.includes(index)}
                  />
                </View>
              ))}
            </GridView>
          )
        ) : (
          <MineActivity activeIndex={activeIndex} setIsShowActivityWindow={setIsShowActivityWindow} />
        )}
      </ScrollView>
      {isShowActivityWindow && (
        <PostWindow
          WindowType="active"
          setShowPostWindow={setIsShowActivityWindow}
        ></PostWindow>
      )}
    </>
  );
};

export default Index;
