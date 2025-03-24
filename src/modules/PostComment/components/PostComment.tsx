import { memo } from "react";
import { View, Image } from "@tarojs/components";
import "./style.scss";
import { responseType } from "@/common/types/PostList";
import defaultAvatar from "@/common/assets/Postlist/波奇.jpg";
import favor from "@/common/svg/post/heart.svg";
import favorAct from "@/common/svg/post/heartAct.svg";
import TimeTranslation from "@/common/const/TimeTranslation";
import ReplyComment from "@/modules/ReplyComment";

const PostComment: React.FC<responseType | any> = memo((props) => {
  const flattenReplies = (replies) => {
    return replies.flatMap((reply) => {
      const result = [reply];
      if (reply.sub_reply && reply.sub_reply.length > 0) {
        result.push(...flattenReplies(reply.sub_reply)); 
      }
      return result;
    });
  };
  const defaultContent =
    "为了让大家更好地了解该活动， 请介绍一下活动亮点，活动流程 和注意事项等内容......";

  const handleCommentLike = () => {
    props.onLikeComment(props.bid);
  };

  return (
    <>
      <View className="postComment">
        <View className="postComment-content">
          <Image
            className="postComment-avatar"
            src={props.creator.avatar ? props.creator.avatar : defaultAvatar}
            mode="scaleToFill"
          />
          <View className="postComment-info">
            <View className="postComment-info-name">
              {props.creator.username ?? "校灵通"}
            </View>
            <View className="postComment-info-content">
              {props.content || defaultContent}
            </View>
            <View className="postComment-info-timesite">
              {TimeTranslation(props.commented_time)}&nbsp;&nbsp;
              {props.commented_pos}
              <View
                className="postComment-info-reply"
                onClick={() => {
                  props.setIsVisible(true);
                  props.setReply_id(props.bid);
                }}
              >
                回复
              </View>
            </View>
          </View>
          <Image
            className="postComment-favor"
            onClick={handleCommentLike}
            src={props.isLike === "true" ? favorAct : favor}
            mode="widthFix"
          />
          <View className="postComment-likeNum">{props.likeNum}</View>
        </View>
        <View className="postComment-reply">
          {flattenReplies(props.reply).map((item, index) => (
            <View className="postComment-reply-item" key={index}>
              <ReplyComment
                key={index}
                bid={item.bid}
                reply_creator={item.reply_creator}
                reply_content={item.reply_content}
                reply_time={item.reply_time}
                reply_pos={item.reply_pos}
                setIsVisible={props.setIsVisible}
                parentUserName={item.parentUserName}
                setReply_id={props.setReply_id}
              />
            </View>
          ))}
        </View>
      </View>
    </>
  );
});

export default PostComment;
