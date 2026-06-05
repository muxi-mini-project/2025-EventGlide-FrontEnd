import './style.scss';
import { View } from '@tarojs/components';
import CommentItem from '../CommentItem/CommentItem';
import { CommentListProps } from '@/common/types';

const CommentList: React.FC<CommentListProps & { targetCommentBid?: string }> = ({
  comments,
  replycomment,
  setReplyId,
  setCommentItems,
  setCommentCreator,
  setCommentid,
  longClick,
  expandLimit = 5,
  targetCommentBid,
}) => {
  // 如果没有评论数据，显示空状态
  if (!comments || comments.length === 0) {
    return (
      <View className="CommentList-empty">
        <View className="CommentList-empty-text">暂无评论，快来发表第一条评论吧</View>
      </View>
    );
  }
  const isTargetChildComment = (parentComment: any): boolean => {
    if (!targetCommentBid) return false;
    if (parentComment.bid === targetCommentBid) return false;
    if (parentComment.reply && parentComment.reply.length > 0) {
      const childIndex = parentComment.reply.findIndex(
        (child: any) => child.bid === targetCommentBid
      );
      if (childIndex === 0) return false;
      return childIndex > 0;
    }
    return false;
  };

  return (
    <View className="CommentList">
      {/* 渲染评论列表 */}
      {comments.map((comment) => (
        <CommentItem
          key={comment.bid}
          comment={comment}
          replycomment={replycomment}
          setReplyId={setReplyId}
          setCommentItems={setCommentItems}
          setCommentCreator={setCommentCreator}
          setCommentid={setCommentid}
          longClick={longClick}
          expandLimit={expandLimit}
          defaultExpand={isTargetChildComment(comment)}
        />
      ))}
    </View>
  );
};

export default CommentList;
