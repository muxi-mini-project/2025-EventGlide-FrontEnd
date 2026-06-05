import './style.scss';
import { View, Image } from '@tarojs/components';
import { memo } from 'react';
import { navigateTo } from '@tarojs/taro';
import favor from '@/common/svg/post/star.svg';
import favorAct from '@/common/svg/post/starAct.svg';
import commentPic from '@/common/svg/post/comment.svg';
import useActivityStore from '@/store/ActivityStore';
import useUserStore from '@/store/userStore';
import handleInteraction from '@/common/utils/Interaction';

const ActivityFooter: React.FC<{
  favorNum: number;
  commentNum: number;
  isCollect: string;
  setShowPostWindow: (show: boolean) => void;
}> = memo(({ ...props }) => {
  const { studentId } = useUserStore((state) => state);
  const { setCollectNumChange, selectedItem, setSelectedItem } = useActivityStore();
  const params = {
    studentId: studentId,
    subject: 'activity',
    targetId: selectedItem.bid,
    receiver: selectedItem.userInfo.studentId,
  };
  const handleCollect = async () => {
    if (selectedItem.isCollect === 'true') {
      try {
        const res = await handleInteraction('discollect', params);
        if (res.msg === 'success') {
          setCollectNumChange(selectedItem.bid, 'reduce');
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
          setCollectNumChange(selectedItem.bid, 'add');
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

  return (
    <View className="activity-content-footer" onClick={(e) => e.stopPropagation()}>
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
