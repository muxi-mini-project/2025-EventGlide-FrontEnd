import { View, ScrollView, GridView, Image, Input } from '@tarojs/components';
import Taro, { navigateTo, useDidShow } from '@tarojs/taro';
import { useState, useEffect } from 'react';
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

const Index = () => {
  const [isAlbumVisiable, setIsAlbumVisiable] = useState(false);
  const [windowHeight, setWindowHeight] = useState(0);
  const [isShowList, setIsShowList] = useState<number[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);
  const { showImg: imgUrl, setImgUrl } = usePostStore();
  const { PostList, setPostList, setBackPage, setPostIndex } = usePostStore();
  const { setIsSelect } = useActivityStore();
  const [msgCount, setMsgCount] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  useDidShow(() => {
    setIsSelect(false);
  });

  useDidShow(async () => {
    try {
      const postListRes = await getPostList();
      setPostList(postListRes.data);
      console.log(postListRes.data);
    } catch (error) {
      console.error('获取帖子列表失败:', error);
    }

    setImgUrl([]);
  });

  useEffect(() => {
    if (PostList === null) return;
    if (PostList.length > 0) {
      handleScroll(windowHeight);
    }
  }, [PostList]);

  Taro.useReady(() => {
    const newwindowHeight = Taro.getWindowInfo().windowHeight;
    setWindowHeight(newwindowHeight);
  });

  const handleScroll = (e: any, newwindowHeight?: number) => {
    if (e && e.detail) {
      setShowScrollTop(e.detail.scrollTop > 300);
    }
    let tempHeight = windowHeight;
    if (newwindowHeight) {
      tempHeight = newwindowHeight;
    }
    const query = Taro.createSelectorQuery();
    PostList.forEach((_, index) => {
      query.select(`#post-item-${index}`).boundingClientRect();
    });
    query.exec((res) => {
      res.forEach((rect, index) => {
        if (!rect) return;
        const { top, bottom } = rect;
        if (top <= tempHeight && bottom >= 0) {
          setIsShowList((prevList) => {
            if (!prevList.includes(index)) {
              return [...prevList, index];
            }
            return prevList;
          });
        } else {
          setIsShowList((prevList) => {
            return prevList.filter((item) => item !== index);
          });
        }
      });
    });
  };

  const handleSearch = async () => {
    if (searchValue === '') {
      try {
        const res = await getPostList();
        if (res.msg === 'success') {
          setPostList(res.data);
        } else {
          Taro.showToast({
            title: `${res.msg}`,
            icon: 'none',
            duration: 1000,
          });
        }
      } catch (error) {
        console.error('获取帖子列表失败:', error);
        Taro.showToast({
          title: '获取帖子列表失败',
          icon: 'none',
          duration: 1000,
        });
      }
    } else {
      try {
        const res = await searchPostList({ name: searchValue });
        if (res.msg === 'success') {
          setPostList(res.data);
        } else {
          Taro.showToast({
            title: `${res.msg}`,
            icon: 'none',
            duration: 1000,
          });
        }
      } catch (error) {
        console.error('搜索帖子失败:', error);
        Taro.showToast({
          title: '搜索帖子失败',
          icon: 'none',
          duration: 1000,
        });
      }
    }
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

    const timeoutId = setTimeout(() => {
      if (refreshing) {
        setRefreshing(false);
        console.log('刷新失败');
      }
    }, 3000);

    const clearTimeoutSafely = () => {
      clearTimeout(timeoutId);
    };

    try {
      if (searchValue === '') {
        try {
          const res = await getPostList();
          clearTimeoutSafely();
          setPostList(res.data);

          const feedRes = await get<GetNotificationCountResponse>('/feed/total');
          setMsgCount(feedRes.data.total);
          setRefreshing(false);
        } catch (err) {
          clearTimeoutSafely();
          setRefreshing(false);
          console.error(err);
        }
      } else {
        try {
          const res = await searchPostList({ name: searchValue });
          clearTimeoutSafely();
          if (res.msg === 'success') {
            setPostList(res.data);
          } else {
            Taro.showToast({
              title: `${res.msg}`,
              icon: 'none',
              duration: 1000,
            });
          }
          setRefreshing(false);
        } catch (err) {
          clearTimeoutSafely();
          setRefreshing(false);
          console.error(err);
        }
      }
    } catch (error) {
      clearTimeoutSafely();
      setRefreshing(false);
      console.error('刷新过程发生错误:', error);
      Taro.showToast({
        title: '刷新失败，请稍后重试',
        icon: 'none',
        duration: 1000,
      });
    }
  };

  return (
    <>
      <NavigationBarTabBar backgroundColor="#FFFFFF" title="发现" />
      <View className="blog-page">
        <ScrollTop setScrollTop={setScrollTop} isVisible={showScrollTop} bottom={150} />
        <AddPostButton setIsVisiable={setIsAlbumVisiable} />
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
        {/* <View > */}
        <ScrollView
          className="blog-container"
          type="custom"
          style={{ height: 'calc(100vh - 270rpx)' }}
          scrollY={true}
          scrollTop={scrollTop}
          onScroll={(e) => handleScroll(e)}
          enhanced={true}
          showScrollbar={false}
          refresherEnabled={true}
          refresherTriggered={refreshing}
          onRefresherRefresh={onRefresh}
          refresherBackground="#f9f8fc"
        >
          <GridView type="masonry" crossAxisGap={5} mainAxisGap={5}>
            {PostList === null
              ? null
              : PostList.map((item, index) => (
                  <View
                    key={index}
                    id={`post-item-${index}`}
                    onClick={() => {
                      setPostIndex(item.bid);
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
