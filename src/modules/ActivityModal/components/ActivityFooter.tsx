import './style.scss';
import { View, Image } from '@tarojs/components';
import { memo } from 'react';
import { navigateTo } from '@tarojs/taro';
import favor from '@/common/svg/post/star.svg';
import favorAct from '@/common/svg/post/starAct.svg';
import like from '@/common/svg/post/heart.svg';
import likeAct from '@/common/svg/post/heartAct.svg';
import commentPic from '@/common/svg/post/comment.svg';
import useActivityStore from '@/store/ActivityStore';
import useUserStore from '@/store/userStore';
import handleInteraction from '@/common/utils/Interaction';

const ActivityFooter: React.FC<{
  favorNum: number;
  commentNum: number;
  isCollect: string;
  likeNum: number;
  isLike: string;
  setShowPostWindow: (show: boolean) => void;
}> = memo(({ ...props }) => {
  const { studentId } = useUserStore((state) => state);
  const { setCollectNumChange, setLikeNumChange, selectedItem, setSelectedItem } = useActivityStore();
  const params = {
    studentId: studentId,
    subject: 'activity',
    targetId: selectedItem.id,
    receiver: selectedItem.userInfo.studentId,
  };
  const handleCollect = async () => {
    if (selectedItem.isCollect === 'true') {
      try {
        const res = await handleInteraction('discollect', params);
        if (res.msg === 'success') {
          setCollectNumChange(selectedItem.id, 'reduce');
          setSelectedItem({
            ...selectedItem,
            isCollect: 'false',
            collectNum: selectedItem.collectNum - 1,
          });
        }
      } catch (err) {
        console.log(err);
      }
    } else if (selectedItem.isCollect === 'false') {
      try {
        const res = await handleInteraction('collect', params);
        if (res.msg === 'success') {
          setCollectNumChange(selectedItem.id, 'add');
          setSelectedItem({
            ...selectedItem,
            isCollect: 'true',
            collectNum: selectedItem.collectNum + 1,
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
  };
  const handleLike = async () => {
    if (selectedItem.isLike === 'true') {
      try {
        const res = await handleInteraction('dislike', params);
        if (res.msg === 'success') {
          setLikeNumChange(selectedItem.id, 'reduce');
          setSelectedItem({
            ...selectedItem,
            isLike: 'false',
            likeNum: selectedItem.likeNum - 1,
          });
        }
      } catch (err) {
        console.log(err);
      }
    } else if (selectedItem.isLike === 'false') {
      try {
        const res = await handleInteraction('like', params);
        if (res.msg === 'success') {
          setLikeNumChange(selectedItem.id, 'add');
          setSelectedItem({
            ...selectedItem,
            isLike: 'true',
            likeNum: selectedItem.likeNum + 1,
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
  };
  return (
    <View className="activity-content-footer" onClick={(e) => e.stopPropagation()}>
      <View className="activity-content-footer-item">
        <Image
          onClick={handleLike}
          src={props.isLike === 'true' ? likeAct : like}
          className="pwfai-img"
          style={'width: 36rpx;'}
        ></Image>
        <View>{props.likeNum}</View>
      </View>
      <View className="activity-content-footer-item">
        <Image
          src={props.isCollect === 'true' ? favorAct : favor}
          className="pwfai-img"
          onClick={handleCollect}
        ></Image>
        <View>{props.favorNum}</View>
      </View>
      <View className="activity-content-footer-item">
        <Image
          onClick={() => {
            navigateTo({ url: '/subpackage/actComment/index' });
            props.setShowPostWindow(false);
          }}
          src={commentPic}
          mode="widthFix"
          className="pwfai-img"
          style={'width: 36rpx;'}
        ></Image>
        <View>{props.commentNum}</View>
      </View>


    </View>
  );
});

export default ActivityFooter;
