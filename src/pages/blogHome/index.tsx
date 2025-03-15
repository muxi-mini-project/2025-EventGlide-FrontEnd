import { View, ScrollView, GridView, Image, Input } from "@tarojs/components";
import Taro, { navigateTo, useDidShow } from "@tarojs/taro";
import { useState, useEffect } from "react";
import listType from "@/common/types/PostList";
import "./index.scss";
import Post from "@/modules/Post/index";
import BlogAdd from "@/modules/blogAdd";
import AlbumWindow from "@/modules/albumWindow";
import searchpic from "@/common/assets/Postlist/搜索.png";
import Info from "@/common/assets/Postlist/info.png";
import usePostStore, { blogType } from "@/store/PostStore";
import get from "@/common/api/get";

const Index = () => {
  const [isAlbumVisiable, setIsAlbumVisiable] = useState(false);
  const [windowHeight, setWindowHeight] = useState(0);
  const [isShowList, setIsShowList] = useState<number[]>([]);
  const { showImg: imgUrl, setImgUrl } = usePostStore();
  const { blogList, setBlogList } = usePostStore();

  useDidShow(() => {
    get("/post/all").then((res) => {
      console.log(res.data);
      setBlogList(res.data);
    });
  });

  useEffect(() => {
    if (blogList === null) return;
    if (blogList.length > 0) {
      handleScroll(windowHeight);
    }
  }, [blogList]);

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
    blogList.forEach((_, index) => {
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
    <View className="blog-page">
      <BlogAdd setIsVisiable={setIsAlbumVisiable} />
      <AlbumWindow
        isVisiable={isAlbumVisiable}
        setIsVisiable={setIsAlbumVisiable}
        isOverlay={true}
        imgUrl={imgUrl}
        setImgUrl={setImgUrl}
        type={"blog"}
      />
      <View className="search-container">
        <Image
          src={Info}
          className="info-icon"
          mode="widthFix"
          onClick={() => navigateTo({ url: "/pages/blogInfo/index" })}
        />
        <View className="sticky-search">
          <View className="search-input-box">
            <Image src={searchpic} className="gap" mode="widthFix" />
            <Input
              className="search-input"
              placeholder="搜索你想要的"
              type="text"
            />
          </View>
          <View className="search-btn">搜索</View>
        </View>
      </View>
      <View className="blog-container">
        <ScrollView
          type="custom"
          style={{ height: "100vh" }}
          scrollY={true}
          onScroll={() => handleScroll()}
        >
          <GridView type="masonry" crossAxisGap={5} mainAxisGap={5}>
            {blogList === null
              ? null
              : blogList.map((item, index) => (
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
    </View>
  );
};

export default Index;
