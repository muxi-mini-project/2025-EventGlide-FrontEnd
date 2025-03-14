import { memo, useState } from "react";
import { View, Image } from "@tarojs/components";
import "./style.scss";
// import { PostCommentProps } from "@/common/types/PostList";
import { responseType } from "@/common/types/PostList";
import defaultAvatar from "@/common/assets/Postlist/波奇.jpg";
import favor from "@/common/svg/post/heart.svg";
import post from "@/common/api/post";
import useUserStore from "@/store/userStore";
import TimeTranslation from "@/common/const/TimeTranslation";

const PostComment: React.FC<responseType> = memo((props) => {
  console.log(props)
  // const { studentid } = useUserStore();
  // const [replyContent, setReplyContent] = useState("");
  // const pareams = {
  //   studentid: studentid,
  //   bid: props.bid,
  //   content: "",
  // }
  const defaultContent =
    "为了让大家更好地了解该活动， 请介绍一下活动亮点，活动流程 和注意事项等内容......";
  // const handleReply = async (content: string) => {

  // }
  return (
    <View className="postComment">
      <View className="postComment-content">
        <Image className="postComment-avatar" src={props.creator.avatar ? props.creator.avatar : defaultAvatar} mode="scaleToFill" />
        <View className="postComment-info">
          <View className="postComment-info-name">{props.creator.username?? "校灵通"}</View>
          <View className="postComment-info-content">{props.content || defaultContent}</View>
          <View className="postComment-info-timesite">
            {TimeTranslation(props.commented_time)}&nbsp;&nbsp;{props.commented_pos}
            <View className="postComment-info-reply" >回复</View>
          </View>
        </View>
        <Image className="postComment-favor" src={favor} mode="widthFix" />
      </View>
      <View className="postComment-reply">
        {props.reply.map((item, index) => (
          <View className="postComment-reply-item" key={index}>
            <PostComment
              key={index}
              bid={item.bid}
              creator={item.creator}
              content={item.content}
              commented_time={item.commented_time}
              commented_pos={item.commented_pos}
              reply={item.reply?? []}
              likeNum={item.likeNum}
              replyNum={item.replyNum}
            />
          </View>
        ))}
      </View>
    </View>
  );
});

export default PostComment;
