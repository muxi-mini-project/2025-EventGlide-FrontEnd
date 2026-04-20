// 活动相关类型
import { UserInfo } from './UserTypes';

export type ActiveList = {
  date: string;
  position: string;
};

export interface MyActivityList {
  avatar: string;
  title: string;
  name: string;
  likes: number;
  collectNum: number;
  comment: number;
  introduce: string;
  showImg: string[];
  isLike: string;
  isCollect: string;
}

export interface SelectedInfo {
  holderType: string[];
  type: string[];
  detailTime: { startTime: string; endTime: string };
  position: string[];
  ifRegister: string;
}

export interface ActivityDetailInfo {
  bid: string;
  userInfo: UserInfo;
  title: string;
  detailTime: { startTime: string; endTime: string };
  position: string;
  introduce: string;
  holderType: string;
  type: string;
  ifRegister: boolean;
  showImg: string[];
  collectNum: number;
  likeNum: number;
  commentNum: number;
  isLike: string;
  isCollect: string;
  isChecking?: string;
}

export interface LetterType {
  firstPic?: string;
  message: string;
  publishedAt: string;
  status: string;
  targetBid: string;
  userInfo: {
    avatar: string;
    studentId: string;
    username: string;
  };
}
