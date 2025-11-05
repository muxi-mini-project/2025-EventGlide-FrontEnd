import { memo, useEffect, useState } from 'react';
import { View } from '@tarojs/components';
import './style.scss';
import MineActivityItem from '@/modules/mineActiveItem';
import get from '@/common/api/get';
import post from '@/common/api/post';
import useUserStore from '@/store/userStore';
import useActivityStore from '@/store/ActivityStore';
import { ActivityDetailList } from '@/common/types/ActiveList';
import MinePageNull from '@/modules/null/components/minepagenull';
const MineActivity: React.FC<{
  activeIndex: 'release' | 'like' | 'favourite';
  setIsShowActivityWindow: (isShow: boolean) => void;
}> = memo(function ({ activeIndex, setIsShowActivityWindow }) {
  const { studentid } = useUserStore();
  const [activeList, setActiveList] = useState<ActivityDetailList[]>([]);
  const { setSelectedItem } = useActivityStore();
  useEffect(() => {
    if (activeIndex === 'release') {
      get(`/act/own/${studentid}`)
        .then((res) => {
          console.log('发布活动：', res.data);
          if (res.data === null) {
            setActiveList([]);
            return;
          }
          const newActiveList: ActivityDetailList[] = [];
          res.data.forEach((item) => {
            newActiveList.push({
              ...item,
            });
          });
          setActiveList(newActiveList);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (activeIndex === 'favourite') {
      post('/user/collect/act', { studentid })
        .then((res) => {
          console.log('收藏活动：', res);
          if (res.data === null) {
            setActiveList([]);
            return;
          }
          const newActiveList: ActivityDetailList[] = [];
          res.data.forEach((item) => {
            if (item.title !== '')
              newActiveList.push({
                ...item,
              });
          });
          setActiveList(newActiveList);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (activeIndex === 'like') {
      post('/user/like/act', { studentid })
        .then((res) => {
          console.log('点赞活动：', res);
          if (res.data === null) {
            setActiveList([]);
            return;
          }
          const newActiveList: ActivityDetailList[] = [];
          res.data.forEach((item) => {
            if (item.title !== '')
              newActiveList.push({
                ...item,
              });
          });
          setActiveList(newActiveList);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [activeIndex]);

  return (
    <View className="mine-activity-page">
      {activeList.length === 0 ? (
        <MinePageNull />
      ) : (
        activeList.map((item, index) => {
          return (
            <View
              key={index}
              onClick={() => {
                setSelectedItem(item);
                setIsShowActivityWindow(true);
              }}
            >
              <MineActivityItem
                key={index}
                avatar={item.userInfo.avatar}
                title={item.title}
                name={item.userInfo.username}
                likes={item.likeNum}
                comment={item.commentNum}
                introduce={item.introduce}
                showImg={item.showImg}
                isLike={item.isLike}
                isCollect={item.isCollect}
                collectNum={item.collectNum}
              />
            </View>
          );
        })
      )}
    </View>
  );
});

export default MineActivity;
