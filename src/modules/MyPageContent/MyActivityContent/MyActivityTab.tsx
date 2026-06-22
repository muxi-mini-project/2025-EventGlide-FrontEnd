import { memo, useMemo } from 'react';
import { View } from '@tarojs/components';
import './style.scss';
import ActivityCard from '@/modules/ActivityCard/index';
import useActivityStore from '@/store/ActivityStore';
import { ActivityDetailInfo } from '@/common/types';
import MinePageNull from '@/modules/EmptyComponent/components/minepagenull';

const MyActivityTab: React.FC<{
  activeIndex: 'release' | 'like' | 'favourite';
  setIsShowActivityWindow: (isShow: boolean) => void;
  searchValue?: string;
  userActivityList?: ActivityDetailInfo[];
  onLoadMore?: () => void;
  hasMore?: boolean;
  loading?: boolean;
}> = memo(function ({
  activeIndex,
  setIsShowActivityWindow,
  searchValue,
  userActivityList,
  onLoadMore,
  hasMore,
  loading,
}) {
  const { setSelectedItem } = useActivityStore();

  const filteredActiveList = useMemo(() => {
    if (!userActivityList) {
      return [];
    }
    if (!searchValue?.trim()) {
      return userActivityList;
    }
    const searchLower = searchValue.toLowerCase().trim();
    return userActivityList.filter((activity) =>
      activity.title.toLowerCase().includes(searchLower)
    );
  }, [userActivityList, searchValue]);

  return (
    <View className="mine-activity-page">
      {filteredActiveList.length === 0 ? (
        <MinePageNull />
      ) : (
        <View style={{ paddingLeft: '30rpx' }}>
          {filteredActiveList.map((item, index) => {
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
          })}
        </View>
      )}
    </View>
  );
});

export default MyActivityTab;
