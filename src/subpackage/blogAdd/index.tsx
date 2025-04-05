import Button from "@/common/components/Button";
import { View, Image, Input, Textarea } from "@tarojs/components";
import { switchTab, useDidShow } from "@tarojs/taro";
import { useState } from "react";
import "./index.scss";
import Picture from "@/common/components/Picture";
import draft from "@/common/svg/add/draft.svg";
import DraftWinodw from "@/modules/draftWinow";
import AlbumWindow from "@/modules/albumWindow";
import usePostStore from "@/store/PostStore";
import useUserStore from "@/store/userStore";
import post from "@/common/api/post";
import get from "@/common/api/get";
import LabelForm from "@/common/types/LabelForm";

const Index = () => {
  const { showImg: imgUrl } = usePostStore();
  const [isShowDraft, setIsShowDraft] = useState(false);
  const [isShowAlbum, setIsShowAlbum] = useState(false);
  const [pageImgUrl, setPageImgUrl] = useState<string[]>(imgUrl);
  const [title, setTitle] = useState("");
  const [introduce, setIntroduce] = useState("");
  const { studentid } = useUserStore();

  useDidShow(() => {
    get("/post/load").then((res) => {
      console.log(res);
      if(res.data===null) return;
      if (res.msg === "success") {
        setTitle(res.data.Title || "");
        setIntroduce(res.data.Introduce || "");
        if (Array.isArray(res.data.ShowImg)) {
          setPageImgUrl(res.data.ShowImg);
        }
        else if (typeof res.data.ShowImg === "string") {
          setPageImgUrl([res.data.ShowImg]);
        }
        else {
          setPageImgUrl([]);
        }
      }
    }).catch((err) => {
      console.log(err);
    });
  })

  const handleConfirm = () => {
    setIsShowDraft(false);
    const postInfo = { introduce, showImg: pageImgUrl, studentid, title };
    post("/post/create", postInfo)
      .then((res) => {
        console.log(res);
        switchTab({ url: "/pages/blogHome/index" });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const btn = {
    url: "/pages/blogHome/index",
    text: "发布",
    backgroundColor: "#CF79FA",
    textColor: "#FFFEFF",
    isBorder: false,
  };

  return (
    <>
      <View className="addblog-introduce">
        <View className="addblog-introduce-container">
          <View className="addblog-introduce-container-title">12/1000</View>
          <View className="addblog-introduce-container-content">
            <Input
              style={"font-size: 44rpx;color: #170A1E;font-family: SimHei;"}
              className="addblog-introduce-container-content-title"
              value={title}
              onInput={(e) => setTitle(e.detail.value)}
              placeholderClass="addblog-introduce-container-content-title-placeholder"
              placeholder="清晰名称能更好地让人注意哦~"
            ></Input>
            <Textarea
              className="addblog-introduce-container-content-desc"
              value={introduce}
              onInput={(e) => setIntroduce(e.detail.value)}
              placeholderClass="addblog-introduce-container-content-desc-placeholder"
              placeholder="为了让大家更好地了解该活动，请介绍一下活动亮点， 活动流程和注意事项等内容......"
            ></Textarea>
            <View className="addblog-introduce-container-content-pic">
              {pageImgUrl && pageImgUrl.map((item, index) => (
                <Picture
                  key={index}
                  src={item}
                  isShowDelete={true}
                  imgUrl={pageImgUrl}
                  setImgUrl={setPageImgUrl}
                />
              ))} 
              <View
                className="addblog-introduce-container-content-pic-addblog"
                onClick={() => setIsShowAlbum(true)}
              >
                +
              </View>
            </View>
          </View>
        </View>
        <View className="addblog-introduce-floor">
          <View
            className="addblog-introduce-floor-draft"
            onClick={() => setIsShowDraft(true)}
          >
            <Image
              src={draft}
              mode="widthFix"
              style={{ width: "60rpx" }}
            ></Image>
            <View className="addblog-introduce-floor-draft-text">存草稿</View>
          </View>
          <View
            className="addblog-introduce-floor-btn"
            onClick={() => handleConfirm()}
          >
            <Button {...btn} />
          </View>
        </View>
      </View>
      {isShowDraft && (
        <DraftWinodw
          windowTitle="是否保存草稿？"
          setIsShow={setIsShowDraft}
          type="blog"
          title={title}
          introduce={introduce}
          showImg={pageImgUrl}
          labelform={{} as LabelForm}
        />
      )}
      {isShowAlbum && (
        <AlbumWindow
          isVisiable={isShowAlbum}
          setIsVisiable={setIsShowAlbum}
          isOverlay={true}
          imgUrl={pageImgUrl}
          setImgUrl={setPageImgUrl}
          type={"event"}
        />
      )}
    </>
  );
};

export default Index;
