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
import { GetNotificationCountResponse, PostDetailInfo } from '@/common/types';
import ScrollTop from '@/modules/ScrollTop';
import useDoorStore from '@/store/DoorStote';

const Index = () => {
  const [isAlbumVisiable, setIsAlbumVisiable] = useState(false);
  const [windowHeight, setWindowHeight] = useState(0);
  // Set 语义：卡片可见性查询 O(1)，且只在集合真正变化时才 setState，避免每帧全量 re-render
  const [isShowList, setIsShowList] = useState<Set<number>>(() => new Set());
  const [searchValue, setSearchValue] = useState<string>('');
  const [currentSearchKeyword, setCurrentSearchKeyword] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { showImg: imgUrl, setImgUrl } = usePostStore();
  const { PostList, setPostList, setSelectPostList, setBackPage, setPostIndex } = usePostStore();
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

  /**
   * 原来读的是 windowHeight state，而它只在 Taro.useReady 里赋值：
   * useDidShow 早于 onReady，加上 setTimeout(100) 里捕获的是旧 render 的闭包，
   * 首次进入/重新进入时 measure 常常拿到 0，
   * viewportBottom 就退化成只剩 BUFFER(300px)，
   * 瀑布流两列里只有最上面那两张卡片被判为「可见」，其余永久骨架屏，
   * 直到有滚动事件走 handleScroll 才重新算出来 —— 就是用户看到的现象。
   */
  const getViewportHeight = () => {
    try {
      const info = Taro.getWindowInfo ? Taro.getWindowInfo() : Taro.getSystemInfoSync();
      if (info && info.windowHeight > 0) return info.windowHeight;
    } catch (e) {
      // 取不到就走兜底值
    }
    // 其次用 useReady 里存的高度，最后按小屏估一个，
    // 宁可多加载几张也不要漏显示
    return windowHeight > 0 ? windowHeight : 667;
  };

  const handleCancel = async () => {
    setSearchValue('');
    setCurrentSearchKeyword('');
    setHasMore(true);
    await loadPosts(1, true, '');
  };
  const positions = useRef<
    {
      top: number;
      bottom: number;
    }[]
  >([]);
  /** 已测量过位置的卡片数量：高度预分配后旧卡片位置稳定，追加数据时只增量测量新增部分 */
  const measuredCount = useRef(0);
  const scrollRaf = useRef(false);
  const hasLoadedPosts = useRef(false);
  const pageRef = useRef(1);
  const refreshingRef = useRef(false);
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
      setSelectPostList(list);
      // 列表整体替换：位置与可见集合全部作废，等新列表渲染后重新测量；
      // 顺带清掉未触发的卸载定时器，避免旧索引误删新列表的可见项
      positions.current = [];
      measuredCount.current = 0;
      visibleSet.current = new Set();
      Object.values(unloadTimers.current).forEach(clearTimeout);
      unloadTimers.current = {};
      setIsShowList(new Set());
    } else {
      const latestPostList = usePostStore.getState().PostList;
      setPostList([...latestPostList, ...list]);
      setSelectPostList([...latestPostList, ...list]);
    }
    setPage(page);
    pageRef.current = page;
    if (res.data.total !== undefined) {
      setTotalPosts(res.data.total);
    }
    return list.length;
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

    if (PostList.length > measuredCount.current) {
      setTimeout(() => {
        measurePostPositions(measuredCount.current);
      }, 100);
    }
    // doorStatus 放行时列表由 3 条变全量，也要补测剩余卡片
  }, [PostList, doorStatus]);

  Taro.useReady(() => {
    const newwindowHeight = Taro.getWindowInfo().windowHeight;
    setWindowHeight(newwindowHeight);
  });

  /**
   * 只测量 [fromIndex, renderedCount) 的卡片位置。
   * 高度已按宽高比预分配，追加数据时旧卡片位置不会变化，
   * 所以 loadMore 后只需增量测量新增卡片，不再全量重测。
   * 门禁灰度只渲染前 3 条时也按实际渲染数量测量，避免对不存在的节点发查询。
   */
  const measurePostPositions = (fromIndex: number) => {
    const renderedCount =
      doorStatus !== 'pass' ? Math.min(PostList?.length ?? 0, 3) : PostList?.length ?? 0;
    if (fromIndex >= renderedCount) return;

    const query = Taro.createSelectorQuery();
    for (let i = fromIndex; i < renderedCount; i++) {
      query.select(`#post-item-${i}`).boundingClientRect();
    }

    query.exec((res) => {
      const measured = res.map((rect: any) => ({
        top: rect?.top ?? 0,
        bottom: rect?.bottom ?? 0,
      }));

      if (fromIndex === 0) {
        positions.current = measured;
      } else {
        positions.current.push(...measured);
      }
      measuredCount.current = renderedCount;

      // 初始化可见列表，确保首次加载时显示图片
      const viewportTop = 0;
      const viewportBottom = getViewportHeight() + BUFFER;
      // 与上一次的结果取并集：测量只会「多显示」，不会把已经在显示的卡片重新藏回骨架屏
      const initialVisible = new Set<number>(visibleSet.current);

      positions.current.forEach((position, index) => {
        const { top, bottom } = position;
        const inView = bottom >= viewportTop && top <= viewportBottom;
        if (inView) {
          initialVisible.add(index);
        }
      });

      // 首屏兜底：即使整体测量异常，前几张卡片也一定显示图片，不会再出现「只有两张有图」
      for (let i = 0; i < Math.min(6, positions.current.length); i++) {
        initialVisible.add(i);
      }

      visibleSet.current = initialVisible;
      setIsShowList(new Set(initialVisible));

      if (positions.current.length > 0) {
        const lastBottom = positions.current[positions.current.length - 1].bottom;
        if (lastBottom < viewportBottom) {
          loadMore();
        }
      }
    });
  };

  const handleScroll = (e: any) => {
    const scrollTop = e?.detail?.scrollTop || 0;
    // 这里也改成实时取，不依赖可能为 0 的 windowHeight state
    const viewportHeight = getViewportHeight();

    setShowScrollTop(scrollTop > 300);

    const distanceToBottom = e.detail.scrollHeight - (scrollTop + viewportHeight);
    if (distanceToBottom <= BUFFER) {
      loadMore();
    }

    const viewportTop = scrollTop - BUFFER;
    const viewportBottom = scrollTop + viewportHeight + BUFFER;
    const pos = positions.current;
    const n = pos.length;
    if (n === 0) return;

    // positions 按渲染顺序存储，masonry 布局下 top 单调不减（每张卡片都放到较矮的一列），
    // 二分出第一个 top >= viewportTop 的索引，它之前的都在视口上方，永久保留
    let lo = 0;
    let hi = n - 1;
    let start = n;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (pos[mid].top >= viewportTop) {
        start = mid;
        hi = mid - 1;
      } else {
        lo = mid + 1;
      }
    }

    const next = new Set<number>();

    // 上方区域：永久可见（含 top 在视口上方、底边还没滚出去的图片）
    for (let i = 0; i < start; i++) {
      next.add(i);
      if (unloadTimers.current[i]) {
        clearTimeout(unloadTimers.current[i]);
        delete unloadTimers.current[i];
      }
    }

    // 窗口区域：只走到第一个 top 超出视口底部的卡片，下方区域无需遍历
    for (let i = start; i < n && pos[i].top <= viewportBottom; i++) {
      next.add(i);
      if (unloadTimers.current[i]) {
        clearTimeout(unloadTimers.current[i]);
        delete unloadTimers.current[i];
      }
    }

    // 只检查此前可见集合里滑到窗口下方的项，安排延迟卸载（滚动上移时它们不在 next 里）
    const prev = visibleSet.current;
    prev.forEach((i) => {
      if (next.has(i)) return;
      if (!unloadTimers.current[i]) {
        unloadTimers.current[i] = setTimeout(() => {
          visibleSet.current.delete(i);
          setIsShowList(new Set(visibleSet.current));
          delete unloadTimers.current[i];
        }, 3000);
      }
    });

    // 集合没变化就不 setState，避免每个滚动帧都触发整列表 re-render
    let changed = prev.size !== next.size;
    if (!changed) {
      for (const i of next) {
        if (!prev.has(i)) {
          changed = true;
          break;
        }
      }
    }

    visibleSet.current = next;
    if (changed) {
      setIsShowList(new Set(next));
    }
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
    refreshingRef.current = true;
    const startTime = Date.now();
    const MIN_REFRESH_DURATION = 1500;

    const timeoutId = setTimeout(() => {
      if (refreshingRef.current) {
        setRefreshing(false);
        refreshingRef.current = false;
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
          refreshingRef.current = false;
        }, remaining);
      } else {
        clearTimeoutSafely();
        setRefreshing(false);
        refreshingRef.current = false;
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
      refreshingRef.current = false;
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
      const latestPostList = usePostStore.getState().PostList;
      if (latestPostList.length >= totalPosts) {
        setHasMore(false);
      }
      await loadPosts(pageRef.current + 1, false, currentSearchKeyword);
    } catch (error) {
      console.error('加载更多失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 限制展示的帖子数量
  const visiblePostList = doorStatus !== 'pass' ? PostList?.slice(0, 3) : PostList;

  /**
   * 图片宽高已由后端落库，无需等图片加载就能按宽高比算出最终展示高度，
   * 骨架屏与图片占同一高度，避免「先定高、加载后展开」的跳动。
   * 布局口径与 GridView 保持一致：两列、crossAxisGap 5px、容器宽 90%。
   */
  const GRID_GAP = 5;
  const windowWidthPx = Taro.getWindowInfo().windowWidth;
  const columnWidthPx = (windowWidthPx * 0.9 - GRID_GAP) / 2;
  const MAX_IMG_HEIGHT_PX = (500 / 750) * windowWidthPx; // 与 PostCard 的 maxHeight 500rpx 一致
  const DEFAULT_IMG_HEIGHT_PX = (360 / 750) * windowWidthPx; // 与骨架屏 360rpx 一致

  const calcCardImageHeight = (item: PostDetailInfo) => {
    const img = item.showImg?.[0];
    if (!img || !img.width || !img.height) return DEFAULT_IMG_HEIGHT_PX;
    return Math.round(Math.min((img.height / img.width) * columnWidthPx, MAX_IMG_HEIGHT_PX));
  };

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
          withSize
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
              {searchValue && (
                <View className="cancel-btn" onClick={handleCancel}>
                  取消
                </View>
              )}
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
                      setSelectPostList(PostList);
                      setPostIndex(item.id);
                      setBackPage('postHome');
                    }}
                  >
                    <PostCard
                      item={item}
                      index={index}
                      isShowImg={isShowList.has(index)}
                      imageHeight={calcCardImageHeight(item)}
                    />
                  </View>
                ))}
          </GridView>
        </ScrollView>
      </View>
    </>
  );
};

export default Index;
