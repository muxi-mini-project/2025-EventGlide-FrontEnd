import { memo, useState, useContext } from 'react';
import { View, Input, PageContainer } from '@tarojs/components';
import { SetReponseContext } from '@/subpackage/actComment';
import { SetBlogReponseContext } from '@/subpackage/blogDetail';
import './style.scss';

interface replyWindowProps {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
  params: {
    parent_id: string;
    studentid: string;
    subject: string;
  };
  reply_id?: string;
  page: string;
}

const ReplyWindow: React.FC<replyWindowProps> = memo(({ ...props }) => {
  const [replyText, setReplyText] = useState('');
  const setResponse = useContext(SetReponseContext);
  const setBlogReponseContext = useContext(SetBlogReponseContext);

  const handleSubmit = () => {
    console.log(replyText);
    const { params, page } = props;
    const data = {
      ...params,
      content: replyText,
      parent_id: props.reply_id ?? params.parent_id,
    };
    if (page === 'activity') {
      setResponse(data);
    } else if (page === 'post') {
      setBlogReponseContext(data);
    }
    setReplyText('');
    props.setIsVisible(false);
  };

  return (
    <PageContainer
      show={props.isVisible}
      onLeave={() => props.setIsVisible(false)}
      overlay={true}
      overlayStyle="background-color: rgba(0,0,0,0.5);"
      customStyle="background-color: transparent;"
    >
      <View className="reply-window">
        <View className="reply-window-input">
          <Input
            placeholder="请输入回复内容"
            placeholderClass="reply-window-input-placeholder"
            placeholderStyle={'font-family: SimHei;font-size: 30rpx;'}
            value={replyText}
            onInput={(e) => setReplyText(e.detail.value)}
            focus={true}
            onConfirm={() => handleSubmit()}
          />
        </View>
        <View className="reply-window-btn" onClick={() => handleSubmit()}>
          发布
        </View>
      </View>
    </PageContainer>
  );
});

export default ReplyWindow;
