import { View, Image } from "@tarojs/components";
import { memo, useState } from "react";
import "./index.scss";
import LetterType from "@/common/types/LetterType";
import classnames from "classnames";
import get from "@/common/api/get";
import { useDidShow } from "@tarojs/taro";

const LetterListItem: React.FC<LetterType> = memo(({ ...props }) => {
  return (
    <View className="letter-list-item">
      <Image
        src={props.userInfo.avatar}
        mode="widthFix"
        className="letter-list-item-avatar"
        lazyLoad={true}
      ></Image>
      <View className="letter-list-item-content">
        <View className="letter-list-item-content-username">
          {props.userInfo.username}
        </View>
        <View className="letter-list-item-content-message">
          {props.message}
        </View>
      </View>
      <Image
        mode="aspectFill"
        src={props.userInfo.avatar}
        className="letter-list-item-decPic"
      ></Image>
    </View>
  );
});

const Index = () => {
  const [isActive, setIsActive] = useState(true);
  const handleClick = (type: "favor" | "letter") => {
    setIsActive(!isActive);
    setShowPage(type);
  };
  const [showPage, setShowPage] = useState<"favor" | "letter">("favor");
  const [favor, setFavor] = useState<LetterType[]>([]);
  const [letter, setLetter] = useState<LetterType[]>([]);

  useDidShow(() => {
    get("/feed/list").then((res) => {
      if (res.data.likes || res.data.collects)
        setFavor([...res.data.likes, ...res.data.collects])
      if (res.data.comments || res.data.ats)
      setLetter([...res.data.comments, ...res.data.ats])
    }).catch((err) => {
      console.log(err);
    });
  });

  return (
    <View className="blogInfo-page">
      <View className="blogInfo-page-header">
        <View
          onClick={() => handleClick("favor")}
          className={classnames("blogInfo-page-header-item", {
            activeItem: isActive,
          })}
        >
          赞和收藏
        </View>
        <View
          onClick={() => handleClick("letter")}
          className={classnames("blogInfo-page-header-item", {
            activeItem: !isActive,
          })}
        >
          评论和@
        </View>
      </View>
      <View className="blogInfo-page-content">
        {showPage === "favor" && 
          favor.map((item, index) => <LetterListItem key={index} {...item} />)}
        {showPage === "letter" &&
          letter.map((item, index) => <LetterListItem key={index} {...item} />)}
      </View>
    </View>
  );
};

export default Index;
