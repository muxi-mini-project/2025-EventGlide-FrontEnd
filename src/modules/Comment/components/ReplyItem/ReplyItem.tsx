import './style.scss';
import { View, Image } from '@tarojs/components';
import { ReplyItemProps } from '@/common/types';
import { memo } from 'react';
import favor from '@/common/svg/post/heart.svg';
import favorAct from '@/common/svg/post/heartAct.svg';
import { useState } from 'react';
import handleInteraction from '@/common/utils/Interaction';
import formatTime from '@/common/utils/FormatTime';

const ReplyItem: React.FC<ReplyItemProps> = memo(({ ...props }) => {
  const [islike, setIslike] = useState(props.isLike);
  const [nums, setNums] = useState(props.likeNum);

  // 使用可选链操作符处理可能不存在的属性
  const creator = props.creator || props.replyCreator;
  const studentId = creator?.studentId || '';

  const param = {
    studentId: studentId,
    subject: 'comment',
    targetId: props.bid,
    receiver: studentId,
  };

  const clickLove = async () => {
    const action = islike === 'true' ? 'dislike' : 'like';
    const tag = handleInteraction(action, param);
    try {
      const res = await tag;
      if (res.msg === 'success') {
        if (action === 'like') {
          setIslike('true');
          setNums(nums + 1);
        } else if (action === 'dislike') {
          setIslike('false');
          setNums(nums - 1);
        }
      }
    } catch (error) {
      console.log('Error handling interaction:', error);
      return;
    }
  };

  return (
    <View className="ReplyComment" id={`comment-${props.bid}`}>
      <View className="ReplyComment-content">
        <Image
          className="ReplyComment-avatar"
          src={creator?.avatar || ''}
          mode="scaleToFill"
          style={
            props.son ? { width: '55rpx', height: '55rpx' } : { width: '70rpx', height: '70rpx' }
          }
        />
        <View
          className="ReplyComment-info"
          style={props.son ? { marginLeft: '95rpx' } : { marginLeft: '115rpx' }}
          onClick={() => {
            if (props.replycomment) {
              props.replycomment(true);
              props.setReplyId(props.bid);
            }
          }}
          onLongPress={() => {
            if (
              props.setCommentItems &&
              props.setCommentCreator &&
              props.setCommentid &&
              props.longClick
            ) {
              props.setCommentItems(props.content || props.replyContent || '');
              props.setCommentCreator(creator || { username: '', avatar: '', studentId: '' });
              props.setCommentid(props.bid);
              props.longClick();
            }
          }}
        >
          <View className="ReplyComment-info-name">{creator?.username || '校灵通'}</View>
          <View className="ReplyComment-info-content">
            {props.parentUserName && `@${props.parentUserName}:`}
            {props.content || props.replyContent}
          </View>
          <View className="ReplyComment-info-timesite">
            {formatTime(props.replyTime || props.commentedTime || '')}&nbsp;&nbsp;
            <View style={' color: #5E5064;'}>回复</View>
          </View>
        </View>
        <Image
          className="ReplyComment-favor"
          onClick={clickLove}
          src={islike === 'true' ? favorAct : favor}
          mode="widthFix"
        />
        <View className="ReplyComment-likeNum">{nums}</View>
      </View>
    </View>
  );
});

export default ReplyItem;
