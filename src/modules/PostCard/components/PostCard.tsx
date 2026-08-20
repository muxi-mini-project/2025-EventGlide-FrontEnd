import './style.scss';
import { View, Image, Text } from '@tarojs/components';
import Taro, { navigateTo } from '@tarojs/taro';
import favorite from '@/common/svg/post/heart.svg';
import favoriteActive from '@/common/svg/post/likeicon.svg';
import { memo, useState, useEffect } from 'react';
import handleInteraction from '@/common/utils/Interaction';
import usePostStore from '@/store/PostStore';

const PostCard: React.FC<any> = memo(function ({ item, isShowImg }) {
  // const [islike, setIsLike] = useState(item.isLike === 'true');
  // const [likeNum, setLikeNum] = useState(item.likeNum);
  const [localImageUrl, setLocalImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const studentId = Taro.getStorageSync('sid');

  const { setLikeNumChange } = usePostStore((state) => state);
  const params = {
    subject: 'post',
    studentId: studentId,
    targetId: item.id,
  };
  const handleLike = async () => {
    if (item.isLike === 'true') {
      try {
        const res = await handleInteraction('dislike', params);
        if (res.msg === 'success') {
          setLikeNumChange(item, 0);
        }
      } catch (err) {
        console.log(err);
      }
    } else if (item.isLike === 'false') {
      try {
        const res = await handleInteraction('like', params);
        console.log(res);
        if (res.msg === 'success') {
          setLikeNumChange(item, 1);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };
  // useEffect(() => {
  //   setIsLike(item.isLike === 'true');
  //   setLikeNum(item.likeNum);
  // }, [item]);

  // 只有在可见时才加载图片资源
  useEffect(() => {
    if (!isShowImg || !item.showImg || item.showImg.length === 0) {
      setIsLoading(false);
      setLocalImageUrl('');
      return;
    }

    /* const loadImage = async () => {
      setIsLoading(true);
      const imageUrl = item.showImg[0];

      try {
        const cachedUrl = await imageCache.getImage(imageUrl);
        setLocalImageUrl(cachedUrl);
      } catch (error) {
        setLocalImageUrl(imageUrl);
      } finally {
        setIsLoading(false);
      }
    };

    loadImage(); */
  }, [isShowImg, item.showImg]);

  // const handleFavorite = async () => {
  //   const params = {
  //     subject: 'post',
  //     studentId: studentId,
  //     targetId: item.id,
  //     receiver: item.userInfo.studentId,
  //   };
  //   if (item.isCollect === 'true') {
  //     try {
  //       const res = await handleInteraction('dislike', params);
  //       if (res.msg === 'success') {
  //         setCollectNumChange(item, 0);
  //       }

  //     } catch (err) {
  //       console.log(err);
  //     }
  //   } else {
  //     try {
  //       const res = await handleInteraction('like', params);
  //       if (res.msg === 'success') {
  //         handleLike();
  //       }
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }
  // };

  return (
    <View className="post-container">
      {/* <View
        style={{ height: '10rpx', backgroundColor: isShowImg ? 'green' : 'red', width: '100%' }}
      ></View> */}
      <View
        style={{ maxHeight: '500rpx', overflow: 'hidden' }}
        onClick={() => {
          navigateTo({ url: '/subpackage/postDetail/index' });
        }}
      >
        {isShowImg ? (
          <View>
            <Image
              className="img"
              mode="widthFix"
              lazyLoad={true}
              src={localImageUrl || item.showImg[0]}
              onLoad={() => setIsLoading(false)}
            ></Image>
            {isLoading && <View className="image-loader"></View>}
          </View>
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
              src={item.isLike === 'true' ? favoriteActive : favorite}
              mode="widthFix"
              onClick={() => handleLike()}
            ></Image>
            <View className="count">{item.likeNum}</View>
          </View>
        </View>
      </View>
    </View>
  );
});

export default PostCard;