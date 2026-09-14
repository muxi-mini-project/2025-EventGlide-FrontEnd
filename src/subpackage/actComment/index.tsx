import { View, Image, Swiper, SwiperItem, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { useState, useEffect, createContext, useRef } from 'react';
import './index.scss';
import withDoorGuard from '@/common/hoc';
import { NavigationBar } from '@/common/components/NavigationBar';
import favor from '@/common/svg/post/heart.svg';
import collect from '@/common/svg/post/star.svg';
import comment from '@/common/svg/post/comment.svg';
import icon from '@/common/svg/post/inputIcon.svg';
import collectActive from '@/common/svg/post/starAct.svg';
import favorActive from '@/common/svg/post/heartAct.svg';
import pos from '@/common/svg/activity/pos.svg';
import date from '@/common/svg/activity/date.svg';
import info from '@/common/svg/post/info.svg';
import { CommentResponse } from '@/common/types';
import { getCommentsBySubject, createComment, replyComment } from '@/common/api/Comment';
import useActivityStore from '@/store/ActivityStore';
import { CreatorType } from '@/common/types';
import handleInteraction from '@/common/utils/Interaction';
import ReplyInput from '@/modules/ReplyInput';
import CommentList from '@/modules/Comment';
import CommentActionSheet from '@/modules/CommentActionSheet';
import { holdertype, activeColor } from '@/common/const/Formconst';
import TimeTranslation from '@/common/utils/TimeTranslation';

export const SetReponseContext = createContext<(params: any) => void>(() => { });
export const SetActivityComment = createContext<(params: any) => void>(() => { });

const Index = () => {
  const {
    selectedItem,
    selectComment,
    setSelectComment,
    setSelectedItem,
    setLikeNumChange,
    setCollectNumChange,
    setIsSelect,
  } = useActivityStore();
  const [inputValue, setInputValue] = useState('');
  const [response, setResponse] = useState<CommentResponse[]>([]);
  const [replyId, setReplyId] = useState('');
  const [scrollToCommentId, setScrollToCommentId] = useState<string>('');
  const [loadComment, setLoadComment] = useState(false);
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
  const [descExpanded, setDescExpanded] = useState(false);

  const windowWidth = Taro.getWindowInfo().windowWidth;
  const windowHeight = Taro.getWindowInfo().windowHeight;
  const studentId = Taro.getStorageSync('sid');
  const sysInfo = Taro.getSystemInfoSync();
  const statusBarHeight = sysInfo.statusBarHeight || 0;
  const navBarHeight = 44;
  const footerHeight = 120;
  const swiperHeight = Math.floor((windowHeight - statusBarHeight - navBarHeight) * 0.5);

  const params = { studentId, subject: 'activity', targetId: selectedItem.id };
  const reply_params = { parentId: replyId, subject: 'comment' };
  const comment_params = { parentId: selectedItem.id, subject: 'activity' };

  const handlepic = (pictures) => {
    let windowRatio = Number((windowHeight / windowWidth).toFixed(2));
    const res = Array(pictures.length).fill('widthimg');
    for (let i = 0; i < pictures.length; i++) {
      if (pictures[i] > windowRatio) res[i] = 'heigthimg';
    }
    setRatios(res);
  };

  const loadImageRatios = async () => {
    if (selectedItem && selectedItem.showImg) {
      const ratios: number[] = [];
      for (const imgUrl of selectedItem.showImg) {
        try {
          const imgInfo = await Taro.getImageInfo({ src: imgUrl });
          ratios.push(Number((imgInfo.height / imgInfo.width).toFixed(2)));
        } catch (error) {
          ratios.push(1);
        }
      }
      handlepic(ratios);
    }
  };

  const handleImageClick = async () => {
    setClickCount((prev) => prev + 1);
    if (clickCount === 1) {
      if (clickTimer) { clearTimeout(clickTimer); setClickTimer(null); }
      if (selectedItem.isLike === 'false') {
        try {
          const res = await handleInteraction('like', params);
          if (res.msg === 'success') {
            setLikeNumChange(selectedItem.id, 'add');
            setSelectedItem({ ...selectedItem, isLike: 'true', likeNum: selectedItem.likeNum + 1 });
          }
        } catch (err) { console.log(err); }
      }
      setClickCount(0);
    } else {
      const timer = setTimeout(() => { setShowpicture(true); setClickCount(0); setClickTimer(null); }, 300);
      setClickTimer(timer);
    }
  };

  useEffect(() => () => { if (clickTimer) clearTimeout(clickTimer); }, [clickTimer]);
  useDidShow(() => setIsSelect(false));

  const sortComments = (list: CommentResponse[]) =>
    [...list].sort((a, b) => new Date(b.commentedTime).getTime() - new Date(a.commentedTime).getTime());

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await getCommentsBySubject(selectedItem.id);
        setResponse(res.data === null ? [] : sortComments(res.data));
      } catch (error) { setResponse([]); }
    };
    loadImageRatios();
    fetchComments();
    setLoadComment(true);
  }, []);

  useEffect(() => {
    if (selectComment.length > 0 && loadComment) {
      setTimeout(() => setScrollToCommentId(`comment-${selectComment}`), 300);
      setTimeout(() => { setSelectComment(''); setScrollToCommentId(''); }, 2000);
    }
  }, [loadComment]);

  const getCommentsAgain = async () => {
    try {
      const res = await getCommentsBySubject(selectedItem.id);
      setResponse(res.data === null ? [] : sortComments(res.data));
    } catch (error) { setResponse([]); }
  };

  const setReponseContext = async (params: any) => {
    if (params.content === '') {
      Taro.showToast({ title: '评论不能为空', icon: 'none', duration: 300 });
    } else {
      try {
        const res = await replyComment(params);
        if (res.msg === 'success') {
          const commentRes = await getCommentsBySubject(selectedItem.id);
          setResponse(commentRes.data === null ? [] : sortComments(commentRes.data));
        }
      } catch (error) { Taro.showToast({ title: '回复评论失败', icon: 'none', duration: 1000 }); }
    }
  };

  const handleLike = async () => {
    if (selectedItem.isLike === 'true') {
      try {
        const res = await handleInteraction('dislike', params);
        if (res.msg === 'success') {
          setLikeNumChange(selectedItem.id, 'reduce');
          setSelectedItem({ ...selectedItem, isLike: 'false', likeNum: selectedItem.likeNum - 1 });
        }
      } catch (err) { console.log(err); }
    } else if (selectedItem.isLike === 'false') {
      try {
        const res = await handleInteraction('like', params);
        if (res.msg === 'success') {
          setLikeNumChange(selectedItem.id, 'add');
          setSelectedItem({ ...selectedItem, isLike: 'true', likeNum: selectedItem.likeNum + 1 });
        }
      } catch (err) { console.log(err); }
    }
  };

  const handleCollect = async () => {
    if (selectedItem.isCollect === 'true') {
      try {
        const res = await handleInteraction('discollect', params);
        if (res.msg === 'success') {
          setCollectNumChange(selectedItem.id, 'reduce');
          setSelectedItem({ ...selectedItem, isCollect: 'false', collectNum: selectedItem.collectNum - 1 });
        }
      } catch (err) { console.log(err); }
    } else if (selectedItem.isCollect === 'false') {
      try {
        const res = await handleInteraction('collect', params);
        if (res.msg === 'success') {
          setCollectNumChange(selectedItem.id, 'add');
          setSelectedItem({ ...selectedItem, isCollect: 'true', collectNum: selectedItem.collectNum + 1 });
        }
      } catch (err) { console.log(err); }
    }
  };

  const setActivityComment = async (params: any) => {
    if (params.content === '') {
      Taro.showToast({ title: '评论不能为空', icon: 'none', duration: 300 });
    } else {
      try {
        const res = await createComment(params);
        if (res.msg === 'success') {
          setResponse([...response, res.data]);
          setSelectedItem({ ...selectedItem, commentNum: selectedItem.commentNum + 1 });
          setInputValue('');
        }
      } catch (error) { Taro.showToast({ title: '评论发送失败', icon: 'none', duration: 1000 }); }
    }
  };

  const replyCom = () => { setCommentInput(true); setReplytype('reply'); };

  const showImgList = selectedItem.showImg || [];
  const descText = selectedItem.introduce || '暂无介绍';

  return (
    <>
      <View className="actComment">
        <NavigationBar url="/pages/indexHome/index" userInfo={selectedItem.userInfo} />

        {/* 全部内容统一滚动 */}
        <ScrollView
          className="act-scroll-area"
          scrollY
          showScrollbar={false}
          scrollIntoView={scrollToCommentId}
          scrollWithAnimation
        >
          {/* 顶部图片轮播 */}
          <View className="post-top" style={{ height: `${swiperHeight}px` }}>
            {showImgList.length > 0 ? (
              <Swiper
                className="act-swiper"
                indicatorDots={showImgList.length > 1}
                indicatorColor="rgba(255,255,255,0.4)"
                indicatorActiveColor="#fff"
                circular
                autoplay
                interval={3000}
                style={{ height: `${swiperHeight}px` }}
              >
                {showImgList.map((item, index) => (
                  <SwiperItem key={index}>
                    <Image
                      className="act-swiper-img"
                      src={item}
                      mode="aspectFill"
                      onClick={() => { setCurrentIndex(index); setShowpicture(true); }}
                    />
                  </SwiperItem>
                ))}
              </Swiper>
            ) : (
              <View className="act-swiper-empty">暂无图片</View>
            )}
          </View>

          <View className="act-info">
            <View className="act-title">{selectedItem.title}</View>
            <View className="act-divider" />

            <View className="act-desc-wrapper">
              <View className={`act-desc ${descExpanded ? 'act-desc--expanded' : ''}`}>
                {descText}
              </View>
              <View className="act-desc-toggle" onClick={() => setDescExpanded(!descExpanded)}>
                {descExpanded ? '收起' : '展开'}
              </View>
            </View>

            {descExpanded && (
              <View className="act-detail">
                <View className="act-detail-item">
                  <Image className="act-detail-icon" mode="widthFix" src={info} />
                  <View className="act-detail-text">
                    {holdertype.get(selectedItem.holderType || '') || selectedItem.holderType || '暂无信息'}
                  </View>
                </View>
                <View className="act-detail-item">
                  <Image className="act-detail-icon" mode="widthFix" src={date} />
                  <View className="act-detail-text">
                    {selectedItem.detailTime?.startTime ? TimeTranslation(selectedItem.detailTime.startTime) : '暂无信息'}
                    {selectedItem.detailTime?.endTime ? ` - ${TimeTranslation(selectedItem.detailTime.endTime)}` : ''}
                  </View>
                </View>
                <View className="act-detail-item">
                  <Image className="act-detail-icon" mode="widthFix" src={pos} />
                  <View className="act-detail-text">{selectedItem.position || '暂无信息'}</View>
                </View>
              </View>
            )}

            {!descExpanded && (
              <View className="act-tags">
                <View className="act-tag act-tag--holder">
                  {holdertype.get(selectedItem.holderType || '') || selectedItem.holderType || ''}
                </View>
                <View
                  className="act-tag act-tag--type"
                  style={activeColor.get(selectedItem.type || '') ? `background-color: ${activeColor.get(selectedItem.type || '')}` : 'background-color: #bd96ee'}
                >
                  {selectedItem.type || ''}
                </View>
              </View>
            )}
          </View>

          <View className="act-divider" />

          <View className="actComment-container">
            <CommentList
              comments={response}
              replycomment={replyCom}
              setReplyId={setReplyId}
              longClick={() => setCommentOperation(true)}
              setCommentItems={setCommentItems}
              setCommentCreator={setCommentCreator}
              setCommentid={setCommentid}
              targetCommentBid={selectComment}
            />
          </View>
        </ScrollView>

        {/* 底部操作栏 */}
        <View className="actComment-footer">
          <View className="actComment-footer-input" onClick={() => setCommentInput(true)}>
            <Image className="actComment-footer-input-icon" mode="widthFix" src={icon}></Image>
            <View className="actComment-footer-input-text">{inputValue ? inputValue : '说点什么'}</View>
          </View>
          <View className="actComment-footer-desc">
            <View className="actComment-footer-desc-item">
              <Image className="actComment-footer-desc-icon1" mode="widthFix" src={selectedItem.isLike === 'true' ? favorActive : favor} onClick={handleLike}></Image>
              <View className="actComment-footer-desc-text">{selectedItem.likeNum}</View>
            </View>
            <View className="actComment-footer-desc-item">
              <Image className="actComment-footer-desc-icon2" mode="widthFix" src={selectedItem.isCollect === 'true' ? collectActive : collect} onClick={handleCollect}></Image>
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
        <SetReponseContext.Provider value={replytype === 'create' ? setActivityComment : setReponseContext}>
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
          <Swiper className="showpicture-swiper" indicatorDots={true} interval={3000} circular={false} current={currentIndex}>
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
          getComments={getCommentsAgain}
        />
      )}
    </>
  );
};

export default withDoorGuard(Index);
