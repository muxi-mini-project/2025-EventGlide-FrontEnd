import { View, Image, ScrollView, GridView, Input } from '@tarojs/components';
import './index.scss';
import { MyActivityTab } from '@/modules/MyPageContent';
import Taro, { useDidShow } from '@tarojs/taro';
import { useState, useEffect, useMemo } from 'react';
import classnames from 'classnames';
import check from '@/common/svg/Postlist/搜索.svg';
import { getMyPostList } from '@/common/api';
import useActivityStore from '@/store/ActivityStore';
import { PostDetailInfo } from '@/common/types';
import { NavigationBarTabBar } from '@/common/components/NavigationBar';
import PostCard from '@/modules/PostCard';
import usePostStore from '@/store/PostStore';
import ActivityModal from '@/modules/ActivityModal';
import MinePageNull from '@/modules/EmptyComponent/components/minepagenull';

const Index = () => {
  const [activePage, setActivePage] = useState<'activity' | 'post'>('post');
  const [activeIndex, setActiveIndex] = useState<'release' | 'like' | 'favourite'>('release');
  const [isShowActivityWindow, setIsShowActivityWindow] = useState(false);
  const [isShowList, setIsShowList] = useState<number[]>([0, 1, 2, 3]);
  const { setPostIndex, setBackPage } = usePostStore();
  const [minePostList, setMinePostList] = useState<PostDetailInfo[]>([]);
  const { setIsSelect } = useActivityStore();
  const [searchValue, setSearchValue] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

  useDidShow(() => {
    setIsSelect(false);
  });

  useEffect(() => {
    if (activePage === 'post') {
      const fetchPosts = async () => {
        try {
          const res = await getMyPostList(activeIndex);
          console.log(`${activeIndex}:`, res.data);
          if (res.data === null) {
            setMinePostList([]);
            return;
          }
          const newPostList: PostDetailInfo[] = [];
          res.data.forEach((item: unknown) => {
            newPostList.push(item as PostDetailInfo);
          });
          setMinePostList(newPostList);
          setIsShowList([0, 1, 2, 3]);
        } catch (err) {
          console.log(err);
        }
      };

      fetchPosts();
    }
  }, [activeIndex, activePage]);

  const filteredPostList = useMemo(() => {
    if (!searchKeyword.trim()) {
      return minePostList;
    }
    const keywordLower = searchKeyword.toLowerCase().trim();
    return minePostList.filter((post) => post.title.toLowerCase().includes(keywordLower));
  }, [minePostList, searchKeyword]);

  useEffect(() => {
    if (activePage === 'post' && filteredPostList.length > 0) {
      console.log('handleScroll');
      handleScroll();
    }
  }, [activePage, filteredPostList]);

  const handleScroll = () => {
    const windowHeight = Taro.getWindowInfo().windowHeight;
    const query = Taro.createSelectorQuery();
    filteredPostList.forEach((_, index) => {
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
        } else {
          /* setIsShowList((prevList) => {
            return prevList.filter((item) => item !== index);
          }); */
        }
      });
    });
  };

  const handleSearch = () => {
    setSearchKeyword(searchValue);
  };

  return (
    <>
      <NavigationBarTabBar backgroundColor="#7D73F0" color="#ffffff" title="我的" />
      <View className="search">
        <View className="search-input-box">
          <Image src={check} className="search-icon" mode="widthFix" />
          <Input
            className="search-input"
            placeholder-class="input-placeholder"
            placeholder="在这里可以查找你想要的活动哦"
            type="text"
            confirmType="search"
            value={searchValue}
            onInput={(e) => setSearchValue(e.detail.value)}
            onConfirm={handleSearch}
          />
        </View>
        <View className="search-cancel" onClick={() => Taro.navigateBack()}>
          取消
        </View>
      </View>

      <ScrollView
        className="mySearch-page"
        scrollY={true}
        type="custom"
        onScroll={() => handleScroll()}
        usingSticky={true}
        enhanced={true}
        showScrollbar={false}
        id="scrollView"
      >
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

        <View className="mine-content">
          {activePage === 'post' ? (
            filteredPostList.length === 0 ? (
              <MinePageNull />
            ) : (
              <View style={{ marginLeft: '30rpx', marginRight: '30rpx', marginTop: '5rpx' }}>
                <GridView type="masonry" crossAxisGap={5} mainAxisGap={5}>
                  {filteredPostList.map((item, index) => (
                    <View
                      key={index}
                      id={`post-item-${index}`}
                      onClick={() => {
                        setPostIndex(item.bid);
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
              activeIndex={activeIndex}
              setIsShowActivityWindow={setIsShowActivityWindow}
              searchValue={searchKeyword}
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

export default Index;
