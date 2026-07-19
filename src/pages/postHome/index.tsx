import { View, ScrollView, GridView, Image, Input } from '@tarojs/components';
import Taro, { navigateTo, useDidShow } from '@tarojs/taro';
import { useState, useEffect, useRef } from 'react';
import './index.scss';
import PostCard from '@/modules/PostCard/index';
import AddPostButton from '@/modules/AddPostButton';
import ImagePicker from '@/modules/ImagePicker';
import searchpic from '@/common/svg/Postlist/搜索.svg';
import Info from '@/common/svg/Post/info.svg';
import usePostStore from '@/store/PostStore';
import { get } from '@/common/api/request';
import useActivityStore from '@/store/ActivityStore';
import { NavigationBarTabBar } from '@/common/components/NavigationBar';
import { getPostList, searchPostList } from '@/common/api';
import { GetNotificationCountResponse } from '@/common/types';
import ScrollTop from '@/modules/ScrollTop';
import useDoorStore from '@/store/DoorStote';

const Index = () => {
  const [isAlbumVisiable, setIsAlbumVisiable] = useState(false);
  const [windowHeight, setWindowHeight] = useState(0);
  const [isShowList, setIsShowList] = useState<number[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [currentSearchKeyword, setCurrentSearchKeyword] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { showImg: imgUrl, setImgUrl } = usePostStore();
  const { PostList, setPostList, setBackPage, setPostIndex } = usePostStore();
  const { setIsSelect } = useActivityStore();
  const [msgCount, setMsgCount] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const unloadTimers = useRef<Record<number, any>>({});
  const visibleSet = useRef<Set<number>>(new Set());
  const BUFFER = 300;
  const [page, setPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const LIMIT = 10;
  const positions = useRef<
    {
      top: number;
      bottom: number;
    }[]
  >([]);
  const scrollRaf = useRef(false);
  const hasLoadedPosts = useRef(false);
  const { doorStatus } = useDoorStore();

  const loadPosts = async (page = 1, refresh = false, searchKeyword = '') => {
    const shouldSearch = searchKeyword !== '';
    const res = shouldSearch
      ? await searchPostList({
          page: page,
          limit: LIMIT,
          name: searchKeyword,
        })
      : await getPostList({
          page: page,
          limit: LIMIT,
        });
    console.log(res);
    const list = res.data.details || [];
    if (refresh) {
      setPostList(list);
    } else {
      setPostList([...PostList, ...list]);
    }
    setPage(page);
    if (res.data.total !== undefined) {
      setTotalPosts(res.data.total);
    }
  };

  useDidShow(async () => {
    setIsSelect(false);
    if (!hasLoadedPosts.current) {
      hasLoadedPosts.current = true;
      setHasMore(true);
      await loadPosts(1, true, '');
      setImgUrl([]);
    }
  });

  useEffect(() => {
    if (PostList === null) return;

    if (PostList.length > 0) {
      setTimeout(() => {
        measurePostPositions();
      }, 100);
    }
  }, [PostList]);

  Taro.useReady(() => {
    const newwindowHeight = Taro.getWindowInfo().windowHeight;
    setWindowHeight(newwindowHeight);
  });

  const measurePostPositions = () => {
    const query = Taro.createSelectorQuery();

    PostList.forEach((_, index) => {
      query.select(`#post-item-${index}`).boundingClientRect();
    });

    query.exec((res) => {
      positions.current = res.map((rect: any) => ({
        top: rect?.top ?? 0,
        bottom: rect?.bottom ?? 0,
      }));

      handleScroll({
        detail: {
          scrollTop: 0,
        },
      });
    });
  };

  const handleScroll = (e: any) => {
    const scrollTop = e?.detail?.scrollTop || 0;

    setShowScrollTop(scrollTop > 300);

    const distanceToBottom = e.detail.scrollHeight - (scrollTop + windowHeight);
    if (distanceToBottom <= BUFFER) {
      loadMore();
    }

    const viewportTop = scrollTop - BUFFER;
    const viewportBottom = scrollTop + windowHeight + BUFFER;

    const newVisible = new Set<number>();

    positions.current.forEach((position, index) => {
      const { top, bottom } = position;

      const inView = bottom >= viewportTop && top <= viewportBottom;

      const aboveView = bottom < viewportTop;
      const belowView = top > viewportBottom;

      // 当前区域
      if (inView) {
        newVisible.add(index);

        if (unloadTimers.current[index]) {
          clearTimeout(unloadTimers.current[index]);
          delete unloadTimers.current[index];
        }
      }

      // 上方区域永久保留
      else if (aboveView) {
        newVisible.add(index);

        if (unloadTimers.current[index]) {
          clearTimeout(unloadTimers.current[index]);
          delete unloadTimers.current[index];
        }
      }

      // 下方区域延迟卸载
      else if (belowView) {
        if (!unloadTimers.current[index]) {
          unloadTimers.current[index] = setTimeout(() => {
            visibleSet.current.delete(index);

            setIsShowList(Array.from(visibleSet.current));

            delete unloadTimers.current[index];
          }, 3000);
        }
      }
    });

    visibleSet.current = newVisible;

    setIsShowList(Array.from(newVisible));
  };

  const handleSearch = async () => {
    setHasMore(true);
    setCurrentSearchKeyword(searchValue);
    await loadPosts(1, true, searchValue);
  };

  useDidShow(async () => {
    try {
      const res = await get<GetNotificationCountResponse>('/feed/total');
      setMsgCount(res?.data?.total || 0);
    } catch (err) {
      console.log(err);
    }
  });

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
      setHasMore(true);
      await loadPosts(1, true, currentSearchKeyword);

      const feedRes = await get<GetNotificationCountResponse>('/feed/total');
      setMsgCount(feedRes.data.total);
      finishRefresh();
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

  const loadMore = async () => {
    if (loading || !hasMore || refreshing) return;
    setLoading(true);
    try {
      if (PostList.length >= totalPosts) {
        setHasMore(false);
      }
      await loadPosts(page + 1, false, currentSearchKeyword);
    } catch (error) {
      console.error('加载更多失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 限制展示的帖子数量
  const visiblePostList = doorStatus !== 'pass' ? PostList?.slice(0, 3) : PostList;

  return (
    <>
      <NavigationBarTabBar backgroundColor="#FFFFFF" title="发现" />
      <View className="blog-page">
        <ScrollTop setScrollTop={setScrollTop} isVisible={showScrollTop} bottom={150} />
        {doorStatus === 'pass' && <AddPostButton setIsVisiable={setIsAlbumVisiable} />}
        <ImagePicker
          isVisiable={isAlbumVisiable}
          setIsVisiable={setIsAlbumVisiable}
          imgUrl={imgUrl}
          setImgUrl={setImgUrl}
          type={'blog'}
        />
        <View className="search-container">
          <View className="info-icon-container">
            <Image
              src={Info}
              className="info-icon"
              mode="widthFix"
              onClick={() => navigateTo({ url: '/subpackage/myNotification/index' })}
            />
            {msgCount > 0 && (
              <View className="info-icon-msg">{msgCount < 100 ? msgCount : '99+'}</View>
            )}
          </View>
          <View className="sticky-search">
            <View className="search-input-box">
              <Image src={searchpic} className="gap" mode="widthFix" />
              <Input
                className="search-input"
                placeholder-class="input-placeholder"
                placeholder="搜索你想要的"
                type="text"
                confirmType="search"
                value={searchValue}
                onInput={(e) => setSearchValue(e.detail.value)}
                onConfirm={() => handleSearch()}
              />
            </View>
            {/* <View className="search-btn" onClick={() => handleSearch()}>
              搜索
            </View> */}
          </View>
        </View>
        <ScrollView
          className="blog-container"
          type="custom"
          style={{ height: 'calc(100vh - 270rpx)' }}
          scrollY={true}
          scrollTop={scrollTop}
          onScroll={(e) => {
            if (scrollRaf.current) return;

            scrollRaf.current = true;

            requestAnimationFrame(() => {
              handleScroll(e);
              scrollRaf.current = false;
            });
          }}
          enhanced={true}
          showScrollbar={false}
          refresherEnabled={true}
          refresherTriggered={refreshing}
          onRefresherRefresh={onRefresh}
          refresherBackground="#f9f8fc"
        >
          <GridView type="masonry" crossAxisGap={5} mainAxisGap={5}>
            {visiblePostList === null
              ? null
              : visiblePostList.map((item, index) => (
                  <View
                    key={index}
                    id={`post-item-${index}`}
                    onClick={() => {
                      setPostIndex(item.id);
                      setBackPage('postHome');
                    }}
                  >
                    <PostCard item={item} index={index} isShowImg={isShowList.includes(index)} />
                  </View>
                ))}
          </GridView>
        </ScrollView>
      </View>
    </>
  );
};

export default Index;
