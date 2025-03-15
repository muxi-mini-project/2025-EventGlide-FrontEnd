import { View, Image, Input } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useState, useEffect } from "react";
import "./index.scss";
import NavigationBar from "@/common/components/NavigationBar";
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

// const Test: responseType[] = [
//   {
//     bid: "^i!a",
//     commented_pos: "华中师范大学",
//     commented_time: "2025-03-14 17:00:18 +0800 CST",
//     content: "校运会太短了",
//     creator: {
//       studentid: "2023214563",
//       username: "野子",
//       avatar: "http://img.inside-me.top/FuNfxAsvBcwK1IqPUMx372xijlZU",
//     },
//     likeNum: 0,
//     reply: [],
//     replyNum: 0,
//   },
// ];

const Index = () => {
  const {
    selectedItem,
    setSelectedItem,
    setLikeNumChange,
    setCollectNumChange,
  } = useActivityStore();
  const [inputValue, setInputValue] = useState("");
  const [response, setResponse] = useState<responseType[]>([]);
  const { studentid } = useUserStore();
  const params = {
    studentid: studentid,
    subject: "activity",
    targetid: selectedItem.bid,
  };

  const handleInput = (e: any) => {
    setInputValue(e.detail.value);
  };

  useEffect(() => {
    get(`/comment/load/${selectedItem.bid}`).then((res) => {
      if (res.data === null) {
        setResponse([]);
        return;
      }
      setResponse(res.data);
    });
  }, []);

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
          setSelectedItem({...selectedItem, commentNum: selectedItem.commentNum + 1 })
          setInputValue("");
        }
      });
    }
  };

  return (
    <View className="actComment">
      <NavigationBar
        url="/pages/indexHome/index"
        userInfo={selectedItem.userInfo}
      />
      <View className="actComment-title">
        共{selectedItem.commentNum}条评论
      </View>
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
            likeNum={item.likeNum}
            replyNum={item.replyNum}
          />
        ))}
      </View>
      <View className="actComment-gap"></View>
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
  );
};

export default Index;
