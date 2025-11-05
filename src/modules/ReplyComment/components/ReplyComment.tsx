import './style.scss';
import { View, Image } from '@tarojs/components';
import { replyType } from '@/common/types/PostList';
import { memo } from 'react';
import TimeTranslation from '@/common/const/TimeTranslation';

const ReplyComment: React.FC<replyType | any> = memo(({ ...props }) => {
  return (
    <View className="ReplyComment">
      <View className="ReplyComment-content">
        <Image
          className="ReplyComment-avatar"
          src={props.reply_creator.avatar}
          mode="scaleToFill"
        />
        <View className="ReplyComment-info">
          <View className="ReplyComment-info-name">{props.reply_creator.username ?? '校灵通'}</View>
          <View className="ReplyComment-info-content">
            {props.parentUserName && `@${props.parentUserName}:`}
            {props.reply_content}
          </View>
          <View className="ReplyComment-info-timesite">
            {TimeTranslation(props.reply_time)}&nbsp;&nbsp;{props.reply_pos}
            <View
              onClick={() => {
                props.setIsVisible(true);
                props.setReply_id(props.bid);
              }}
              style={' color: #5E5064;'}
            >
              回复
            </View>
          </View>
        </View>
      </View>
    </View>
  );
});

export default ReplyComment;
