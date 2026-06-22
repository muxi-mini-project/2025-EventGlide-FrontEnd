import { UserInfo } from './UserTypes';
// 帖子相关类型
export type PostList = {
  imgUrl: string;
  title: string;
  content: string;
};

export interface PostDetailInfo {
  id: string;
  collectNum: number;
  commentNum: number;
  introduce: string;
  likeNum: number;
  isLike: string;
  isCollect: string;
  showImg: string[];
  title: string;
  publishTime: string;
  userInfo: UserInfo;
}

export interface PostCommentProp {
  username: string;
  desc: string;
  time: string;
  site: string;
}

export interface CreatorType {
  username: string;
  avatar: string;
  studentId: string;
}

export interface ReplyType {
  bid: string;
  replyContent: string;
  parentUserName: string;
  replyCreator: {
    avatar: string;
    studentId: string;
    username: string;
  };
  replyPos: string;
  replyTime: string;
}

export interface ResponseType {
  bid: string;
  commentedPos: string;
  commentedTime: string;
  content: string;
  creator: CreatorType;
  isLike: string;
  likeNum: number;
  replyNum: number;
  reply: ReplyType[];
}

export interface PostCommentProps extends PostCommentProp {
  res: PostCommentProp[];
}
