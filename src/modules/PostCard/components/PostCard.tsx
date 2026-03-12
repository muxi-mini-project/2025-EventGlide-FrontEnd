import './style.scss';
import { View, Image, Text } from '@tarojs/components';
import Taro, { navigateTo } from '@tarojs/taro';
import favorite from '@/common/svg/post/heart.svg';
import favoriteActive from '@/common/svg/post/likeicon.svg';
import { memo, useState, useEffect } from 'react';
import usePostStore from '@/store/PostStore';
import handleInteraction from '@/common/utils/Interaction';

const PostCard: React.FC<any> = memo(function ({ item, index, isShowImg }) {
  const [isVisiable, setIsVisiable] = useState(isShowImg);
  const { setPostIndex } = usePostStore();
  const [islike, setIsLike] = useState(item.isLike === 'true');
  const [likeNum, setLikeNum] = useState(item.likeNum);
  const studentId = Taro.getStorageSync('sid');

  useEffect(() => {
    setIsVisiable(isShowImg);
  }, [isShowImg]);
  useEffect(() => {
    setIsLike(item.isLike === 'true');
    setLikeNum(item.likeNum);
  }, [item]);

  const handleFavorite = async () => {
    const params = {
      subject: 'post',
      studentId: studentId,
      targetId: item.bid,
      receiver: item.userInfo.studentId,
    };
    if (islike) {
      try {
        const res = await handleInteraction('dislike', params);
        if (res.msg === 'success') {
          setIsLike(false);
          setLikeNum(likeNum - 1);
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const res = await handleInteraction('like', params);
        if (res.msg === 'success') {
          setIsLike(true);
          setLikeNum(likeNum + 1);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <View className="post-container">
      <View style={{ maxHeight: '500rpx', overflow: 'hidden' }}>
        {isVisiable ? (
          <Image
            className="img"
            mode="widthFix"
            lazyLoad={true}
            src={item.showImg[0]}
            onClick={() => {
              navigateTo({ url: '/subpackage/postDetail/index' });
              setPostIndex(index);
            }}
          ></Image>
        ) : (
          <View className="image-loader"></View>
        )}
      </View>
      <View className="content">
        <View className="title">
          <Text>{item.title}</Text>
        </View>
        <View className="title-container">
          <View className="post-user">
            <Image className="avatar" src={item.userInfo.avatar}></Image>
            <Text className="username">{item.userInfo.username}</Text>
          </View>
          <View className="post-favorite">
            <Image
              className="avatar"
              src={islike ? favoriteActive : favorite}
              mode="widthFix"
              onClick={() => handleFavorite()}
            ></Image>
            <View className="count">{likeNum}</View>
          </View>
        </View>
      </View>
    </View>
  );
});

export default PostCard;
