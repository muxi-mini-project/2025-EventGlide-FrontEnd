import { View, Image } from "@tarojs/components";
import { memo, useState } from "react";
import './index.scss'
import LetterType from "@/common/types/letterType";
import classnames from "classnames";
import avater from "@/common/assets/Postlist/波奇.jpg";
import testPic from "@/common/assets/Postlist/11.jpg";
import { favor, letter } from "@/common/types/letterType";

const LetterListItem: React.FC<LetterType> = memo(({ ...props }) => {

  return (
    <View className="letter-list-item">
      <Image src={avater} mode="widthFix" className="letter-list-item-avatar" lazyLoad={true}></Image>
      <View className="letter-list-item-content">
        <View className="letter-list-item-content-username">{props.username}</View>
        <View className="letter-list-item-content-message">{props.message}</View>
      </View>
      <Image mode="aspectFill" src={testPic} className="letter-list-item-decPic"></Image>
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
  return (
    <View className="blogInfo-page">
      <View className="blogInfo-page-header">
        <View onClick={() => handleClick("favor")} className={classnames("blogInfo-page-header-item", { "activeItem": isActive })}>赞和收藏</View>
        <View onClick={() => handleClick("letter")} className={classnames("blogInfo-page-header-item", { "activeItem": !isActive })}>评论和@</View>
      </View>
      <View className="blogInfo-page-content">
        {showPage === "favor" && (
            favor.map((item, index) => (
              <LetterListItem key={index} {...item} />
            ))
        )}
        {showPage === "letter" && (
            letter.map((item, index) => (
              <LetterListItem key={index} {...item} />
            ))
        )}
      </View>
    </View>
  );
};

export default Index;
