import { memo, useState } from 'react';
import { View, Image } from '@tarojs/components';
import './style.scss';
import { responseType } from '@/common/types/PostList';
import defaultAvatar from '@/common/assets/Postlist/波奇.jpg';
import favor from '@/common/svg/post/heart.svg';
import favorAct from '@/common/svg/post/heartAct.svg';
import TimeTranslation from '@/common/const/TimeTranslation';
import BlogReply from '@/modules/ReplyComment';

const BlogComment: React.FC<responseType | any> = memo((props) => {
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
    '为了让大家更好地了解该活动， 请介绍一下活动亮点，活动流程 和注意事项等内容......';

  return (
    <>
      <View className="BlogComment">
        <View className="BlogComment-content">
          <Image
            className="BlogComment-avatar"
            src={props.creator.avatar ? props.creator.avatar : defaultAvatar}
            mode="scaleToFill"
          />
          <View className="BlogComment-info">
            <View className="BlogComment-info-name">{props.creator.username ?? '校灵通'}</View>
            <View className="BlogComment-info-content">{props.content || defaultContent}</View>
            <View className="BlogComment-info-timesite">
              {TimeTranslation(props.commented_time)}&nbsp;&nbsp;
              {props.commented_pos}
              <View
                className="BlogComment-info-reply"
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
            className="BlogComment-favor"
            onClick={() => props.handleLikeComment(props.bid)}
            src={props.isLike === 'true' ? favorAct : favor}
            mode="widthFix"
          />
          <View className="BlogComment-likeNum">{props.likeNum}</View>
        </View>
        <View className="BlogComment-reply">
          {flattenReplies(props.reply).map((item, index) => (
            <View className="BlogComment-reply-item" key={index}>
              <BlogReply
                key={index}
                bid={item.bid}
                reply_creator={item.reply_creator}
                reply_content={item.reply_content}
                reply_time={item.reply_time}
                reply_pos={item.reply_pos}
                parentUserName={item.parentUserName}
                setIsVisible={props.setIsVisible}
                setReply_id={props.setReply_id}
              />
            </View>
          ))}
        </View>
      </View>
    </>
  );
});

export default BlogComment;
