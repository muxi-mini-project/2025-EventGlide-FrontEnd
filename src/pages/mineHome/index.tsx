import { View, Image, ScrollView, GridView } from '@tarojs/components';
import './index.scss';
import { MyActivityTab } from '@/modules/MyPageContent';
import Taro, { navigateTo, useDidShow } from '@tarojs/taro';
import { useState, useEffect } from 'react';
import classnames from 'classnames';
import arrowheadw from '@/common/svg/arrowhead/引导箭头-白.svg';
import check from '@/common/assets/Postlist/check.png';
import { getMyPostList, getUserInfo } from '@/common/api';
import useUserStore from '@/store/userStore';
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
  const { avatar, username, school, setAvatar, setUsername, setSchool } = useUserStore();
  const sid = Taro.getStorageSync('sid');
  const { setIsSelect } = useActivityStore();

  useDidShow(() => {
    setIsSelect(false);
  });

  useDidShow(async () => {
    try {
      const res = await getUserInfo(sid);
      setAvatar(res.data.avatar);
      setUsername(res.data.username);
      setSchool(res.data.school);
    } catch (err) {
      console.log(err);
    }
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
          handleScroll();
        } catch (err) {
          console.log(err);
        }
      };

      fetchPosts();
    }
  }, [activeIndex, activePage]);

  useEffect(() => {
    if (minePostList.length > 0 && activePage === 'post') {
      console.log('handleScroll');
      handleScroll();
    }
  }, [activePage, minePostList]);

  const handleScroll = () => {
    const windowHeight = Taro.getWindowInfo().windowHeight;
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
        } else {
          setIsShowList((prevList) => {
            return prevList.filter((item) => item !== index);
          });
        }
      });
    });
  };

  return (
    <>
      <NavigationBarTabBar backgroundColor="#FFFFFF" title="我的" />
      <ScrollView
        className="mine-page"
        scrollY={true}
        type="custom"
        onScroll={() => handleScroll()}
        usingSticky={true}
        enhanced={true}
        showScrollbar={false}
        style={{ height: 'calc(100vh - 180rpx)' }}
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
            <View
              className="mine-order-title-choice-check"
              onClick={() => navigateTo({ url: '/subpackage/review/index' })}
            >
              审核
            </View>
            <Image className="mine-order-title-choice-img" src={check}></Image>
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
              className={classnames('mine-order-title-index-mid', {
                'active-decoration-item': activeIndex === 'like',
              })}
              onClick={() => setActiveIndex('like')}
            >
              点赞
            </View>
            <View
              className={classnames('mine-order-title-index-right', {
                'active-decoration-item': activeIndex === 'favourite',
              })}
              onClick={() => setActiveIndex('favourite')}
            >
              收藏
            </View>
          </View>
        </View>

        <View className="mine-content">
          {activePage === 'post' ? (
            minePostList.length === 0 ? (
              <MinePageNull />
            ) : (
              <GridView type="masonry" crossAxisGap={5} mainAxisGap={5}>
                {minePostList.map((item, index) => (
                  <View
                    key={index}
                    style={{ padding: '10rpx' }}
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
            )
          ) : (
            <MyActivityTab
              activeIndex={activeIndex}
              setIsShowActivityWindow={setIsShowActivityWindow}
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
