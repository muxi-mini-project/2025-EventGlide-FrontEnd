import './style.scss';
import { View } from '@tarojs/components';
import ReplyItem from '../ReplyItem/ReplyItem';
import { useState } from 'react';
import { ReplyListProps } from '@/common/types';

const ReplyList: React.FC<ReplyListProps & { defaultExpand?: boolean }> = ({
  replies,
  replycomment,
  setReplyId,
  setCommentItems,
  setCommentCreator,
  setCommentid,
  longClick,
  expandLimit = 5,
  defaultExpand = false,
}) => {
  // 控制显示的回复数量，默认展开时显示全部，否则显示1条
  const [displayCount, setDisplayCount] = useState(defaultExpand ? replies?.length || 0 : 1);

  // 处理回复为null的情况
  const validReplies = replies || [];

  // 计算剩余未显示的回复数量
  const remainingCount = validReplies.length - displayCount;

  // 处理展开回复的点击事件
  const handleExpand = () => {
    // 每次展开不超过expandLimit个
    const newCount = Math.min(displayCount + expandLimit, validReplies.length);
    setDisplayCount(newCount);
  };

  // 如果没有回复，直接返回null
  if (validReplies.length === 0) {
    return null;
  }

  return (
    <View className="ReplyList">
      {/* 渲染当前要显示的回复 */}
      {validReplies.slice(0, displayCount).map((reply) => (
        <ReplyItem
          key={reply.bid}
          {...reply}
          isLike={reply.isLike || 'false'} // 默认未点赞
          likeNum={reply.likeNum || 0} // 默认点赞数为0
          replycomment={replycomment}
          setReplyId={setReplyId}
          setCommentItems={setCommentItems}
          setCommentCreator={setCommentCreator}
          setCommentid={setCommentid}
          longClick={longClick}
          son={true}
        />
      ))}

      {/* 渲染展开按钮（如果还有未显示的回复） */}
      {remainingCount > 0 && (
        <View className="ReplyList-expand" onClick={handleExpand}>
          <View className="ReplyList-expand-dash">——</View>
          {displayCount === 1 ? `展开${remainingCount}条回复` : `展开更多回复`}
        </View>
      )}
    </View>
  );
};

export default ReplyList;
