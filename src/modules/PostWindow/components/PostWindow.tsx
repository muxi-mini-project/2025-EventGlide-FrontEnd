import "./style.scss";
import { View, Image, Text } from "@tarojs/components";
import { useState, memo } from "react";
import Taro from "@tarojs/taro";
import Picture from "@/common/components/Picture";
import { navigateTo } from "@tarojs/taro";
import favor from "@/common/svg/post/star.svg";
import favorAct from "@/common/svg/post/starAct.svg";
import commentPic from "@/common/svg/post/comment.svg";
import useActiveInfoStore from "@/store/activeInfoStore";
import useActivityStore from "@/store/ActivityStore";
import useUserStore from "@/store/userStore";
import post from "@/common/api/post";
import handleInteraction from "@/common/const/Interaction";

const Label: React.FC<{ text: string }> = memo(({ text }) => {
  return <View className="post-window-label-item">{text}</View>;
});

const AddConfirm: React.FC = memo(() => {
  const { studentid } = useUserStore((state) => state);
  const { introduce, title, showImg, labelform } = useActiveInfoStore(
    (state) => state,
  );
  const activeInfo = {
    introduce,
    labelform,
    showImg,
    studentid,
    title,
  };
  
  const handleConfirm = () => {
    console.log(activeInfo);
    post("/act/create", activeInfo)
      .then((res) => {
        if (res.msg !== "success") {
          Taro.showToast({
            title: `${res.msg}`,
            icon: "none",
            duration: 2000,
          })
        };
        if (res.msg === "success") {
          navigateTo({ url: "/subpackage/addSuccess/index" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <View className="post-window-footer-confirm" onClick={handleConfirm}>
      确定
    </View>
  );
});

const ActiveWindow: React.FC<{
  favorNum: number;
  commentNum: number;
  isCollect: string;
  setShowPostWindow: (show: boolean) => void;
}> = memo(({ ...props }) => {
  const { studentid } = useUserStore((state) => state);
  const { setCollectNumChange, selectedItem, setSelectedItem } = useActivityStore();
  const params = {
    studentid: studentid,
    subject: "activity",
    targetid: selectedItem.bid,
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


  return (
    <View className="post-window-footer-active">
      <View className="post-window-footer-active-item">
        <Image
          src={props.isCollect === "true" ? favorAct : favor}
          className="pwfai-img"
          onClick={handleCollect}
        ></Image>
        <View>{props.favorNum}</View>
      </View>
      <View className="post-window-footer-active-item">
        <Image
          onClick={() => {
            navigateTo({ url: "/subpackage/actComment/index" });
            props.setShowPostWindow(false);
          }}
          src={commentPic}
          mode="widthFix"
          className="pwfai-img"
          style={"width: 36rpx;"}
        ></Image>
        <View>{props.commentNum}</View>
      </View>
    </View>
  );
});

const PostWindow: React.FC<{
  WindowType: "add" | "active";
  setShowPostWindow: (show: boolean) => void;
}> = memo(({ ...props }) => {
  //草稿
  const {
    title,
    introduce: description,
    showImg: imgUrl,
    labelform,
  } = useActiveInfoStore((state) => state);
  const [showPic, setShowPic] = useState<string[]>(imgUrl);
  let signText = "无需报名";
  if (labelform.if_register === "是") signText = "需要报名";
  const labelList = [labelform.type, labelform.holderType, signText];
  const defaultTitle = "活动名称";
  const defaultDescription =
    "为了让大家更好地了解该活动，请介绍一下活动亮点， 活动流程和注意事项等内容......";
  //活动展示
  const activeItem = useActivityStore((state) => state.selectedItem);

  switch (props.WindowType) {
    case "add": {
      return (
        <View className="post-window">
          <View className="post-window-background"></View>
          <View className="post-window-container">
            <View
              className="post-window-close"
              onClick={() => props.setShowPostWindow(false)}
            >
              ×
            </View>
            <View className="post-window-header">
              {title !== "" ? title : defaultTitle}
            </View>
            <View className="post-window-gapline1"></View>
            <View className="post-window-content">
              {description !== "" ? description : defaultDescription}
            </View>
            <View className="post-window-label">
              {labelList.map((item, index) => (
                <Label key={index} text={item}></Label>
              ))}
            </View>
            <View className="post-window-pic">
              {showPic.map((item, index) => (
                <Picture
                  key={index}
                  src={item}
                  isShowDelete={true}
                  imgUrl={[]}
                  setImgUrl={([]) => {}}
                ></Picture>
              ))}
            </View>
            <View className="post-window-gapline2"></View>
            <View className="post-window-footer">
              <AddConfirm></AddConfirm>
            </View>
          </View>
        </View>
      );
    }
    case "active": {
      const showList = activeItem;
      console.log(showList);
      const imgList = showList.showImg===null?[]:showList.showImg.map((img) => ({
        src: img,
        isShowDelete: false,
      }));
      let registerText = "无需报名";
      if (showList.if_register) registerText = "需要报名";
      const labelList2 = [showList.type, showList.holderType, registerText];
      return (
        <View className="post-window">
          <View className="post-window-background"></View>
          <View className="post-window-container">
            <View
              className="post-window-close"
              onClick={() => props.setShowPostWindow(false)}
            >
              ×
            </View>
            <View className="post-window-header">{showList.title}</View>
            <View className="post-window-gapline1"></View>
            <View className="post-window-content">
              {showList.introduce ? showList.introduce : "暂无介绍"}
            </View>
            <View className="post-window-label">
              {labelList2.map((item, index) => (
                <Label key={index} text={item}></Label>
              ))}
            </View>
            <View className="post-window-pic">
              {(imgList===null?[]:imgList).map((item, index) => (
                <Picture
                  key={index}
                  src={item.src}
                  isShowDelete={item.isShowDelete}
                  imgUrl={[]}
                  setImgUrl={([]) => {}}
                ></Picture>
              ))}
            </View>
            <View className="post-window-gapline2"></View>
            <View className="post-window-footer">
              <ActiveWindow
                isCollect={showList.isCollect}
                favorNum={showList.collectNum}
                commentNum={showList.commentNum}
                setShowPostWindow={props.setShowPostWindow}
              />
            </View>
          </View>
        </View>
      );
    }
    default: {
      return null;
    }
  }
});

export default PostWindow;
