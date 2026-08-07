import { View, Image, Swiper, SwiperItem, ScrollView } from '@tarojs/components';
import { useState, useEffect, createContext } from 'react';
import Taro, { useDidShow } from '@tarojs/taro';
import './index.scss';
import withDoorGuard from '@/common/hoc';
import { NavigationBar } from '@/common/components/NavigationBar';
import favor from '@/common/svg/post/heart.svg';
import collect from '@/common/svg/post/star.svg';
import collectActive from '@/common/svg/post/starAct.svg';
import favorActive from '@/common/svg/post/heartAct.svg';
import comment from '@/common/svg/post/comment.svg';
import icon from '@/common/svg/post/inputIcon.svg';
import { CreatorType } from '@/common/types';
import useUserStore from '@/store/userStore';
import usePostStore from '@/store/PostStore';
import handleInteraction from '@/common/utils/Interaction';
import { CommentResponse } from '@/common/types';
import { getCommentsBySubject, createComment, replyComment } from '@/common/api/Comment';
import ReplyInput from '@/modules/ReplyInput';
import CommentActionSheet from '@/modules/CommentActionSheet';
import CommentList from '@/modules/Comment';
import formatTime from '@/common/utils/FormatTime';

export const SetBlogReponseContext = createContext<(params: any) => void>(() => {});
export const SetBlogComment = createContext<(params: any) => void>(() => {});

const Index = () => {
  const [marginTop, setMarginTop] = useState(0);
  const [response, setResponse] = useState<CommentResponse[]>([]);
  const [inputValue, setInputValue] = useState('');
  const { avatar } = useUserStore((state) => state);
  const studentId = Taro.getStorageSync('sid');
  const {
    selectPostList,
    PostIndex,
    setCommentNumChange,
    backPage,
    selectCommentPost,
    setSelectCommentPost,
  } = usePostStore((state) => state);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [replyId, setReplyId] = useState('');
  const [commentInput, setCommentInput] = useState(false);
  const [replytype, setReplytype] = useState('create');
  const [showpicture, setShowpicture] = useState(false);
  const [imageRatios, setImageRatios] = useState<string[]>([]);
  const [ratios, setRatios] = useState<string[]>([]);
  const [maxheight, setMaxheight] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const [clickTimer, setClickTimer] = useState<NodeJS.Timeout | null>(null);
  const [commentOperation, setCommentOperation] = useState(false);
  const [commentItems, setCommentItems] = useState('');
  const [commentCreator, setCommentCreator] = useState<CreatorType>();
  const [commentid, setCommentid] = useState('');
  const [scrollToCommentId, setScrollToCommentId] = useState<string>('');
  const [loadSelectComment, setLoadSelectComment] = useState(false);
  const [loadComment, setLoadComment] = useState(false);
  const { setLikeNumChange, setCollectNumChange } = usePostStore((state) => state);
  const windowWidth = Taro.getWindowInfo().windowWidth;
  const windowHeight = Taro.getWindowInfo().windowHeight;
  const Item = selectPostList[PostIndex];
  console.log('postDetail', selectPostList, PostIndex, Item);
  const params = {
    subject: 'post',
    studentId: studentId,
    targetId: Item.id,
  };

  const reply_params = {
    parentId: replyId,
    subject: 'comment',
  };
  const comment_reply_params = {
    parentId: Item.id,
    subject: 'post',
    //receiver: Item.userInfo.studentId,
  };

  const handlepic = (pictures) => {
    let max = 0;
    let windowRatio = Number((windowHeight / windowWidth).toFixed(2));
    const res = Array(pictures.length).fill('widthimg');
    const res2 = Array(pictures.length).fill('widthimg');
    for (let i = 0; i < pictures.length; i++) {
      if (pictures[i] > 1.2) {
        max = 1.2;
        res[i] = 'heigthimg';
        if (pictures[i] > windowRatio) {
          res2[i] = 'heigthimg';
        }
      } else {
        max = Math.max(max, pictures[i]);
      }
    }
    console.log(res);
    console.log(max);
    setMaxheight(max);
    setImageRatios(res);
    setRatios(res2);
    setLoadSelectComment(true);
  };

  const loadImageRatios = async () => {
    if (Item && Item.showImg) {
      const ratios: number[] = [];

      for (const imgUrl of Item.showImg) {
        try {
          const imgInfo = await Taro.getImageInfo({ src: imgUrl });
          const ratio = Number((imgInfo.height / imgInfo.width).toFixed(2));
          ratios.push(ratio);
        } catch (error) {
          console.error(`获取图片 ${imgUrl} 比例失败:`, error);
          ratios.push(1);
        }
      }
      handlepic(ratios);
    }
  };

  const handleImageClick = async () => {
    setClickCount((prev) => prev + 1);

    if (clickCount === 1) {
      if (clickTimer) {
        clearTimeout(clickTimer);
        setClickTimer(null);
      }
      if (Item.isLike === 'false') {
        try {
          const res = await handleInteraction('like', params);
          if (res.msg === 'success') {
            setLikeNumChange(Item, 1);
          }
        } catch (err) {
          console.log(err);
        }
      }
      setClickCount(0);
    } else {
      const timer = setTimeout(() => {
        setShowpicture(true);
        setClickCount(0);
        setClickTimer(null);
      }, 300);
      setClickTimer(timer);
    }
  };
  useEffect(() => {
    return () => {
      if (clickTimer) {
        clearTimeout(clickTimer);
      }
    };
  }, [clickTimer]);

  useDidShow(async () => {
    try {
      const res = await getCommentsBySubject(Item.id);
      console.log(res);
      if (res.data === null) {
        setResponse([]);
        return;
      }
      setResponse(res.data);
      setLoadComment(true);
    } catch (err) {
      console.log(err);
      setResponse([]);
    }
  });

  useEffect(() => {
    const query = Taro.createSelectorQuery();
    query.select('.postDetail-content').boundingClientRect();
    query.exec((res) => {
      console.log(res[0]);
      setMarginTop(res[0].height + 100);
    });
    loadImageRatios();
  }, [PostIndex]);

  useEffect(() => {
    if (selectCommentPost.length > 0 && loadSelectComment && loadComment) {
      console.log('selectCommentPost', selectCommentPost);
      setTimeout(() => {
        setScrollToCommentId(`comment-${selectCommentPost}`);
      }, 300);
      setTimeout(() => {
        setSelectCommentPost('');
        setScrollToCommentId('');
      }, 2000);
    }
  }, [loadSelectComment, loadComment]);

  const getCommentsAgain = async () => {
    try {
      const res = await getCommentsBySubject(Item.id);
      setResponse(res.data);
    } catch (err) {
      console.log(err);
      setResponse([]);
    }
  };

  const handleLike = async () => {
    if (Item.isLike === 'true') {
      try {
        const res = await handleInteraction('dislike', params);
        if (res.msg === 'success') {
          setLikeNumChange(Item, 0);
        }
      } catch (err) {
        console.log(err);
      }
    } else if (Item.isLike === 'false') {
      try {
        const res = await handleInteraction('like', params);
        console.log(res);
        if (res.msg === 'success') {
          setLikeNumChange(Item, 1);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleCollect = async () => {
    if (Item.isCollect === 'true') {
      try {
        const res = await handleInteraction('discollect', params);
        if (res.msg === 'success') {
          setCollectNumChange(Item, 0);
        }
      } catch (err) {
        console.log(err);
      }
    } else if (Item.isCollect === 'false') {
      try {
        const res = await handleInteraction('collect', params);
        if (res.msg === 'success') {
          setCollectNumChange(Item, 1);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const setBlogComment = async (params: any) => {
    if (params.content === '') {
      Taro.showToast({
        title: '评论不能为空',
        icon: 'none',
        duration: 300,
      });
    } else {
      try {
        console.log(params);
        const res = await createComment(params);
        console.log(res);
        if (res.msg === 'success') {
          setResponse([...response, res.data]);
          setCommentNumChange(Item);
          setInputValue('');
        }
      } catch (error) {
        console.error('创建评论失败:', error);
        Taro.showToast({
          title: '评论发送失败',
          icon: 'none',
          duration: 1000,
        });
      }
    }
  };

  const setBlogReponseContext = async (params: any) => {
    console.log('你干嘛', response);
    if (params.content === '') {
      Taro.showToast({
        title: '评论不能为空',
        icon: 'none',
        duration: 300,
      });
    } else {
      try {
        const res = await replyComment(params);
        console.log(res);
        if (res.msg === 'success') {
          const commentRes = await getCommentsBySubject(Item.id);
          console.log(commentRes);
          if (commentRes.data === null) {
            setResponse([]);
            return;
          }
          setResponse(commentRes.data);
        }
      } catch (error) {
        console.error('回复评论失败:', error);
        Taro.showToast({
          title: '回复评论失败',
          icon: 'none',
          duration: 1000,
        });
      }
    }
  };

  const replyCom = () => {
    setCommentInput(true);
    setReplytype('reply');
  };

  return (
    <>
      <View className="postDetail">
        <NavigationBar url={`/pages/${backPage}/index`} userInfo={Item.userInfo} />
        <ScrollView
          className="postDetail-comment-list"
          scrollY
          scrollIntoView={scrollToCommentId}
          scrollWithAnimation={true}
          style={{ height: `${windowHeight - 60}px` }}
        >
          <View className="postDetail-content">
            {maxheight > 0 && (
              <View className="postDetail-content-avatar" onClick={handleImageClick}>
                <View style={`width: ${windowWidth}px; height: ${windowWidth * maxheight}px`} />
                <Swiper
                  className="postDetail-content-avatar-swiper"
                  indicatorDots={true}
                  circular={false}
                  current={currentIndex}
                  onChange={(e) => setCurrentIndex(e.detail.current)}
                >
                  {Item.showImg.map((item, index) => (
                    <SwiperItem key={index} className="postDetail-content-avatar-swiper-item">
                      <Image
                        src={item}
                        className={`postDetail-content-avatar-swiper-item-${imageRatios[index]}`}
                        mode={imageRatios[index] === 'widthimg' ? 'widthFix' : 'heightFix'}
                      />
                    </SwiperItem>
                  ))}
                </Swiper>
              </View>
            )}
            <View className="postDetail-content-info">
              <View className="postDetail-content-title">{Item.title}</View>
              <View className="postDetail-content-desc">{Item.introduce || ''}</View>
              <View className="postDetail-content-timesite">{formatTime(Item.publishTime)}</View>
            </View>
          </View>
          <View className="postDetail-comment">
            <View className="postDetail-comment-number">共{Item.commentNum}条评论</View>
            <View className="postDetail-comment-input">
              <Image
                className="postDetail-comment-input-avatar"
                mode="scaleToFill"
                src={avatar}
              ></Image>
              <View
                className="postDetail-comment-input-text"
                onClick={() => {
                  setCommentInput(true);
                  setReplytype('create');
                }}
              >
                {inputValue ? inputValue : '让大家听到你的声音'}
              </View>
            </View>

            {response && (
              <CommentList
                comments={response}
                replycomment={replyCom}
                setReplyId={setReplyId}
                longClick={() => setCommentOperation(true)}
                setCommentItems={setCommentItems}
                setCommentCreator={setCommentCreator}
                setCommentid={setCommentid}
                targetCommentBid={selectCommentPost}
              ></CommentList>
            )}
          </View>
        </ScrollView>
        <View className="postDetail-footer">
          <View
            className="postDetail-footer-input"
            onClick={() => {
              setCommentInput(true);
              setReplytype('create');
            }}
          >
            <Image className="postDetail-footer-input-icon" mode="widthFix" src={icon}></Image>
            <View className="postDetail-footer-input-text">
              {inputValue ? inputValue : '说点什么'}
            </View>
          </View>
          <View className="postDetail-footer-desc">
            <View className="actComment-footer-desc-item">
              <Image
                className="postDetail-footer-desc-icon1"
                mode="widthFix"
                src={Item.isLike === 'true' ? favorActive : favor}
                onClick={handleLike}
              ></Image>
              <View className="postDetail-footer-desc-text">{Item.likeNum}</View>
            </View>
            <View className="actComment-footer-desc-item">
              <Image
                className="postDetail-footer-desc-icon2"
                mode="widthFix"
                src={Item.isCollect === 'true' ? collectActive : collect}
                onClick={handleCollect}
              ></Image>
              <View className="postDetail-footer-desc-text">{Item.collectNum}</View>
            </View>
            <View className="actComment-footer-desc-item">
              <Image className="postDetail-footer-desc-icon3" mode="widthFix" src={comment}></Image>
              <View className="postDetail-footer-desc-text">{Item.commentNum}</View>
            </View>
          </View>
        </View>
        {commentInput && (
          <SetBlogComment.Provider
            value={replytype === 'create' ? setBlogComment : setBlogReponseContext}
          >
            <ReplyInput
              isVisible={commentInput}
              setIsVisible={setCommentInput}
              params={replytype === 'create' ? comment_reply_params : reply_params}
              page="post"
              comment={replytype === 'create' ? true : false}
            />
          </SetBlogComment.Provider>
        )}
        {showpicture && imageRatios.length > 0 && (
          <View className="showpicture" onClick={() => setShowpicture(false)}>
            <Swiper
              className="showpicture-swiper"
              indicatorDots={true}
              interval={3000}
              circular={false}
              current={currentIndex}
            >
              {Item.showImg.map((item, index) => (
                <SwiperItem key={index} className={`showpicture-swiper-${ratios[index]}`}>
                  <Image src={item} className="showpicture-swiper-item-img" mode="widthFix" />
                </SwiperItem>
              ))}
            </Swiper>
          </View>
        )}
        {commentOperation && (
          <CommentActionSheet
            visible={commentOperation}
            setVisible={setCommentOperation}
            studentId={studentId}
            commentItems={commentItems}
            commentCreator={commentCreator}
            commentid={commentid}
            getComments={getCommentsAgain}
          />
        )}
      </View>
    </>
  );
};

export default withDoorGuard(Index);
