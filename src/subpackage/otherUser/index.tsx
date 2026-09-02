import { View, Image, ScrollView, GridView } from '@tarojs/components';
import './index.scss';
import withDoorGuard from '@/common/hoc';
import { MyActivityTab } from '@/modules/MyPageContent';
import Taro, { useDidShow } from '@tarojs/taro';
import { useState, useEffect } from 'react';
import classnames from 'classnames';
import { getOtherUserPostList, getUserInfo, getOtherUserActivityList } from '@/common/api';
import { PostDetailInfo } from '@/common/types';
import { NavigationBarBack } from '@/common/components/NavigationBar';
import PostCard from '@/modules/PostCard';
import usePostStore from '@/store/PostStore';
import useActivityStore from '@/store/ActivityStore';
import ActivityModal from '@/modules/ActivityModal';
import MinePageNull from '@/modules/EmptyComponent/components/minepagenull';
import { ActivityDetailInfo } from '@/common/types';

const Index = () => {
  const [activePage, setActivePage] = useState<'activity' | 'post'>('post');
  const [isShowActivityWindow, setIsShowActivityWindow] = useState(false);
  const [isShowList, setIsShowList] = useState<number[]>([0, 1, 2, 3]);
  const { setPostIndex, setBackPage, postUpdates, setSelectPostList } = usePostStore();
  const { activityUpdates } = useActivityStore();
  const [minePostList, setMinePostList] = useState<PostDetailInfo[]>([]);
  const [activityList, setActivityList] = useState<ActivityDetailInfo[]>([]);
  const [avatar, setAvatar] = useState('');
  const [username, setUsername] = useState('');
  const [school, setSchool] = useState('');
  const sid = Taro.getStorageSync('targetUser');

  // 分页相关状态
  const LIMIT = 10;
  const BUFFER = 300;

  // 帖子分页
  const [postPage, setPostPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [postLoading, setPostLoading] = useState(false);
  const [postHasMore, setPostHasMore] = useState(true);

  // 活动分页
  const [activityPage, setActivityPage] = useState(1);
  const [totalActivities, setTotalActivities] = useState(0);
  const [activityLoading, setActivityLoading] = useState(false);
  const [activityHasMore, setActivityHasMore] = useState(true);

  useDidShow(async () => {
    try {
      const res = await getUserInfo(sid);
      console.log(res);
      setAvatar(res.data.avatar);
      setUsername(res.data.username);
      setSchool(res.data.school);
    } catch (err) {
      console.log(err);
    }
    // 初始化活动列表
    await loadActivities(1, true);
  });

  useEffect(() => {
    if (activePage === 'post') {
      setPostHasMore(true);
      loadPosts(1, true);
    }
  }, [activePage]);

  useEffect(() => {
    if (Object.keys(activityUpdates).length === 0) return;
    if (activePage !== 'activity') return;
    loadActivities(1, true);
  }, [activityUpdates]);

  useEffect(() => {
    if (Object.keys(postUpdates).length === 0) return;
    if (activePage !== 'post') return;
    loadPosts(1, true);
  }, [postUpdates]);

  useEffect(() => {
    if (minePostList.length > 0 && activePage === 'post') {
      console.log('handleScroll');
      handleScroll();
    }
  }, [activePage, minePostList]);

  // 加载帖子列表
  const loadPosts = async (pageNum = 1, refresh = false) => {
    try {
      const res = await getOtherUserPostList(LIMIT, pageNum, sid);
      console.log('postList:', res.data);
      if (res.data === null) {
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
      setPostPage(pageNum);
      setTotalPosts(res.data.total || 0);
    } catch (err) {
      console.log(err);
    }
  };

  // 加载活动列表
  const loadActivities = async (pageNum = 1, refresh = false) => {
    try {
      const res = await getOtherUserActivityList(LIMIT, pageNum, sid);
      console.log('activityList:', res.data);
      if (res.data.details === null) {
        if (refresh) {
          setActivityList([]);
        }
        return;
      }
      const newActivityList: ActivityDetailInfo[] = res.data.details.map(
        (item: unknown) => item as ActivityDetailInfo
      );
      if (refresh) {
        setActivityList(newActivityList);
      } else {
        setActivityList([...activityList, ...newActivityList]);
      }
      setActivityPage(pageNum);
      setTotalActivities(res.data.total || 0);
    } catch (err) {
      console.log(err);
    }
  };

  // 加载更多帖子
  const loadMorePosts = async () => {
    if (postLoading || !postHasMore) return;
    setPostLoading(true);
    try {
      await loadPosts(postPage + 1, false);
      if (minePostList.length >= totalPosts) {
        setPostHasMore(false);
      }
      setTimeout(() => {
        handleScroll();
      }, 200);
    } catch (error) {
      console.error('加载更多帖子失败:', error);
    } finally {
      setPostLoading(false);
    }
  };

  // 加载更多活动
  const loadMoreActivities = async () => {
    if (activityLoading || !activityHasMore) return;
    setActivityLoading(true);
    try {
      await loadActivities(activityPage + 1, false);
      if (activityList.length >= totalActivities) {
        setActivityHasMore(false);
      }
    } catch (error) {
      console.error('加载更多活动失败:', error);
    } finally {
      setActivityLoading(false);
    }
  };

  const handleScroll = (e?: any) => {
    let scrollTop = 0;
    const windowHeight = Taro.getWindowInfo().windowHeight;

    // 处理滚动加载更多
    if (e && e.detail) {
      scrollTop = e.detail.scrollTop || 0;
      const distanceToBottom = e.detail.scrollHeight - (scrollTop + windowHeight);
      if (distanceToBottom <= BUFFER) {
        if (activePage === 'post') {
          loadMorePosts();
        } else {
          loadMoreActivities();
        }
      }
    }

    // 处理图片懒加载
    const query = Taro.createSelectorQuery();
    minePostList.forEach((_, index) => {
      query.select(`#post-item-${index}`).boundingClientRect();
    });
    query.exec((res) => {
      res.forEach((rect, index) => {
        if (!rect) return;
        const { top, bottom } = rect;
        if (top <= windowHeight && bottom >= 0) {
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

  return (
    <>
      <NavigationBarBack backgroundColor="transparent" title="" />
      <ScrollView
        className="otheruser-page"
        scrollY={true}
        type="custom"
        onScroll={(e) => handleScroll(e)}
        usingSticky={true}
        enhanced={true}
        showScrollbar={false}
        style={{ height: '100vh' }}
        id="scrollView"
      >
        <View className="otheruser-user">
          <View className="otheruser-user-content">
            <Image className="otheruser-user-avatar" mode="aspectFill" src={avatar}></Image>
            <View className="otheruser-user-info">
              <View className="otheruser-user-name">{username}</View>
              <View className="otheruser-user-school">{school}</View>
            </View>
          </View>
        </View>

        <View className="otheruser-order-title" id="scrollView">
          <View className="otheruser-order-title-choice">
            <View
              className={classnames('otheruser-order-title-choice-left', {
                'active-decoration-left': activePage === 'post',
              })}
              onClick={() => setActivePage('post')}
            >
              帖子
            </View>
            <View
              className={classnames('otheruser-order-title-choice-right', {
                'active-decoration-right': activePage === 'activity',
              })}
              onClick={() => setActivePage('activity')}
            >
              活动
            </View>
          </View>
        </View>

        <View className="otheruser-content">
          {activePage === 'post' ? (
            minePostList.length === 0 ? (
              <MinePageNull />
            ) : (
              <View style={{ marginLeft: '30rpx', marginRight: '30rpx', marginTop: '10rpx' }}>
                <GridView type="masonry" crossAxisGap={5} mainAxisGap={5}>
                  {minePostList.map((item, index) => (
                    <View
                      key={index}
                      id={`post-item-${index}`}
                      onClick={() => {
                        setSelectPostList(minePostList);
                        setPostIndex(item.id);
                        setBackPage('mineHome');
                      }}
                    >
                      <PostCard item={item} index={index} isShowImg={isShowList.includes(index)} />
                    </View>
                  ))}
                </GridView>
              </View>
            )
          ) : (
            <MyActivityTab
              activeIndex="release"
              setIsShowActivityWindow={setIsShowActivityWindow}
              userActivityList={activityList}
              onLoadMore={loadMoreActivities}
              hasMore={activityHasMore}
              loading={activityLoading}
            />
          )}
        </View>
      </ScrollView>
      <ActivityModal
        isShowActivityWindow={isShowActivityWindow}
        WindowType="active"
        setShowPostWindow={setIsShowActivityWindow}
      ></ActivityModal>
    </>
  );
};

export default withDoorGuard(Index);
