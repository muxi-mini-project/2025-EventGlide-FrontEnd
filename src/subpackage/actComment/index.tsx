import { View, Image, Span, Swiper, SwiperItem } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { useState, useEffect, createContext, useRef } from 'react';
import './index.scss';
import { NavigationBar } from '@/common/components/NavigationBar';
import favor from '@/common/svg/post/heart.svg';
import collect from '@/common/svg/post/star.svg';
import comment from '@/common/svg/post/comment.svg';
import icon from '@/common/svg/post/inputIcon.svg';
import collectActive from '@/common/svg/post/starAct.svg';
import favorActive from '@/common/svg/post/heartAct.svg';
import { CommentResponse } from '@/common/types';
import { getCommentsBySubject, createComment, replyComment } from '@/common/api/Comment';
import useActivityStore from '@/store/ActivityStore';
import { CreatorType } from '@/common/types';
import handleInteraction from '@/common/utils/Interaction';
import ReplyInput from '@/modules/ReplyInput';
import { ScrollView } from '@tarojs/components';
import CommentList from '@/modules/Comment';
import CommentActionSheet from '@/modules/CommentActionSheet';

export const SetReponseContext = createContext<(params: any) => void>(() => {});
export const SetActivityComment = createContext<(params: any) => void>(() => {});

const Index = () => {
  const { selectedItem, setSelectedItem, setLikeNumChange, setCollectNumChange, setIsSelect } =
    useActivityStore();
  const [inputValue, setInputValue] = useState('');
  const [response, setResponse] = useState<CommentResponse[]>([]);
  const [replyId, setReplyId] = useState('');
  const [commentInput, setCommentInput] = useState(false);
  const [replytype, setReplytype] = useState('create');
  const [showpicture, setShowpicture] = useState(false);
  const [ratios, setRatios] = useState<string[]>([]);
  const [clickCount, setClickCount] = useState(0);
  const [clickTimer, setClickTimer] = useState<NodeJS.Timeout | null>(null);
  const [commentOperation, setCommentOperation] = useState(false);
  const [commentItems, setCommentItems] = useState('');
  const [commentCreator, setCommentCreator] = useState<CreatorType>();
  const [commentid, setCommentid] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const windowWidth = Taro.getWindowInfo().windowWidth;
  const windowHeight = Taro.getWindowInfo().windowHeight;
  const studentId = Taro.getStorageSync('sid');
  const params = {
    studentId: studentId,
    subject: 'activity',
    targetId: selectedItem.bid,
    receiver: selectedItem.userInfo.studentId,
  };

  console.log(selectedItem);

  const scrollViewRef = useRef<any>(null);

  const reply_params = {
    parentId: replyId,
    subject: 'comment',
  };
  const comment_params = {
    parentId: selectedItem.bid,
    subject: 'activity',
    receiver: selectedItem.userInfo.studentId,
  };

  const handlepic = (pictures) => {
    let windowRatio = Number((windowHeight / windowWidth).toFixed(2));
    const res = Array(pictures.length).fill('widthimg');
    for (let i = 0; i < pictures.length; i++) {
      if (pictures[i] > windowRatio) {
        res[i] = 'heigthimg';
      }
    }
    setRatios(res);
  };

  const loadImageRatios = async () => {
    if (selectedItem && selectedItem.showImg) {
      const ratios: number[] = [];

      for (const imgUrl of selectedItem.showImg) {
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
      if (selectedItem.isLike === 'false') {
        try {
          const res = await handleInteraction('like', params);
          if (res.msg === 'success') {
            setLikeNumChange(selectedItem.bid, 'add');
            setSelectedItem({
              ...selectedItem,
              isLike: 'true',
              likeNum: selectedItem.likeNum + 1,
            });
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

  useDidShow(() => {
    setIsSelect(false);
  });

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await getCommentsBySubject(selectedItem.bid);
        if (res.data === null) {
          setResponse([]);
          return;
        }
        console.log(res.data);
        setResponse(res.data);
      } catch (error) {
        console.error('获取评论失败:', error);
        setResponse([]);
      }
    };

    fetchComments();
    loadImageRatios();
  }, []);

  const setReponseContext = async (params: any) => {
    if (params.content === '') {
      Taro.showToast({
        title: '评论不能为空',
        icon: 'none',
        duration: 300,
      });
    } else {
      try {
        const res = await replyComment(params);
        if (res.msg === 'success') {
          const commentRes = await getCommentsBySubject(selectedItem.bid);
          if (commentRes.data === null) {
            setResponse([]);
            return;
          }
          console.log(commentRes.data);
          setResponse(commentRes.data);
        }
      } catch (error) {
        console.log(error);
        Taro.showToast({
          title: '回复评论失败',
          icon: 'none',
          duration: 1000,
        });
      }
    }
  };

  const handleLike = async () => {
    if (selectedItem.isLike === 'true') {
      try {
        const res = await handleInteraction('dislike', params);
        if (res.msg === 'success') {
          setLikeNumChange(selectedItem.bid, 'reduce');
          setSelectedItem({
            ...selectedItem,
            isLike: 'false',
            likeNum: selectedItem.likeNum - 1,
          });
        }
      } catch (err) {
        console.log(err);
      }
    } else if (selectedItem.isLike === 'false') {
      try {
        const res = await handleInteraction('like', params);
        if (res.msg === 'success') {
          setLikeNumChange(selectedItem.bid, 'add');
          setSelectedItem({
            ...selectedItem,
            isLike: 'true',
            likeNum: selectedItem.likeNum + 1,
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleCollect = async () => {
    if (selectedItem.isCollect === 'true') {
      try {
        const res = await handleInteraction('discollect', params);
        if (res.msg === 'success') {
          setCollectNumChange(selectedItem.bid, 'reduce');
          setSelectedItem({
            ...selectedItem,
            isCollect: 'false',
            collectNum: selectedItem.collectNum - 1,
          });
        }
      } catch (err) {
        console.log(err);
      }
    } else if (selectedItem.isCollect === 'false') {
      try {
        const res = await handleInteraction('collect', params);
        if (res.msg === 'success') {
          setCollectNumChange(selectedItem.bid, 'add');
          setSelectedItem({
            ...selectedItem,
            isCollect: 'true',
            collectNum: selectedItem.collectNum + 1,
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const setActivityComment = async (params: any) => {
    if (params.content === '') {
      Taro.showToast({
        title: '评论不能为空',
        icon: 'none',
        duration: 300,
      });
    } else {
      try {
        const res = await createComment(params);
        console.log(res, params);
        if (res.msg === 'success') {
          setResponse([...response, res.data]);
          setSelectedItem({
            ...selectedItem,
            commentNum: selectedItem.commentNum + 1,
          });
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
  const replyCom = () => {
    setCommentInput(true);
    setReplytype('reply');
  };
  const [sheetTop, setSheetTop] = useState(0);

  const startYRef = useRef(0);
  const startTopRef = useRef(0);

  const minTopRef = useRef(0);
  const maxTopRef = useRef(0);

  useEffect(() => {
    const query = Taro.createSelectorQuery();

    query
      .select('.post-top')
      .boundingClientRect()
      .select('.post-content')
      .boundingClientRect()
      .exec((res) => {
        const topRect = res[0];
        const contentRect = res[1];
        if (!topRect || !contentRect) return;

        const snapTop = topRect.bottom;

        minTopRef.current = snapTop;
        maxTopRef.current = contentRect.bottom;

        setSheetTop(maxTopRef.current);
      });
  }, []);

  const onDragStart = (e) => {
    startYRef.current = e.touches[0].clientY;
    startTopRef.current = sheetTop;
  };

  const onDragMove = (e) => {
    const deltaY = e.touches[0].clientY - startYRef.current;
    let nextTop = startTopRef.current + deltaY;

    if (nextTop < minTopRef.current) nextTop = minTopRef.current;
    if (nextTop > maxTopRef.current) nextTop = maxTopRef.current;

    setSheetTop(nextTop);
  };

  const onDragEnd = () => {
    const middle = (minTopRef.current + maxTopRef.current) / 2;

    setSheetTop(sheetTop < middle ? minTopRef.current : maxTopRef.current);
  };

  return (
    <>
      <View className="actComment">
        <NavigationBar url="/pages/indexHome/index" userInfo={selectedItem.userInfo} />
        <View className="post-top" style={{ height: '160rpx' }} />
        <View className="post-content">
          <View style={{ padding: 5, marginLeft: '40rpx', marginRight: '40rpx' }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 10 }}>
              <View style={{ fontSize: 20, fontWeight: 400, color: '#170A1E' }}>
                {selectedItem.title}
              </View>
              <View style={{ fontSize: 16, fontWeight: 400, color: '#5E5064' }}>
                {selectedItem.introduce}
              </View>
            </View>
            <View
              style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 10 }}
              onClick={() => {
                handleImageClick();
              }}
            >
              {(selectedItem.showImg || []).map((item, index) => (
                <Image
                  onClick={() => {
                    setCurrentIndex(index);
                    handleImageClick();
                  }}
                  key={index}
                  src={item}
                  mode="aspectFill"
                  style={{
                    width: '200rpx',
                    height: '200rpx',
                    marginRight: '10rpx',
                    marginBottom: '10rpx',
                    borderRadius: 10,
                  }}
                />
              ))}
            </View>
          </View>
        </View>

        <View
          className="sheet-wrapper"
          style={{
            transform: `translateY(${sheetTop}px)`,
            height: `calc(100vh - ${sheetTop}px)`,
          }}
        >
          <View
            className="drag-handle"
            onTouchStart={onDragStart}
            onTouchMove={onDragMove}
            onTouchEnd={onDragEnd}
          >
            <View className="drag-handle-bar" />
            <View style={{ width: '100%', marginTop: '10rpx' }}>
              <Span style={{ fontSize: 14, marginLeft: '50rpx', color: '#5E5064' }}>
                回复 {selectedItem.commentNum}
              </Span>
              <Span style={{ margin: '20rpx', color: '#5E5064' }}>点赞 {selectedItem.likeNum}</Span>
              <Span style={{ margin: '30rpx', color: '#5E5064' }}>
                收藏 {selectedItem.collectNum}
              </Span>
            </View>
          </View>

          <View className="comment-panel">
            <ScrollView scrollY style={{ height: '100%' }} showScrollbar={false}>
              <View className="actComment-container">
                <CommentList
                  comments={response}
                  replycomment={replyCom}
                  setReplyId={setReplyId}
                  longClick={() => setCommentOperation(true)}
                  setCommentItems={setCommentItems}
                  setCommentCreator={setCommentCreator}
                  setCommentid={setCommentid}
                />
              </View>
            </ScrollView>
          </View>
        </View>

        <View className="actComment-footer">
          <View className="actComment-footer-input" onClick={() => setCommentInput(true)}>
            <Image className="actComment-footer-input-icon" mode="widthFix" src={icon}></Image>
            <View className="actComment-footer-input-text">
              {inputValue ? inputValue : '说点什么'}
            </View>
          </View>
          <View className="actComment-footer-desc">
            <View className="actComment-footer-desc-item">
              <Image
                className="actComment-footer-desc-icon1"
                mode="widthFix"
                src={selectedItem.isLike === 'true' ? favorActive : favor}
                onClick={handleLike}
              ></Image>
              <View className="actComment-footer-desc-text">{selectedItem.likeNum}</View>
            </View>
            <View className="actComment-footer-desc-item">
              <Image
                className="actComment-footer-desc-icon2"
                mode="widthFix"
                src={selectedItem.isCollect === 'true' ? collectActive : collect}
                onClick={handleCollect}
              ></Image>
              <View className="actComment-footer-desc-text">{selectedItem.collectNum}</View>
            </View>
            <View className="actComment-footer-desc-item">
              <Image className="actComment-footer-desc-icon3" mode="widthFix" src={comment}></Image>
              <View className="actComment-footer-desc-text">{selectedItem.commentNum}</View>
            </View>
          </View>
        </View>
      </View>
      {commentInput && (
        <SetReponseContext.Provider
          value={replytype === 'create' ? setActivityComment : setReponseContext}
        >
          <ReplyInput
            isVisible={commentInput}
            setIsVisible={setCommentInput}
            params={replytype === 'create' ? comment_params : reply_params}
            page="activity"
            comment={replytype === 'create' ? true : false}
          />
        </SetReponseContext.Provider>
      )}
      {showpicture && ratios.length > 0 && (
        <View className="showpicture" onClick={() => setShowpicture(false)}>
          <Swiper
            className="showpicture-swiper"
            indicatorDots={true}
            interval={3000}
            circular={false}
            current={currentIndex}
          >
            {selectedItem.showImg.map((item, index) => (
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
        />
      )}
    </>
  );
};

export default Index;
