import "./style.scss";
import { View, Image, Text } from "@tarojs/components";
import { navigateTo } from "@tarojs/taro";
import favorite from "@/common/svg/post/heart.svg";
import favoriteActive from "@/common/svg/post/heartAct.svg";
import { memo, useState, useEffect } from "react";
import classnames from "classnames";
import usePostStore from "@/store/PostStore";
import useUserStore from "@/store/userStore";
import post from "@/common/api/post";
import handleInteraction from "@/common/const/Interaction";

const Post: React.FC<any> = memo(function ({ item, index, isShowImg }) {
  const [isVisiable, setIsVisiable] = useState(isShowImg);
  const { setBlogIndex, setLikeNumChange } = usePostStore();
  // const { studentid } = useUserStore();
  const studentid = "2023214563";

  useEffect(() => {
    setIsVisiable(isShowImg);
  }, [isShowImg]);

  const handleFavorite = () => {
    const params = {
      subject: "post",
      studentid: studentid,
      targetid: item.bid,
    }
    if (item.isLike === "true") {
      handleInteraction("dislike", params).then((res) => {
        if(res.msg==="success")
          setLikeNumChange(item, 0)
      }).catch((err) => {
        console.log(err)
      })
    }
    else if (item.isLike === "false") {
      handleInteraction("like", params).then((res) => {
        if(res.msg==="success")
          setLikeNumChange(item, 1)
      }).catch((err) => {
        console.log(err)
      })
    }
  }

  return (
    <View className="post-container">
      <Image
        className={classnames("img", { "img-active": isVisiable })}
        mode="widthFix"
        lazyLoad={true}
        src={isVisiable ? item.showImg[0] : ""}
        onClick={() => {
          navigateTo({ url: "/subpackage/blogDetail/index" });
          setBlogIndex(index);
        }}
      ></Image>
      <View className="content">
        <View className="title-container">
          <View className="post-user">
            <Image
              className="avatar"
              src={item.userInfo.avatar}
              mode="widthFix"
            ></Image>
          <Text className="username">{item.userInfo.username}</Text>
          </View>
          <View className="post-favorite">
            <Image
              className="avatar"
              src={item.isLike ==="true" ? favoriteActive : favorite}
              mode="widthFix"
              onClick={() => handleFavorite()}
            ></Image>
            <View className="count">{item.likeNum}</View>
          </View>
        </View>
      </View>
    </View>
  );
});

export default Post;
