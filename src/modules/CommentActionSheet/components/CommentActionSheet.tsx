import { View, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { memo, useEffect, useState } from 'react';
import { CreatorType } from '@/common/types';
import { deleteComment } from '@/common/api/Comment';
import { DeleteCommentRequest } from '@/common/types';
import './style.scss';
import ConfirmModal from '@/modules/ConfirmModal';
import Drawer from '@/common/components/Drawer';
import Message from '@/common/components/Message';
import deleteIcon from '@/common/svg/operation/delete.svg';
import copyIcon from '@/common/svg/operation/copy.svg';
import reportIcon from '@/common/svg/operation/report.svg';

interface CommentOperationProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  studentId: string;
  commentItems: string;
  commentCreator: CreatorType | undefined;
  commentid: string;
  getComments: () => void;
}

const CommentActionSheet: React.FC<CommentOperationProps> = memo(
  ({ visible, setVisible, studentId, commentItems, commentCreator, commentid, getComments }) => {
    const [isDelete, setIsDelete] = useState(false);
    const [commentContent, setCommentContent] = useState(commentItems);
    const param: DeleteCommentRequest = {
      targetId: commentid || '',
    };
    useEffect(() => {
      if (commentItems.length > 18) {
        setCommentContent(commentItems.slice(0, 18) + '...');
      } else {
        setCommentContent(commentItems);
      }
    }, [commentItems]);
    const deleteCommentClick = async () => {
      if (studentId == commentCreator?.studentId) {
        try {
          console.log(param);
          const res = await deleteComment(param);
          console.log(res);
          if (res.msg === 'success') {
            getComments();
            setIsDelete(false);
            setVisible(false);
            Message.success({
              content: '删除成功',
              duration: 2000,
            });
          }
        } catch (err) {
          console.log(err);
        }
      } else {
        console.log('非评论者，不能删除');
      }
    };
    const copyComment = () => {
      Taro.setClipboardData({
        data: commentItems,
        success: function () {
          Message.success({
            content: '复制成功',
            duration: 2000,
          });
          console.log('复制成功:', commentItems);
        },
        fail: function (err) {
          Message.error({
            content: '复制失败',
            duration: 2000,
          });
          console.error('复制失败:', err);
        },
      });
    };

    return (
      <>
        <Drawer
          visible={visible}
          onClose={() => setVisible(false)}
          placement="bottom"
          showHeader={false}
        >
          <View className="commentOperation-top">
            <Image
              className="commentOperation-top-user"
              src={commentCreator?.avatar || ''}
              mode="scaleToFill"
            />
            <View className="commentOperation-top-text">{commentContent}</View>
          </View>
          <View className="commentOperation-btn">
            <View className="commentOperation-btn-item" onClick={copyComment}>
              <View className="commentOperation-btn-icon">
                <Image className="commentOperation-btn-icon-copy" src={copyIcon} />
              </View>
              <View className="commentOperation-btn-text">复制</View>
            </View>
            {studentId == commentCreator?.studentId && (
              <View className="commentOperation-btn-item" onClick={() => setIsDelete(true)}>
                <View className="commentOperation-btn-icon">
                  <Image className="commentOperation-btn-icon-delete" src={deleteIcon} />
                </View>
                <View className="commentOperation-btn-text">删除</View>
              </View>
            )}
            <View className="commentOperation-btn-item">
              <View className="commentOperation-btn-icon">
                <Image className="commentOperation-btn-icon-report" src={reportIcon} />
              </View>
              <View className="commentOperation-btn-text">举报</View>
            </View>
            <View className="commentOperation-btn-item">
              <View className="commentOperation-btn-icon"></View>
              <View className="commentOperation-btn-text">分享</View>
            </View>
          </View>
        </Drawer>

        <ConfirmModal
          title="确认删除评论吗？"
          visible={isDelete}
          onConfirm={deleteCommentClick}
          onClose={() => setIsDelete(false)}
          headerClassName="textmid"
        />
      </>
    );
  }
);

export default CommentActionSheet;
