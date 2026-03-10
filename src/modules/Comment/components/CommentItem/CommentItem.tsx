import './style.scss';
import { View } from '@tarojs/components';
import ReplyItem from '../ReplyItem/ReplyItem';
import ReplyList from '../ReplyList/ReplyList';
import { CommentItemProps } from '@/common/types';

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  replycomment,
  setReplyId,
  setCommentItems,
  setCommentCreator,
  setCommentid,
  longClick,
  expandLimit = 5,
}) => {
  // 如果没有评论数据，直接返回null
  if (!comment) {
    return null;
  }

  // 转换为ReplyItem需要的格式
  const commentForReplyItem = {
    ...comment,
    replyTime: comment.commentedTime,
  };

  return (
    <View className="CommentItem">
      {/* 一级评论 */}
      <View className="CommentItem-first">
        <ReplyItem
          {...commentForReplyItem}
          isLike={comment.isLike}
          likeNum={comment.likeNum}
          replycomment={replycomment}
          setReplyId={setReplyId}
          setCommentItems={setCommentItems}
          setCommentCreator={setCommentCreator}
          setCommentid={setCommentid}
          longClick={longClick}
          son={false}
        />
      </View>

      {/* 子评论列表 */}
      <ReplyList
        replies={comment.reply}
        replycomment={replycomment}
        setReplyId={setReplyId}
        setCommentItems={setCommentItems}
        setCommentCreator={setCommentCreator}
        setCommentid={setCommentid}
        longClick={longClick}
        expandLimit={expandLimit}
      />
    </View>
  );
};

export default CommentItem;
