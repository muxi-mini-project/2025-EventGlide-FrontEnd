import { View, Image, Input, Span } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import { useState, useEffect, createContext, useRef } from "react";
import "./index.scss";
import { NavigationBar } from "@/common/components/NavigationBar";
import PostComment from "@/modules/PostComment";
import favor from "@/common/svg/post/heart.svg";
import collect from "@/common/svg/post/star.svg";
import comment from "@/common/svg/post/comment.svg";
import icon from "@/common/assets/Postlist/inputIcon.png";
import collectActive from "@/common/svg/post/starAct.svg";
import favorActive from "@/common/svg/post/heartAct.svg";
import get from "@/common/api/get";
import post from "@/common/api/post";
import { responseType } from "@/common/types/PostList";
import useActivityStore from "@/store/ActivityStore";
import useUserStore from "@/store/userStore";
import handleInteraction from "@/common/const/Interaction";
import ReplyWindow from "@/modules/ReplyWindow";
import { ScrollView } from "@tarojs/components";

export const SetReponseContext = createContext<(params: any) => void>(() => {});

const Index = () => {
  const {
    selectedItem,
    setSelectedItem,
    setLikeNumChange,
    setCollectNumChange,
    setIsSelect,
  } = useActivityStore();
  const [inputValue, setInputValue] = useState("");
  const [response, setResponse] = useState<responseType[]>([]);
  const [reply_id, setReply_id] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const { studentid } = useUserStore();
  const params = {
    studentid: studentid,
    subject: "activity",
    targetid: selectedItem.bid,
  };
  
  console.log(selectedItem);
  
  const [isTouchingHandle, setIsTouchingHandle] = useState(false);
  const [commentPanelPosition, setCommentPanelPosition] = useState(0);
  const [commentPanelHeight, setCommentPanelHeight] = useState(0);
  const [startY, setStartY] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(0);
  const scrollViewRef = useRef<any>(null);

  const reply_params = {
    studentid: studentid,
    parent_id: reply_id,
    subject: "comment",
  };

  const handleInput = (e: any) => {
    setInputValue(e.detail.value);
  };

  useDidShow(() => {
    setIsSelect(false);
  });
  
  useEffect(() => {
    get(`/comment/load/${selectedItem.bid}`).then((res) => {
      if (res.data === null) {
        setResponse([]);
        return;
      }
      console.log(res.data);
      setResponse(res.data);
    });
  }, []);

  const setReponseContext = (params: any) => {
    if (params.content === "") {
      Taro.showToast({
        title: "评论不能为空",
        icon: "none",
        duration: 300,
      });
    } else {
      post("/comment/answer", params).then((res) => {
        console.log(res);
        if (res.msg === "success") {
          get(`/comment/load/${selectedItem.bid}`).then((res) => {
            if (res.data === null) {
              setResponse([]);
              return;
            }
            console.log(res.data);
            setResponse(res.data);
          });
        }
      });
    }
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

  const handleLike = () => {
    if (selectedItem.isLike === "true") {
      handleInteraction("dislike", params)
        .then((res) => {
          if (res.msg === "success") {
            setLikeNumChange(selectedItem.bid, "reduce");
            setSelectedItem({
              ...selectedItem,
              isLike: "false",
              likeNum: selectedItem.likeNum - 1,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (selectedItem.isLike === "false") {
      handleInteraction("like", params)
        .then((res) => {
          if (res.msg === "success") {
            setLikeNumChange(selectedItem.bid, "add");
            setSelectedItem({
              ...selectedItem,
              isLike: "true",
              likeNum: selectedItem.likeNum + 1,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleCollect = () => {
    if (selectedItem.isCollect === "true") {
      handleInteraction("discollect", params)
        .then((res) => {
          if (res.msg === "success") {
            setCollectNumChange(selectedItem.bid, "reduce");
            setSelectedItem({
              ...selectedItem,
              isCollect: "false",
              collectNum: selectedItem.collectNum - 1,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (selectedItem.isCollect === "false") {
      handleInteraction("collect", params)
        .then((res) => {
          if (res.msg === "success") {
            setCollectNumChange(selectedItem.bid, "add");
            setSelectedItem({
              ...selectedItem,
              isCollect: "true",
              collectNum: selectedItem.collectNum + 1,
            });
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
        parent_id: selectedItem.bid,
        studentid: studentid,
        subject: "activity",
      };
      post("/comment/create", params).then((res) => {
        console.log(res.data);
        if (res.msg === "success") {
          setResponse([...response, res.data]);
          setSelectedItem({
            ...selectedItem,
            commentNum: selectedItem.commentNum + 1,
          });
          setInputValue("");
        }
      });
    }
  };

  const handleTouchStart = (e: any) => {
    setStartY(e.touches[0].clientY);
    setIsTouchingHandle(true);
  };

  const handleTouchMove = (e: any) => {
    if (!isTouchingHandle) return;
    
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - startY;  
    
    let newPosition = currentPosition - deltaY;
    const maxPosition = 140 + 220*((selectedItem.showImg?.length ?? 0)%3);
        
    if (newPosition < 0) newPosition = 0;
    if (newPosition > maxPosition) newPosition = maxPosition;
    setCommentPanelPosition(newPosition);
    setCommentPanelHeight(newPosition);
    setStartY(currentY);
    setCurrentPosition(newPosition);
  };

  const handleTouchEnd = () => {
    setIsTouchingHandle(false);
  };

  return (
    <>
      <View className="actComment">
        <NavigationBar
          url="/pages/indexHome/index"
          userInfo={selectedItem.userInfo}
        />
        <View style={{height:"150rpx"}}/>
        <View 
          className="post-content"
        >
          <View style={{padding:5,marginLeft:"40rpx",marginRight:"40rpx"}}>
            <View style={{flexDirection: 'row',flexWrap: 'wrap',gap:10,marginTop:10}}>
              <View style={{fontSize:20,fontWeight:400,color:"#170A1E"}}>{selectedItem.title}</View>
              <View style={{fontSize:16,fontWeight:400,color:"#5E5064"}}>{selectedItem.introduce}</View>
            </View>
            <View style={{flexDirection: 'row',flexWrap: 'wrap',gap:10,marginTop:10}}>
              {(selectedItem.showImg || []).map((item, index) => (
                <Image
                  key={index}
                  src={item}
                  mode="widthFix"
                  style={{ width: "200rpx", height: "200rpx" ,marginRight:"10rpx",marginBottom:"10rpx",borderRadius:10}}
                />
              ))}
            </View>
          </View>
        </View>

        <View 
          className="drag-handle"
          style={{
            transform: `translateY(-${commentPanelPosition}rpx)`,
            transition: isTouchingHandle ? 'none' : 'transform 0.3s ease'
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        >
          <View className="drag-handle-bar"></View>
          <View style={{
            width:"100%",
            marginTop:"10rpx",
          }}>
            <Span style={{fontSize:14,fontWeight:400,marginLeft:"50rpx",marginRight:'30rpx',color:"#5E5064"}}>
              回复 {selectedItem.commentNum}
            </Span>
            <Span style={{fontSize:14,fontWeight:400,margin:"20rpx",color:"#5E5064"}}>
              点赞 {selectedItem.likeNum}
            </Span>
            <Span style={{fontSize:14,fontWeight:400,margin:"30rpx",color:"#5E5064"}}>
              收藏 {selectedItem.collectNum}
            </Span>
          </View>
        </View>

        <View 
          className="comment-panel"
          style={{
            transform: `translateY(-${commentPanelPosition}rpx)`,
            transition: isTouchingHandle ? 'none' : 'transform 0.3s ease'
          }}
        >
          <ScrollView
            scrollY={true}
            showScrollbar={false}
            style={{ 
              height: commentPanelHeight > 0 
                ? `calc(100vh - 600rpx + ${commentPanelPosition}rpx)`
                : "calc(100vh - 600rpx)" 
            }}
            ref={scrollViewRef}
          >
            <View className="actComment-container">
              {response.map((item, index) => (
                <PostComment
                  key={index}
                  bid={item.bid}
                  creator={item.creator}
                  content={item.content}
                  commented_time={item.commented_time}
                  commented_pos={item.commented_pos}
                  reply={item.reply ?? []}
                  isLike={item.isLike}
                  likeNum={item.likeNum}
                  replyNum={item.replyNum}
                  setIsVisible={setIsVisible}
                  setReply_id={setReply_id}
                  onLikeComment={handleLikeComment}
                />
              ))}
            </View>
          </ScrollView>
        </View>

        <View className="actComment-footer">
          <View className="actComment-footer-input">
            <Image
              className="actComment-footer-input-icon"
              mode="widthFix"
              src={icon}
            ></Image>
            <Input
              className="actComment-footer-input-text"
              placeholder="说点什么"
              placeholderClass="actComment-footer-input-text"
              value={inputValue}
              onInput={(e) => handleInput(e)}
              onConfirm={() => handleSubmit()}
            ></Input>
          </View>
          <View className="actComment-footer-desc">
            <Image
              className="actComment-footer-desc-icon1"
              mode="widthFix"
              src={selectedItem.isLike === "true" ? favorActive : favor}
              onClick={handleLike}
            ></Image>
            <View className="actComment-footer-desc-text">
              {selectedItem.likeNum}
            </View>
            <Image
              className="actComment-footer-desc-icon2"
              mode="widthFix"
              src={selectedItem.isCollect === "true" ? collectActive : collect}
              onClick={handleCollect}
            ></Image>
            <View className="actComment-footer-desc-text">
              {selectedItem.collectNum}
            </View>
            <Image
              className="actComment-footer-desc-icon3"
              mode="widthFix"
              src={comment}
            ></Image>
            <View className="actComment-footer-desc-text">
              {selectedItem.commentNum}
            </View>
          </View>
        </View>
      </View>

      <SetReponseContext.Provider value={setReponseContext}>
        <ReplyWindow
          isVisible={isVisible}
          setIsVisible={setIsVisible}
          params={reply_params}
          page="activity"
        />
      </SetReponseContext.Provider>
    </>
  );
};

export default Index;