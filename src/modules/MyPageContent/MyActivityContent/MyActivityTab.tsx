import { memo, useEffect, useState, useMemo } from 'react';
import { View } from '@tarojs/components';
import './style.scss';
import ActivityCard from '@/modules/ActivityCard/index';
import { getMyActivityList } from '@/common/api/Activity';
import useActivityStore from '@/store/ActivityStore';
import { ActivityDetailInfo } from '@/common/types';
import MinePageNull from '@/modules/EmptyComponent/components/minepagenull';

const MyActivityTab: React.FC<{
  activeIndex: 'release' | 'like' | 'favourite';
  setIsShowActivityWindow: (isShow: boolean) => void;
  searchValue?: string;
  userActivityList?: ActivityDetailInfo[];
}> = memo(function ({ activeIndex, setIsShowActivityWindow, searchValue, userActivityList }) {
  const [activeList, setActiveList] = useState<ActivityDetailInfo[]>([]);
  const { setSelectedItem } = useActivityStore();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await getMyActivityList(activeIndex);
        console.log(`${activeIndex}:`, res.data);

        if (res.data === null) {
          setActiveList([]);
          return;
        }
        const newActiveList: ActivityDetailInfo[] = [];
        res.data.forEach((item) => {
          if (item.title !== '')
            newActiveList.push({
              ...item,
            });
        });
        setActiveList(newActiveList);
      } catch (err) {
        console.log(err);
      }
    };
    if (userActivityList) {
      setActiveList(userActivityList);
    } else {
      fetchActivities();
    }
  }, [activeIndex]);

  const filteredActiveList = useMemo(() => {
    if (!searchValue?.trim()) {
      return activeList;
    }
    const searchLower = searchValue.toLowerCase().trim();
    return activeList.filter((activity) => activity.title.toLowerCase().includes(searchLower));
  }, [activeList, searchValue]);

  return (
    <View className="mine-activity-page">
      {filteredActiveList.length === 0 ? (
        <MinePageNull />
      ) : (
        filteredActiveList.map((item, index) => {
          return (
            <View
              key={index}
              onClick={() => {
                setSelectedItem(item);
                //setIsShowActivityWindow(true);
              }}
            >
              <ActivityCard
                key={index}
                activeItem={item}
                setShowPostWindow={setIsShowActivityWindow}
                isbottomline={false}
              />
              <View className="mine-activity-page-bottomline"></View>
            </View>
          );
        })
      )}
    </View>
  );
});

export default MyActivityTab;
