import { View, ScrollView } from '@tarojs/components';
import ActivityCard from '@/modules/ActivityCard/index';
import { useDidShow, useLoad } from '@tarojs/taro';
import './index.scss';
import ActivityTabs, { ActivityTypeDrawer, ColorExplain } from '@/modules/ActivityTabs/index';
import ActivityModal from '@/modules/ActivityModal';
import { useEffect, useState } from 'react';
import useActivityStore from '@/store/ActivityStore';
import { judgeDate } from '@/common/utils/DateList';
import usePostStore from '@/store/PostStore';
import { NavigationBarTabBar } from '@/common/components/NavigationBar';
import IndexPageNull from '@/modules/EmptyComponent/components/indexpagenull';
import { getPostList, filterActivity, getActivityList } from '@/common/api';
import ScrollTop from '@/modules/ScrollTop/components/ScrollTop';

const Index = () => {
  const [showPostWindow, setShowPostWindow] = useState(false);
  const [showTypeDrawer, setShowTypeDrawer] = useState(false);
  const [showColorExplain, setShowColorExplain] = useState(false);
  const [activityType, setActivityType] = useState<string>('');
  const { activeList, setActiveList, setSelectedItem, selectedInfo, isSelect } = useActivityStore();
  const [approximateTime, setApproximateTime] = useState<string>('');
  const [type, setType] = useState<string[]>([]);
  const { setPostList } = usePostStore();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);

  useLoad(async () => {
    try {
      const res = await getPostList();
      setPostList(res.data);
    } catch (error) {
      console.error('获取帖子列表失败:', error);
      setPostList([]);
    }
  });

  useDidShow(async () => {
    console.log(selectedInfo);
    if (isSelect) {
      try {
        const res = await filterActivity(selectedInfo);
        console.log(res.data);
        setActiveList(res.data);
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const res = await getActivityList();
        console.log(res);
        setActiveList(res.data);
      } catch (err) {
        console.log(err);
      }
    }
  });

  useEffect(() => {
    console.log(selectedInfo);
    const fetchFilteredActivities = async () => {
      try {
        const res = await filterActivity(selectedInfo);
        console.log(res.data);
        setActiveList(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchFilteredActivities();
  }, [type]);

  const handleScroll = (e: any) => {
    const { scrollTop } = e.detail;
    if (scrollTop > 200) {
      setShowScrollTop(true);
    } else {
      setShowScrollTop(false);
    }
  };

  const filteredActivities =
    activeList?.filter((activeItem) => {
      const isMatch = approximateTime === '' || judgeDate(approximateTime, activeItem.detailTime);
      return isMatch;
    }) || [];

  return (
    <>
      <NavigationBarTabBar backgroundColor="#F8F9FC" title="首页"></NavigationBarTabBar>
      <ScrollTop setScrollTop={setScrollTop} isVisible={showScrollTop} bottom={150}></ScrollTop>
      <ScrollView
        className="indexHome"
        scrollY={true}
        usingSticky={true}
        enhanced={true}
        showScrollbar={false}
        scrollTop={scrollTop}
        onScroll={(e) => handleScroll(e)}
      >
        <View className="sticky-header">
          <ActivityTabs
            setApproximateTime={setApproximateTime}
            setType={setType}
            showTypeDrawer={showTypeDrawer}
            setChooseDrawerVisible={setShowTypeDrawer}
            chooseDrawerType={activityType}
            setChooseDrawerType={setActivityType}
            setShowColorExplain={setShowColorExplain}
          ></ActivityTabs>
        </View>

        <View className="sticky-item">
          {filteredActivities.length === 0 ? (
            <IndexPageNull />
          ) : (
            filteredActivities.map((activeItem, index) => (
              <View
                key={index}
                onClick={() => {
                  setSelectedItem(activeItem);
                }}
              >
                <ActivityCard
                  key={index}
                  activeItem={activeItem}
                  setShowPostWindow={setShowPostWindow}
                />
              </View>
            ))
          )}
        </View>
      </ScrollView>
      <ActivityModal
        isShowActivityWindow={showPostWindow}
        WindowType="active"
        setShowPostWindow={setShowPostWindow}
      ></ActivityModal>
      <ActivityTypeDrawer
        isVisiable={showTypeDrawer}
        setIsVisiable={setShowTypeDrawer}
        type={activityType}
        setType={setType}
      ></ActivityTypeDrawer>
      <ColorExplain
        visible={showColorExplain}
        onClose={() => setShowColorExplain(false)}
      ></ColorExplain>
    </>
  );
};

export default Index;
