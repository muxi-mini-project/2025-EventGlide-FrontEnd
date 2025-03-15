import Button from "@/common/components/Button";
import { View, Image, Input, Textarea } from "@tarojs/components";
import { useState } from "react";
import "./index.scss";
import Picture from "@/common/components/Picture";
import draft from "@/common/svg/add/draft.svg";
import DraftWinodw from "@/modules/draftWinow";
import AlbumWindow from "@/modules/albumWindow";
import useActiveInfoStore from "@/store/activeInfoStore";

const Index = () => {
  const [isShowDraft, setIsShowDraft] = useState(false);
  const [isShowAlbum, setIsShowAlbum] = useState(false);
  const [imgUrl, setImgUrl] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { setBasicInfo } = useActiveInfoStore();

  const btn = {
    url: "/pages/addLabel/index",
    text: "下一步",
    backgroundColor: "#CF79FA",
    textColor: "#FFFEFF",
    isBorder: false,
  };

  return (
    <>
      <View className="add-introduce">
        <View className="add-introduce-container">
          <View className="add-introduce-container-title">12/1000</View>
          <View className="add-introduce-container-content">
            <Input
              style={"font-size: 44rpx;color: #170A1E;font-family: SimHei;"}
              className="add-introduce-container-content-title"
              value={title}
              onInput={(e) => setTitle(e.detail.value)}
              placeholderClass="add-introduce-container-content-title-placeholder"
              placeholder="清晰名称能更好地让人注意哦~"
            ></Input>
            <Textarea
              className="add-introduce-container-content-desc"
              value={description}
              onInput={(e) => setDescription(e.detail.value)}
              placeholderClass="add-introduce-container-content-desc-placeholder"
              placeholder="为了让大家更好地了解该活动，请介绍一下活动亮点， 活动流程和注意事项等内容......"
            ></Textarea>
            <View className="add-introduce-container-content-pic">
              {imgUrl.map((item, index) => (
                <Picture key={index} src={item} isShowDelete={true} imgUrl={imgUrl} setImgUrl={setImgUrl}/>
              ))}
              <View
                className="add-introduce-container-content-pic-add"
                onClick={() => setIsShowAlbum(true)}
              >
                +
              </View>
            </View>
          </View>
        </View>
        <View className="add-introduce-floor">
          <View
            className="add-introduce-floor-draft"
            onClick={() => setIsShowDraft(true)}
          >
            <Image
              src={draft}
              mode="widthFix"
              style={{ width: "60rpx" }}
            ></Image>
            <View className="add-introduce-floor-draft-text">存草稿</View>
          </View>
          <View
            className="add-introduce-floor-btn"
            onClick={() => setBasicInfo(title, description, imgUrl)}
          >
            <Button {...btn} />
          </View>
        </View>
      </View>
      {isShowDraft && (
        <DraftWinodw title="是否保存草稿？" setIsShow={setIsShowDraft} />
      )}
      {isShowAlbum && (
        <AlbumWindow
          isVisiable={isShowAlbum}
          setIsVisiable={setIsShowAlbum}
          isOverlay={true}
          imgUrl={imgUrl}
          setImgUrl={setImgUrl}
          type={"event"}
        />
      )}
    </>
  );
};

export default Index;
