import { memo } from "react";
import { View, ScrollView, GridView } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useState, useEffect } from "react";
import Post from "@/modules/Post";
import "./style.scss";
import usePostStore from "@/store/PostStore";
import useUserStore from "@/store/userStore";
import get from "@/common/api/get";
import post from "@/common/api/post";
import { blogType } from "@/store/PostStore";

const MinePost: React.FC<{
  activeIndex: "release" | "favourite";
  activePage: "activity" | "post";
}> = memo(function ({ activeIndex, activePage }) {
  const [windowHeight, setWindowHeight] = useState(0);
  const [isShowList, setIsShowList] = useState<number[]>([0, 1, 2, 3]);
  // const { studentid } = useUserStore();
  // const { blogList } = usePostStore();
  const [minePostList, setMinePostList] = useState<blogType[]>([]);
  const studentid = "2023214563";

  useEffect(() => {
    if (activeIndex === "release") {
      get(`/post/own/${studentid}`)
        .then((res) => {
          const newPostList: blogType[] = [];
          res.data.forEach((item) => {
            newPostList.push(item as blogType);
          });
          setMinePostList(newPostList);
          handleScroll(windowHeight);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (activeIndex === "favourite") {
      post("/user/collect/post", { studentid })
        .then((res) => {
          console.log(res);
          const newPostList: blogType[] = [];
          res.data??[].forEach((item) => {
            newPostList.push(item as blogType);
          });
          setMinePostList(newPostList);
          handleScroll(windowHeight);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [activeIndex]);

  useEffect(() => {
    if (minePostList.length > 0 && windowHeight > 0 && activePage === "post") {
      console.log("handleScroll");
      handleScroll(windowHeight);
    }
  }, [activePage, windowHeight, minePostList]);

  Taro.useReady(() => {
    const newwindowHeight = Taro.getWindowInfo().windowHeight;
    setWindowHeight(newwindowHeight);
  });

  const handleScroll = (newwindowHeight?: number) => {
    let tempHeight = windowHeight;
    if (newwindowHeight) {
      tempHeight = newwindowHeight;
    }
    const query = Taro.createSelectorQuery();
    minePostList.forEach((_, index) => {
      query.select(`#post-item-${index}`).boundingClientRect();
    });
    query.exec((res) => {
      res.forEach((rect, index) => {
        if (!rect) return;
        const { top, bottom } = rect;
        if (top <= tempHeight && bottom >= 0) {
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
    <View className="blog-container">
      <ScrollView
        type="custom"
        style={{ height: "100vh" }}
        scrollY={true}
        onScroll={() => handleScroll()}
      >
        <GridView type="masonry" crossAxisGap={5} mainAxisGap={5}>
          {minePostList.map((item, index) => (
            <View key={index} id={`post-item-${index}`}>
              <Post
                item={item}
                index={index}
                isShowImg={isShowList.includes(index)}
              />
            </View>
          ))}
        </GridView>
      </ScrollView>
    </View>
  );
});

export default MinePost;
