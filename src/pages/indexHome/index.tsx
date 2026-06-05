import { View, ScrollView } from '@tarojs/components';
import ActivityCard from '@/modules/ActivityCard/index';
import Taro, { useDidShow } from '@tarojs/taro';
import './index.scss';
import ActivityTabs, { ActivityTypeDrawer, ColorExplain } from '@/modules/ActivityTabs/index';
import ActivityModal from '@/modules/ActivityModal';
import { useEffect, useState } from 'react';
import useActivityStore from '@/store/ActivityStore';
import { judgeDate } from '@/common/utils/DateList';
import { NavigationBarTabBar } from '@/common/components/NavigationBar';
import IndexPageNull from '@/modules/EmptyComponent/components/indexpagenull';
import { filterActivity, getActivityList } from '@/common/api';
import ScrollTop from '@/modules/ScrollTop/components/ScrollTop';

const Index = () => {
  const [showPostWindow, setShowPostWindow] = useState(false);
  const [showTypeDrawer, setShowTypeDrawer] = useState(false);
  const [showColorExplain, setShowColorExplain] = useState(false);
  const [activityType, setActivityType] = useState<string>('');
  const { activeList, setActiveList, setSelectedItem, selectedInfo, isSelect, setSelectInfo } =
    useActivityStore();
  const [approximateTime, setApproximateTime] = useState<string>('');
  const [type, setType] = useState<string[]>([]);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [scrollRecord, setScrollRecord] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const [firstLoad, setFirstLoad] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useDidShow(async () => {
    console.log(selectedInfo);
    if (isSelect) {
      try {
        const res = await filterActivity(selectedInfo);
        console.log(res.data);
        if (res.data === null) {
          setActiveList([]);
          return;
        }
        setActiveList(res.data.reverse());
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const res = await getActivityList();
        console.log(res);
        if (res.data === null) {
          setActiveList([]);
          return;
        }
        setActiveList(res.data.reverse());
      } catch (err) {
        console.log(err);
      }
    }
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} 00:00`;
    setSelectInfo({
      ...selectedInfo,
      detailTime: today,
    });
  });

  useEffect(() => {
    console.log(selectedInfo);
    const fetchFilteredActivities = async () => {
      try {
        const res = await filterActivity(selectedInfo);
        console.log(res.data);
        if (res.data === null) {
          setActiveList([]);
          return;
        }
        setActiveList(res.data.reverse());
      } catch (err) {
        console.log(err);
      }
    };
    if (firstLoad) {
      setFirstLoad(false);
    } else {
      fetchFilteredActivities();
    }
  }, [type]);

  useEffect(() => {
    if (showPostWindow || showColorExplain) {
      setScrollRecord(true);
    }
  }, [showPostWindow, showColorExplain]);

  const handleScroll = (e: any) => {
    const { scrollTop: newScrollTop } = e.detail;
    if (scrollRecord) {
      setScrollTop(scrollPosition);
      setScrollRecord(false);
    } else {
      setScrollPosition(newScrollTop);
    }
    if (newScrollTop > 200) {
      setShowScrollTop(true);
    } else {
      setShowScrollTop(false);
    }
  };

  const onRefresh = async () => {
    console.log('refresh');
    setRefreshing(true);
    const startTime = Date.now();
    const MIN_REFRESH_DURATION = 1500;

    const timeoutId = setTimeout(() => {
      if (refreshing) {
        setRefreshing(false);
        console.log('刷新失败');
      }
    }, 4000);

    const clearTimeoutSafely = () => {
      clearTimeout(timeoutId);
    };

    const finishRefresh = () => {
      const elapsed = Date.now() - startTime;
      const remaining = MIN_REFRESH_DURATION - elapsed;
      if (remaining > 0) {
        setTimeout(() => {
          clearTimeoutSafely();
          setRefreshing(false);
        }, remaining);
      } else {
        clearTimeoutSafely();
        setRefreshing(false);
      }
    };

    try {
      try {
        const res = await filterActivity(selectedInfo);
        if (res.data === null) {
          setActiveList([]);
        } else {
          setActiveList(res.data.reverse());
        }
        finishRefresh();
      } catch (err) {
        finishRefresh();
        console.error(err);
      }
    } catch (error) {
      finishRefresh();
      console.error('刷新过程发生错误:', error);
      Taro.showToast({
        title: '刷新失败，请稍后重试',
        icon: 'none',
        duration: 1000,
      });
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

      <View className="sticky-header" onClick={() => setScrollTop(scrollPosition)}>
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
      <ScrollView
        className="indexHome"
        scrollY={true}
        usingSticky={true}
        showScrollbar={false}
        scrollTop={scrollTop}
        onScroll={(e) => handleScroll(e)}
        enhanced={true}
        refresherEnabled={true}
        refresherTriggered={refreshing}
        onRefresherRefresh={onRefresh}
        refresherBackground="#f9f8fc"
      >
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
