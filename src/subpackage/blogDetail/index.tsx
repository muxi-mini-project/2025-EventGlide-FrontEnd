import { View, Image, Input, Swiper, SwiperItem } from "@tarojs/components";
import { useState, useEffect, createContext } from "react";
import Taro, { useDidShow } from "@tarojs/taro";
import "./index.scss";
import { NavigationBar } from "@/common/components/NavigationBar";
import favor from "@/common/svg/post/heart.svg";
import collect from "@/common/svg/post/star.svg";
import collectActive from "@/common/svg/post/starAct.svg";
import favorActive from "@/common/svg/post/heartAct.svg";
import comment from "@/common/svg/post/comment.svg";
import icon from "@/common/assets/Postlist/inputIcon.png";
import iconr from "@/common/assets/Postlist/inputIconr.png";
import { responseType } from "@/common/types/PostList";
import useUserStore from "@/store/userStore";
import usePostStore from "@/store/PostStore";
import handleInteraction from "@/common/const/Interaction";
import get from "@/common/api/get";
import post from "@/common/api/post";
import BlogComment from "@/modules/BlogComment/components";
import ReplyWindow from "@/modules/ReplyWindow";

export const SetBlogReponseContext = createContext<(params: any) => void>(
  () => { },
);

const Index = () => {
  const defaultDesc =
    "为了让大家更好地了解该活动，请介绍一下活动 亮点，活动流程和注意事项等内容......";
  const [marginTop, setMarginTop] = useState(0);
  const [response, setResponse] = useState<responseType[]>([]);
  const [inputValue, setInputValue] = useState("");
  const {avatar } = useUserStore((state) => state);
  const studentid = Taro.getStorageSync('sid')
  const { blogList, blogIndex, setCommentNumChange, backPage, setBlogList } = usePostStore(
    (state) => state,
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRequest, setIsRequest] = useState(true);
  const [reply_id, setReply_id] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [commentInput, setCommentInput] = useState(false);
  const { setLikeNumChange, setCollectNumChange } = usePostStore(
    (state) => state,
  );
  const windowWidth = Taro.getWindowInfo().windowWidth;
  const Item = blogList[blogIndex];
  const params = {
    subject: "post",
    studentid: studentid,
    targetid: Item.bid,
  };

  const reply_params = {
    studentid: studentid,
    parent_id: reply_id,
    subject: "post",
  };

  const handleLikeComment = async (bid: string) => {
    const action =
      response.find((item) => item.bid === bid)?.isLike === "true"
        ? "dislike"
        : "like";
    const tag = handleInteraction(action, {
      studentid: studentid,
      subject: "comment",
      targetid: bid,
    });

    try {
      const res = await tag;
      if (res.msg === "success") {
        const updatedResponse = response.map((item) => {
          if (item.bid === bid) {
            const newIsLike = item.isLike === "true" ? "false" : "true";
            const newLikeNum =
              newIsLike === "true" ? item.likeNum + 1 : item.likeNum - 1;
            return {
              ...item,
              isLike: newIsLike,
              likeNum: newLikeNum,
            };
          }
          return item;
        });
        setResponse(updatedResponse);
      } else {
        Taro.showToast({
          title: "点赞失败",
          icon: "none",
          duration: 1000,
        });
      }
    } catch (err) {
      console.error(err);
      Taro.showToast({
        title: "点赞失败",
        icon: "none",
        duration: 1000,
      });
    }
  };

  useDidShow(() => {
    get(`/comment/load/${Item.bid}`).then((res) => {
      console.log(res);
      if (res.data === null) {
        setResponse([]);
        return;
      }
      setResponse(res.data);
    });
  });

  useEffect(() => {
    const query = Taro.createSelectorQuery();
    query.select(".blogDetail-content").boundingClientRect();
    query.exec((res) => {
      console.log(res[0]);
      setMarginTop(res[0].height + 100);
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
            setLikeNumChange(Item, 0);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (Item.isLike === "false") {
      handleInteraction("like", params)
        .then((res) => {
          if (res.msg === "success") {
            setLikeNumChange(Item, 1);
          }
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
          if (res.msg === "success") {
            setCollectNumChange(Item, 0);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (Item.isCollect === "false") {
      handleInteraction("collect", params)
        .then((res) => {
          if (res.msg === "success") {
            setCollectNumChange(Item, 1);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleSubmit = () => {
    if (inputValue === "") {
      Taro.showToast({
        title: "评论不能为空",
        icon: "none",
        duration: 300,
      });
    } else {
      const params = {
        content: inputValue,
        parent_id: Item.bid,
        studentid: studentid,
        subject: "post",
      };
      post("/comment/create", params).then((res) => {
        console.log(res.data);
        if (res.msg === "success") {
          setResponse([...response, res.data]);
          setCommentNumChange(Item);
          setInputValue("");
        }
      });
    }
  };

  const setBlogReponseContext = (params: any) => {
    console.log("你干嘛", response);
    if (params.content === "") {
      Taro.showToast({
        title: "评论不能为空",
        icon: "none",
        duration: 300,
      });
    } else {
      post("/comment/answer", params).then((res) => {
        if (res.msg === "success") {
          get(`/comment/load/${Item.bid}`).then((res) => {
            console.log(res);
            if (res.data === null) {
              setResponse([]);
              return;
            }
            setResponse(res.data);
          });
        }
      });
    }
  };

  return (
    <>
      <View className="blogDetail">
        <NavigationBar
          url={`/pages/${backPage}/index`}
          userInfo={Item.userInfo}
        />
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
            <View
              className="blogDetail-comment-input-text"
              onClick={() => setCommentInput(true)}>
              {inputValue?inputValue:"让大家听到你的声音"}
            </View>
          </View>
          <View className="blogDetail-comment-list">
            {response &&
              response.map((item, index) => (
                <BlogComment
                  key={index}
                  bid={item.bid}
                  creator={item.creator}
                  content={item.content}
                  commented_time={item.commented_time}
                  commented_pos={item.commented_pos}
                  reply={item.reply ?? []}
                  likeNum={item.likeNum}
                  isLike={item.isLike}
                  replyNum={item.replyNum}
                  setIsVisible={setIsVisible}
                  setReply_id={setReply_id}
                  handleLikeComment={handleLikeComment}
                ></BlogComment>
              ))}
          </View>
        </View>
        <View className="blogDetail-footer">
          <View 
          className="blogDetail-footer-input"
          onClick={() => setCommentInput(true)}>
            <Image
              className="blogDetail-footer-input-icon"
              mode="widthFix"
              src={icon}
            ></Image>
            <View 
            className="blogDetail-footer-input-text">{inputValue?inputValue:"说点什么"}</View>
          </View>
          <View className="blogDetail-footer-desc">
            <Image
              className="blogDetail-footer-desc-icon1"
              mode="widthFix"
              src={Item.isLike === "true" ? favorActive : favor}
              onClick={handleLike}
            ></Image>
            <View className="blogDetail-footer-desc-text">{Item.likeNum}</View>
            <Image
              className="blogDetail-footer-desc-icon2"
              mode="widthFix"
              src={Item.isCollect === "true" ? collectActive : collect}
              onClick={handleCollect}
            ></Image>
            <View className="blogDetail-footer-desc-text">
              {Item.collectNum}
            </View>
            <Image
              className="blogDetail-footer-desc-icon3"
              mode="widthFix"
              src={comment}
            ></Image>
            <View className="blogDetail-footer-desc-text">
              {Item.commentNum}
            </View>
          </View>
        </View>
        {commentInput && (
          <View className="comment-popup">
            <View className="comment-popup-cancel" onClick={() => setCommentInput(false)} />
            <View className="comment-popup-box">
              <Input
                className="comment-popup-box-input"
                placeholder="在此输入"
                placeholderClass="blogDetail-comment-input-text-input"
                value={inputValue}
                focus={true}
                onInput={(e) => handleInput(e)}
              ></Input>
              <View 
              className={`comment-popup-box-send ${inputValue?"comment-popup-box-send-active":""}`}
              onClick={()=>{
                handleSubmit();
                setCommentInput(false);
              }}>
                发送
                </View>
            </View>
          </View>
        )}
      </View>
      <SetBlogReponseContext.Provider value={setBlogReponseContext}>
        <ReplyWindow
          isVisible={isVisible}
          setIsVisible={setIsVisible}
          params={reply_params}
          reply_id={reply_id}
          page="post"
        />
      </SetBlogReponseContext.Provider>
    </>
  );
};

export default Index;
