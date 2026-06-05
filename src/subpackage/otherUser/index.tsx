import { View, Image, ScrollView, GridView } from '@tarojs/components';
import './index.scss';
import { MyActivityTab } from '@/modules/MyPageContent';
import Taro, { useDidShow } from '@tarojs/taro';
import { useState, useEffect } from 'react';
import classnames from 'classnames';
import { getOtherUserPostList, getUserInfo, getOtherUserActivityList } from '@/common/api';
import { PostDetailInfo } from '@/common/types';
import { NavigationBarBack } from '@/common/components/NavigationBar';
import PostCard from '@/modules/PostCard';
import usePostStore from '@/store/PostStore';
import ActivityModal from '@/modules/ActivityModal';
import MinePageNull from '@/modules/EmptyComponent/components/minepagenull';
import { ActivityDetailInfo } from '@/common/types';

const OtherUser = () => {
  const [activePage, setActivePage] = useState<'activity' | 'post'>('post');
  const [isShowActivityWindow, setIsShowActivityWindow] = useState(false);
  const [isShowList, setIsShowList] = useState<number[]>([0, 1, 2, 3]);
  const { setPostIndex, setBackPage } = usePostStore();
  const [minePostList, setMinePostList] = useState<PostDetailInfo[]>([]);
  const [activityList, setActivityList] = useState<ActivityDetailInfo[]>([]);
  const [avatar, setAvatar] = useState('');
  const [username, setUsername] = useState('');
  const [school, setSchool] = useState('');
  const sid = Taro.getStorageSync('targetUser');

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
    const fetchActivity = async () => {
      try {
        const res = await getOtherUserActivityList(sid);
        console.log('activityList:', res.data);
        if (res.data === null) {
          setActivityList([]);
          return;
        }
        setActivityList(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchActivity();
  });

  useEffect(() => {
    if (activePage === 'post') {
      const fetchPosts = async () => {
        try {
          const res = await getOtherUserPostList(sid);
          console.log('postList:', res.data);
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
  }, [activePage]);

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
        onScroll={() => handleScroll()}
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
              activeIndex="release"
              setIsShowActivityWindow={setIsShowActivityWindow}
              userActivityList={activityList}
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

export default OtherUser;
