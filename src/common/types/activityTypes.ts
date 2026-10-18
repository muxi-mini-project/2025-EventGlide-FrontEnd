// 活动相关类型
import { UserInfo } from './UserTypes';
import { Image } from './imageTypes';

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
  showImg: Image[];
  isLike: string;
  isCollect: string;
}

export interface SelectedInfo {
  holderType: string[];
  type: string[];
  detailTime: string;
  position: string[];
  ifRegister: string;
  limit: number;
  page: number;
}

export interface ActivityDetailInfo {
  id: string;
  userInfo: UserInfo;
  title: string;
  detailTime: { startTime: string; endTime: string };
  position: string;
  address: string;
  introduce: string;
  holderType: string;
  organizerUnit: string;
  type: string;
  ifRegister: boolean | string;
  showImg: Image[];
  collectNum: number;
  likeNum: number;
  commentNum: number;
  isLike: string;
  isCollect: string;
  isChecking?: string;
}

export interface LetterType {
  FirstPic?: string;
  Message: string;
  PublishedAt: string;
  status: string;
  TargetId: string;
  RootType?: string;
  RootID?: string;
  Subject: string;
  Userinfo: {
    Avatar: string;
    StudentID: string;
    Username: string;
  };
}
