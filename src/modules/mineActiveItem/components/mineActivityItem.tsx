import React, { memo } from "react";
import { View, Image } from "@tarojs/components";
import { MineActivityList } from "@/common/types/ActiveList";
import "./style.scss";
import avatar from "@/common/assets/Postlist/波奇.jpg";
import favor from "@/common/svg/post/star.svg";
import favorActive from "@/common/svg/post/starAct.svg";
import commentpic from "@/common/svg/post/comment.svg";

const MineActivityItem: React.FC<MineActivityList> = memo(({ ...props }) => {
  return (
    <View className="mine-activity-container">
      <Image className="mine-activity-avatar" src={props.avatar}></Image>
      <View className="mine-activity-content">
        <View className="mine-activity-content-uername">{props.name}</View>
        <View className="mine-activity-content-title">{props.title}</View>
      </View>
      <View className="mine-activity-info">
        <View className="mine-activity-content-picture">
          <View className="mine-activity-content-picture-box"></View>
          {props.showImg && props.showImg.length > 0 && props.showImg.map((item, index) => {
            return (
              <Image
                className="mine-activity-content-picture-img"
                mode="aspectFill"
                src={item}
                key={index}
              ></Image>
            );
          })}
        </View>
        <View className="mine-activity-content-favor">
          <Image
            className="mine-activity-content-favor-img"
            mode="widthFix"
            src={props.isLike === "true" ? favorActive : favor}
          ></Image>
          <View className="mine-activity-content-favor-num">{props.likes}</View>
        </View>
        <View className="mine-activity-content-comment">
          <Image
            className="mine-activity-content-comment-img"
            mode="widthFix"
            style={"width: 36rpx"}
            src={commentpic}
          ></Image>
          <View className="mine-activity-content-comment-num">
            {props.comment}
          </View>
        </View>
      </View>
    </View>
  );
});

export default MineActivityItem;
