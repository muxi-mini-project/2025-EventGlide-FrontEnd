import { View, Image, ScrollView, GridView } from '@tarojs/components';
import './index.scss';
import { MyActivityTab } from '@/modules/MyPageContent';
import Taro, { navigateTo, useDidShow } from '@tarojs/taro';
import { useState, useEffect } from 'react';
import classnames from 'classnames';
import arrowheadw from '@/common/svg/arrowhead/引导箭头-白.svg';
import check from '@/common/svg/mineInfo/search.svg';
import { getMyPostList, getUserInfo } from '@/common/api';
import { getMyActivityList } from '@/common/api/Activity';
import useUserStore from '@/store/userStore';
import useActivityStore from '@/store/ActivityStore';
import { PostDetailInfo, ActivityDetailInfo } from '@/common/types';
import { NavigationBarTabBar } from '@/common/components/NavigationBar';
import PostCard from '@/modules/PostCard';
import usePostStore from '@/store/PostStore';
import ActivityModal from '@/modules/ActivityModal';
import MinePageNull from '@/modules/EmptyComponent/components/minepagenull';
import useDoorStore from '@/store/DoorStote';

const Index = () => {
  const [activePage, setActivePage] = useState<'activity' | 'post'>('post');
  const [activeIndex, setActiveIndex] = useState<'release' | 'like' | 'favourite'>('release');
  const [isShowActivityWindow, setIsShowActivityWindow] = useState(false);
  const [isShowList, setIsShowList] = useState<number[]>([0, 1, 2, 3]);
  const [showNavBar, setShowNavBar] = useState(true); // 控制导航栏显示/隐藏
  const { setPostIndex, setBackPage, PostList, postUpdates } = usePostStore();
  const [minePostList, setMinePostList] = useState<PostDetailInfo[]>([]);

  useEffect(() => {
    const hasUpdates = Object.keys(postUpdates).length > 0;
    if (!hasUpdates && (!PostList || PostList.length === 0)) return;

    setMinePostList((prev) =>
      prev.map((item) => {
        let merged = item;

        if (postUpdates[item.id]) {
          merged = { ...merged, ...postUpdates[item.id] };
        }

        if (PostList && PostList.length > 0) {
          const updated = PostList.find((p) => p.id === item.id);
          if (updated) {
            merged = {
              ...merged,
              isLike: updated.isLike,
              likeNum: updated.likeNum,
              isCollect: updated.isCollect,
              collectNum: updated.collectNum,
            };
          }
        }

        return merged;
      })
    );
  }, [PostList, postUpdates]);
  const { avatar, username, school, setAvatar, setUsername, setSchool, setCollege } =
    useUserStore();
  const sid = Taro.getStorageSync('sid');
  const { setIsSelect } = useActivityStore();
  const [page, setPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 10;
  const BUFFER = 300;
  const { doorStatus } = useDoorStore();

  // 活动相关状态
  const [activityPage, setActivityPage] = useState(1);
  const [totalActivities, setTotalActivities] = useState(0);
  const [activityLoading, setActivityLoading] = useState(false);
  const [activityHasMore, setActivityHasMore] = useState(true);
  const [mineActivityList, setMineActivityList] = useState<ActivityDetailInfo[]>([]);

  useDidShow(() => {
    setIsSelect(false);
  });

  useDidShow(async () => {
    try {
      const res = await getUserInfo(sid);
      console.log(res);
      setAvatar(res.data.avatar);
      setUsername(res.data.username);
      setSchool(res.data.school);
      setCollege(res.data.college);
    } catch (err) {
      console.log(err);
    }
  });

  const loadPosts = async (pageNum = 1, refresh = false) => {
    try {
      const res = await getMyPostList(activeIndex, LIMIT, pageNum);
      console.log(`${activeIndex}:`, res.data);
      if (res.data.details === null) {
        if (refresh) {
          setMinePostList([]);
        }
        return;
      }
      const newPostList: PostDetailInfo[] = res.data.details.map(
        (item: unknown) => item as PostDetailInfo
      );
      if (refresh) {
        setMinePostList(newPostList);
      } else {
        setMinePostList([...minePostList, ...newPostList]);
      }
      setPage(pageNum);
      setTotalPosts(res.data.total || 0);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (activePage === 'post') {
      setHasMore(true);
      setIsShowList([]);
      loadPosts(1, true);
    } else {
      // 切换到活动页面时，初始化活动列表
      setActivityHasMore(true);
      loadActivities(1, true);
    }
  }, [activeIndex, activePage]);

  useEffect(() => {
    if (minePostList.length > 0 && activePage === 'post') {
      console.log('handleScroll');
      handleScroll();
    }
  }, [activePage, minePostList]);

  const handleScroll = (e?: any) => {
    let scrollTop = 0;
    // 处理导航栏显示/隐藏逻辑
    if (e && e.detail) {
      scrollTop = e.detail.scrollTop;
      setShowNavBar(scrollTop < 50);

      // 滚动加载更多
      const distanceToBottom =
        e.detail.scrollHeight - (scrollTop + (Taro.getWindowInfo().windowHeight || 0));
      if (distanceToBottom <= BUFFER) {
        loadMore();
      }
    }

    // 处理图片懒加载逻辑
    const windowHeight = Taro.getWindowInfo().windowHeight;
    const buffer = windowHeight * 0.3;
    const visibleTop = scrollTop - buffer;
    const visibleBottom = scrollTop + windowHeight + buffer;

    const query = Taro.createSelectorQuery();
    minePostList.forEach((_, index) => {
      query.select(`#post-item-${index}`).boundingClientRect();
    });
    query.exec((res) => {
      res.forEach((rect, index) => {
        if (!rect) return;
        const { top, bottom } = rect;
        // 判断元素是否在带缓冲区的可见区域内
        if (top <= visibleBottom && bottom >= visibleTop) {
          setIsShowList((prevList) => {
            if (!prevList.includes(index)) {
              return [...prevList, index];
            }
            return prevList;
          });
        }
      });
    });
  };

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      await loadPosts(page + 1, false);
      if (minePostList.length >= totalPosts) {
        setHasMore(false);
      }
      setTimeout(() => {
        handleScroll();
      }, 200);
    } catch (error) {
      console.error('加载更多失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 加载活动列表
  const loadActivities = async (pageNum = 1, refresh = false) => {
    try {
      const res = await getMyActivityList(activeIndex, LIMIT, pageNum);
      console.log(`activity ${activeIndex}:`, res.data);
      if (res.data.details === null) {
        if (refresh) {
          setMineActivityList([]);
        }
        return;
      }
      const newActivityList: ActivityDetailInfo[] = res.data.details.map(
        (item: unknown) => item as ActivityDetailInfo
      );
      if (refresh) {
        setMineActivityList(newActivityList);
      } else {
        setMineActivityList([...mineActivityList, ...newActivityList]);
      }
      setActivityPage(pageNum);
      setTotalActivities(res.data.total || 0);
    } catch (err) {
      console.log(err);
    }
  };

  // 加载更多活动
  const loadMoreActivities = async () => {
    if (activityLoading || !activityHasMore) return;
    setActivityLoading(true);
    try {
      await loadActivities(activityPage + 1, false);
      if (mineActivityList.length >= totalActivities) {
        setActivityHasMore(false);
      }
    } catch (error) {
      console.error('加载更多活动失败:', error);
    } finally {
      setActivityLoading(false);
    }
  };

  return (
    <>
      <NavigationBarTabBar
        backgroundColor="transparent"
        color="#ffffff"
        title="我的"
        style={{
          transition: 'opacity 0.1s ease, transform 0.1s ease',
          opacity: showNavBar ? 1 : 0,
        }}
      />
      <ScrollView
        className="mine-page"
        scrollY={true}
        type="custom"
        onScroll={(e) => handleScroll(e)}
        usingSticky={true}
        enhanced={true}
        showScrollbar={false}
        style={{ height: 'calc(100vh - 120rpx)' }}
        id="scrollView"
      >
        <View className="mine-user">
          <View className="mine-user-content">
            <Image className="mine-user-avatar" mode="aspectFill" src={avatar}></Image>
            <View className="mine-user-info">
              <View className="mine-user-name">{username}</View>
              <View className="mine-user-school">{school}</View>
            </View>
            <Image
              className="mine-user-arrowhead"
              mode="widthFix"
              src={arrowheadw}
              onClick={() => navigateTo({ url: '/subpackage/userProfile/index' })}
            ></Image>
          </View>
        </View>

        <View className="mine-order-title" id="scrollView">
          <View className="mine-order-title-choice">
            <View
              className={classnames('mine-order-title-choice-left', {
                'active-decoration-left': activePage === 'post',
              })}
              onClick={() => setActivePage('post')}
            >
              帖子
            </View>
            <View
              className={classnames('mine-order-title-choice-right', {
                'active-decoration-right': activePage === 'activity',
              })}
              onClick={() => setActivePage('activity')}
            >
              活动
            </View>
            {/* <View
              className="mine-order-title-choice-check"
              onClick={() => navigateTo({ url: '/subpackage/review/index' })}
            >
              审核
            </View> */}
            <Image
              onClick={() => navigateTo({ url: '/subpackage/mySearch/index' })}
              className="mine-order-title-choice-img"
              src={check}
            ></Image>
          </View>
          <View className="mine-order-title-line"></View>
          <View className="mine-order-title-index">
            <View
              className={classnames('mine-order-title-index-left', {
                'active-decoration-item': activeIndex === 'release',
              })}
              onClick={() => setActiveIndex('release')}
            >
              发布
            </View>
            <View
              className={classnames('mine-order-title-index-right', {
                'active-decoration-item': activeIndex === 'favourite',
              })}
              onClick={() => setActiveIndex('favourite')}
            >
              收藏
            </View>
            <View
              className={classnames('mine-order-title-index-mid', {
                'active-decoration-item': activeIndex === 'like',
              })}
              onClick={() => setActiveIndex('like')}
            >
              点赞
            </View>
          </View>
        </View>

        {doorStatus === 'pass' ? (
          <View className="mine-content">
            {activePage === 'post' ? (
              minePostList.length === 0 ? (
                <MinePageNull />
              ) : (
                <View style={{ marginLeft: '30rpx', marginRight: '30rpx', marginTop: '5rpx' }}>
                  <GridView type="masonry" crossAxisGap={5} mainAxisGap={5}>
                    {minePostList.filter(Boolean).map((item, index) => (
                      <View
                        key={index}
                        id={`post-item-${index}`}
                        onClick={() => {
                          setPostIndex(item.id);
                          setBackPage('mineHome');
                        }}
                      >
                        <PostCard
                          item={item}
                          index={index}
                          isShowImg={isShowList.includes(index)}
                        />
                      </View>
                    ))}
                  </GridView>
                </View>
              )
            ) : (
              <MyActivityTab
                activeIndex={activeIndex}
                setIsShowActivityWindow={setIsShowActivityWindow}
                userActivityList={mineActivityList}
                onLoadMore={loadMoreActivities}
                hasMore={activityHasMore}
                loading={activityLoading}
              />
            )}
          </View>
        ) : (
          <MinePageNull />
        )}
      </ScrollView>
      <ActivityModal
        isShowActivityWindow={isShowActivityWindow}
        WindowType="active"
        setShowPostWindow={setIsShowActivityWindow}
      ></ActivityModal>
    </>
  );
};

export default Index;