import { memo, useState, useContext } from 'react';
import { View } from '@tarojs/components';
import { SetReponseContext } from '@/subpackage/actComment';
import { SetBlogComment } from '@/subpackage/postDetail';
import './style.scss';
import Drawer from '@/common/components/Drawer';
import CustomInput from '@/common/components/CustomInput';
import { ReplyInputProps } from '@/common/types';

const ReplyInput: React.FC<ReplyInputProps> = memo(({ ...props }) => {
  const [replyText, setReplyText] = useState('');
  const setResponse = useContext(SetReponseContext);
  const setBlogComment = useContext(SetBlogComment);
  const { comment } = props;
  const handleSubmit = () => {
    if (replyText.length === 0) {
      return;
    } else {
      console.log(replyText, comment, props);
      const { params, page } = props;
      if (!comment) {
        const data = {
          ...params,
          content: replyText,
          parentId: props.replyId ?? params.parentId,
        };
        if (page === 'activity') {
          setResponse(data);
        } else if (page === 'post') {
          setBlogComment(data);
        }
      } else {
        const data = {
          ...params,
          content: replyText,
        };
        if (page === 'activity') {
          setResponse(data);
        } else if (page === 'post') {
          setBlogComment(data);
        }
      }
      setReplyText('');
      props.setIsVisible(false);
    }
  };

  return (
    <Drawer
      visible={props.isVisible}
      onClose={() => props.setIsVisible(false)}
      placement="bottom"
      showHeader={false}
    >
      <View className="reply-window">
        <View className="reply-window-input">
          <CustomInput
            type="textarea"
            placeholder={comment ? '请输入评论内容' : '请输入回复内容'}
            value={replyText}
            onInput={(e: any) => setReplyText(e?.detail?.value ?? '')}
            wrapperStyle={{ border: 'none' }}
            focus={true}
            onConfirm={() => handleSubmit()}
            autoHeight={true}
            maxLength={140}
            maxHeight={60}
            showConfirmBar={false}
          />
        </View>
        <View className="reply-window-btnbox">
          <View
            className={`reply-window-btn ${replyText ? 'reply-window-active' : ''}`}
            onClick={() => handleSubmit()}
          >
            发布
          </View>
        </View>
      </View>
    </Drawer>
  );
});

export default ReplyInput;
