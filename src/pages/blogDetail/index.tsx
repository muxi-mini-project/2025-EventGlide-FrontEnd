import { View, Image, Input, Swiper, SwiperItem } from "@tarojs/components";
import { useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import "./index.scss";
import NavigationBar from "@/common/components/NavigationBar";
import favor from "@/common/svg/post/heart.svg";
import collect from "@/common/svg/post/star.svg";
import collectActive from "@/common/svg/post/starAct.svg";
import favorActive from "@/common/svg/post/heartAct.svg";
import comment from "@/common/svg/post/comment.svg";
import icon from "@/common/assets/Postlist/inputIcon.png";
import PostComment from "@/modules/PostComment";
import iconr from "@/common/assets/Postlist/inputIconr.png";
import { responseType } from "@/common/types/PostList";
import useUserStore from "@/store/userStore";
import usePostStore from "@/store/PostStore";
import handleInteraction from "@/common/const/Interaction";
import get from "@/common/api/get";
import post from "@/common/api/post";

const Index = () => {
  const defaultDesc =
    "为了让大家更好地了解该活动，请介绍一下活动 亮点，活动流程和注意事项等内容......";
  const [marginTop, setMarginTop] = useState(0);
  const [response, setResponse] = useState<responseType[]>([]);
  const [inputValue, setInputValue] = useState("");
  const { studentid, avatar, username } = useUserStore((state) => state);
  const { blogList, blogIndex } = usePostStore((state) => state);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRequest, setIsRequest] = useState(true);
  const windowWidth = Taro.getWindowInfo().windowWidth;
  const Item = blogList[blogIndex];
  const params = {
    subject: "post",
    studentid: studentid,
    targetid: Item.bid,
  };

  useEffect(() => {
    const query = Taro.createSelectorQuery();
    query.select(".blogDetail-content").boundingClientRect();
    query.exec((res) => {
      console.log(res[0]);
      setMarginTop(res[0].height + 280);
    });
  }, [blogIndex]);

  useEffect(() => {
    if (isRequest) {
      get(`/comment/load/${Item.bid}`)
        .then((res) => {
          setResponse(res.data);
          setIsRequest(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [isRequest]);

  const handleInput = (e: any) => {
    setInputValue(e.detail.value);
  };

  const handleLike = () => {
    if (Item.isLike === "true") {
      handleInteraction("dislike", params)
        .then((res) => {
          if (res.msg === "success") {
            
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (Item.isLike === "false") {
      handleInteraction("like", params)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleCollect = () => {
    if (Item.isCollect === "true") {
      handleInteraction("discollect", params)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (Item.isCollect === "false") {
      handleInteraction("collect", params)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleSubmit = () => {
    const newResponse: responseType = {
      bid: Item.bid,
      commented_pos: "华中师范大学",
      commented_time: "昨天8：00",
      content: inputValue,
      creator: {
        username: username,
        avatar: avatar,
        studentid,
      },
      likeNum: 111,
      replyNum: 111,
      reply: [],
    };
    post("/comment/create", newResponse)
     .then((res) => {
       console.log(res);
       setIsRequest(true);
      })
     .catch((err) => {
        console.log(err);
      });
    setInputValue("");
  };

  return (
    <View className="blogDetail">
      <NavigationBar url="/pages/blogHome/index" userInfo={Item.userInfo} />
      <View className="blogDetail-content">
        <View className="blogDetail-content-avatar">
          <Image
            src={Item.showImg[0]}
            className="blogDetail-content-avatar-img"
            style={`width: ${windowWidth}px; max-height: 700rpx;`}
            mode="widthFix"
          />
          <Swiper
            className="blogDetail-content-avatar-swiper"
            indicatorDots={true}
            circular={true}
            current={currentIndex}
            onChange={(e) => setCurrentIndex(e.detail.current)}
          >
            {Item.showImg.map((item, index) => (
              <SwiperItem
                key={index}
                className="blogDetail-content-avatar-swiper-item"
              >
                <Image
                  src={item}
                  className="blogDetail-content-avatar-swiper-item-img"
                  mode="widthFix"
                />
              </SwiperItem>
            ))}
          </Swiper>
        </View>
        <View className="blogDetail-content-title">{Item.title}</View>
        <View className="blogDetail-content-desc">
          {Item.introduce || defaultDesc}
        </View>
        <View className="blogDetail-content-timesite">
          昨天8：00 华中师范大学
        </View>
      </View>
      <View className="blogDetail-comment" style={{ top: `${marginTop}px` }}>
        <View className="blogDetail-comment-number">
          共{Item.commentNum}条评论
        </View>
        <View className="blogDetail-comment-input">
          <Image
            className="blogDetail-comment-input-avatar"
            mode="scaleToFill"
            src={avatar}
          ></Image>
          <View className="blogDetail-comment-input-text">
            <Input
              className="blogDetail-comment-input-text-input"
              placeholder="让大家听到你的声音"
              placeholderClass="blogDetail-comment-input-text-input"
              onInput={(e) => handleInput(e)}
              onConfirm={handleSubmit}
            ></Input>
            <Image
              className="blogDetail-comment-input-text-icon"
              mode="widthFix"
              src={iconr}
            ></Image>
          </View>
        </View>
        <View className="blogDetail-comment-list">
          {response.map((item, index) => (
            <PostComment
              key={index}
              creator={item.creator}
              content={item.content}
              commented_time={item.commented_time}
              commented_pos={item.commented_pos}
              reply={item.reply}
              likeNum={item.likeNum}
              replyNum={item.replyNum}
            ></PostComment>
          ))}
        </View>
      </View>
      <View className="blogDetail-footer">
        <View className="blogDetail-footer-input">
          <Image
            className="blogDetail-footer-input-icon"
            mode="widthFix"
            src={icon}
          ></Image>
          <Input
            className="blogDetail-footer-input-text"
            placeholder="说点什么"
            placeholderClass="blogDetail-footer-input-text"
            onInput={(e) => handleInput(e)}
            onConfirm={handleSubmit}
          ></Input>
        </View>
        <View className="blogDetail-footer-desc">
          <Image
            className="blogDetail-footer-desc-icon1"
            mode="widthFix"
            src={Item.isLike ? favorActive : favor}
            onClick={handleLike}
          ></Image>
          <View className="blogDetail-footer-desc-text">{Item.likeNum}</View>
          <Image
            className="blogDetail-footer-desc-icon2"
            mode="widthFix"
            src={Item.isCollect ? collectActive : collect}
            onClick={handleCollect}
          ></Image>
          <View className="blogDetail-footer-desc-text">{Item.collectNum}</View>
          <Image
            className="blogDetail-footer-desc-icon3"
            mode="widthFix"
            src={comment}
          ></Image>
          <View className="blogDetail-footer-desc-text">{Item.commentNum}</View>
        </View>
      </View>
    </View>
  );
};

export default Index;
