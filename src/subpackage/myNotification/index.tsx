import { View, Image } from '@tarojs/components';
import { memo, useState } from 'react';
import './index.scss';
import withDoorGuard from '@/common/hoc';
import { GetNotificationListReponse, LetterType } from '@/common/types';
import classnames from 'classnames';
import { get } from '@/common/api/request';
import Taro, { useDidShow, navigateTo } from '@tarojs/taro';
import NoticePageNull from '@/modules/EmptyComponent/components/noticepagenull';
import formatTime from '@/common/utils/FormatTime';
import { NavigationBarBack } from '@/common/components/NavigationBar';
import useActivityStore from '@/store/ActivityStore';
import usePostStore from '@/store/PostStore';
import { getPostById } from '@/common/api/PostRequest';
import { getActivityById } from '@/common/api/Activity';
import handleInteraction from '@/common/utils/Interaction';
import ConfirmModal from '@/modules/ConfirmModal';
import Message from '@/common/components/Message';

const LetterListItem: React.FC<LetterType> = memo(({ ...props }) => {
  const { setSelectedItem, setSelectComment } = useActivityStore();
  const { setSelectPostList, setPostIndex, setSelectCommentPost } = usePostStore();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleItemClick = (item: LetterType) => {
    if (item.status === 'pending') {
      setShowConfirmModal(true);
    }
  };

  const handleClick = async (props: LetterType) => {
    console.log(props);
    if (props.status === 'pending') {
      handleItemClick(props);
    } else {
      try {
        if (props.Subject === 'activity') {
          const res = await getActivityById(props.TargetId);
          console.log(res);
          setSelectedItem(res.data);
          navigateTo({ url: '/subpackage/actComment/index' });
        } else if (props.Subject === 'post') {
          const res = await getPostById(props.TargetId);
          console.log(res);
          const post = [] as any[];
          post.push(res.data);
          setSelectPostList(post);
          setPostIndex(res.data.id);
          navigateTo({ url: '/subpackage/postDetail/index' });
        } else if (props.Subject === 'comment' && props.RootID) {
          if (props.RootType === 'activity') {
            const res = await getActivityById(props.RootID);
            console.log(res);
            setSelectComment(props.TargetId);
            setSelectedItem(res.data);
            navigateTo({ url: '/subpackage/actComment/index' });
          } else if (props.RootType === 'post') {
            const res = await getPostById(props.RootID);
            console.log(res);
            setSelectCommentPost(props.TargetId);
            const post = [] as any[];
            post.push(res.data);
            setSelectPostList(post);
            setPostIndex(res.data.id);
            navigateTo({ url: '/subpackage/postDetail/index' });
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  const approveInvitation = async (props: LetterType) => {
    console.log(props);
    try {
      const res = await handleInteraction('approve', {
        subject: props.Subject,
        targetId: props.TargetId,
      });
      console.log(res);
      if (res.code === 200) {
        Message.success('同意成功');
      }
    } catch (error) {
      console.log(error);
    }
  };
  const rejectInvitation = async (props: LetterType) => {
    console.log(props);
    try {
      const res = await handleInteraction('reject', {
        subject: props.Subject,
        targetId: props.TargetId,
      });
      console.log(res);
      if (res.code === 200) {
        Message.success('拒绝成功');
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <View className="letter-list-item" onClick={() => handleItemClick(props)}>
        <Image
          src={props.Userinfo.Avatar}
          mode="aspectFill"
          className="letter-list-item-avatar"
          lazyLoad={true}
          onClick={(event) => {
            event.stopPropagation();
            Taro.setStorageSync('targetUser', props.Userinfo.StudentID);
            navigateTo({ url: '/subpackage/otherUser/index' });
          }}
        ></Image>
        <View className="letter-list-item-content">
          <View className="letter-list-item-content-username">{props.Userinfo.Username}</View>
          <View className="letter-list-item-content-message">{props.Message}</View>
          <View className="letter-list-item-content-message">{formatTime(props.PublishedAt)}</View>
        </View>
        <Image
          mode="aspectFill"
          src={props.FirstPic || props.Userinfo.Avatar}
          className="letter-list-item-decPic"
          onClick={(event) => {
            event.stopPropagation();
            handleClick(props);
          }}
        ></Image>
      </View>
      <ConfirmModal
        title="是否同意该邀请？"
        visible={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => approveInvitation(props)}
        onReject={() => rejectInvitation(props)}
        headerClassName="textmid"
      />
    </>
  );
});

const Index = () => {
  const [isActive, setIsActive] = useState(true);
  const handleClick = (type: 'favor' | 'letter') => {
    setIsActive(!isActive);
    setShowPage(type);
  };
  const [showPage, setShowPage] = useState<'favor' | 'letter'>('favor');
  const [favor, setFavor] = useState<LetterType[]>([]);
  const [letter, setLetter] = useState<LetterType[]>([]);
  const [notice, setNotice] = useState(false);

  useDidShow(async () => {
    try {
      const res: any = await get<GetNotificationListReponse>('/feed/list');
      console.log('通知列表', res.data);
      const invitations: any = await get<GetNotificationListReponse>('/feed/auditor');
      console.log('邀请列表', invitations.data);
      const invitationsList = invitations.data?.Invitations || [];
      const likes = res.data?.Likes || [];
      const collects = res.data.Collects || [];
      const mergedFavor = mergeSortedArrays(likes, collects);
      const favorWithInvitations = mergeSortedArrays(mergedFavor, invitationsList);
      console.log('合并后的通知列表', favorWithInvitations);
      setFavor(favorWithInvitations);
      readnotice(mergedFavor);

      const comments = res.data?.Comments || [];
      const ats = res.data.Ats || [];
      const mergedLetter = mergeSortedArrays(comments, ats);
      setLetter(mergedLetter);
      if (mergedLetter[0] && mergedLetter[0].status === '未读') {
        setNotice(true);
      }
    } catch (err) {
      console.log(err);
    }
  });

  const mergeSortedArrays = (arr1: LetterType[], arr2: LetterType[]) => {
    const result: LetterType[] = [];
    let i = 0;
    let j = 0;

    while (i < arr1.length && j < arr2.length) {
      const date1 = parseDateSafely(arr1[i].PublishedAt);
      const date2 = parseDateSafely(arr2[j].PublishedAt);

      if (date1 <= date2) {
        result.push(arr1[i]);
        i++;
      } else {
        result.push(arr2[j]);
        j++;
      }
    }
    const mergedResult = result.concat(arr1.slice(i), arr2.slice(j));
    return mergedResult.reverse();
  };

  const parseDateSafely = (dateString: string): number => {
    if (!dateString || typeof dateString !== 'string') {
      return 0;
    }

    if (dateString.includes(' ') && dateString.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/)) {
      const safeDateString = dateString.replace(' ', 'T');
      return new Date(safeDateString).getTime();
    }
    return new Date(dateString).getTime();
  };

  const readnotice = async (notices: string | any[]) => {
    for (let i = 0; i < notices.length; i++) {
      if (notices[i].status === '未读') {
        try {
          const res = await get<GetNotificationListReponse>(`/feed/read/detail/${notices[i].id}`);
          console.log(res.data);
        } catch (error) {
          console.error('更新通知状态失败:', error);
        }
      } else {
        break;
      }
    }
  };

  return (
    <>
      <NavigationBarBack backgroundColor="#FFFFFF" title="账号设置" url="/pages/postHome/index" />
      <View className="myNotification-page">
        <View className="myNotification-page-header">
          <View
            onClick={() => handleClick('favor')}
            className={classnames('myNotification-page-header-item', {
              activeItem: isActive,
            })}
          >
            赞和收藏
          </View>
          <View
            onClick={() => {
              handleClick('letter');
              setNotice(false);
              readnotice(letter);
            }}
            className={classnames('myNotification-page-header-item', {
              activeItem: !isActive,
            })}
          >
            <View>评论和@</View>
            <View
              style={{
                display: notice ? 'block' : 'none',
                position: 'absolute',
                width: '10rpx',
                height: '10rpx',
                borderRadius: '5rpx',
                backgroundColor: '#FF4D4F',
                right: 0,
                top: 0,
                marginRight: '90rpx',
                marginTop: '40rpx',
              }}
            />
          </View>
        </View>
        <View className="myNotification-page-content">
          {(showPage === 'favor' && favor.length === 0) ||
          (showPage === 'letter' && letter.length === 0) ? (
            <NoticePageNull key="notice-null" />
          ) : null}
          {showPage === 'favor' &&
            favor.length > 0 &&
            favor.map((item, index) => <LetterListItem key={index} {...item} />)}
          {showPage === 'letter' &&
            letter.length > 0 &&
            letter.map((item, index) => <LetterListItem key={index} {...item} />)}
        </View>
      </View>
    </>
  );
};

export default withDoorGuard(Index);
