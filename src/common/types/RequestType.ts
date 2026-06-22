import { ActivityDetailInfo, SelectedInfo } from './ActivityTypes';
import { PostDetailInfo } from './PostTypes';
import { LabelForm } from './FormTypes';
import { ResponseType } from './CommentTypes';

/** 登录相关请求/响应接口类型 */
export interface LoginRequest {
  studentId: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  avatar: string;
  username: string;
  school: string;
  studentId: string;
  token: string;
}

export interface CheckLoginResponse {
  id: number;
  avatar: string;
  name: string;
  school: string;
  studentId: string;
  token: string;
}

/** 活动相关请求/响应接口类型 */
export interface GetActivityResponse extends ActivityDetailInfo {}
export interface GetActivityResponsePage {
  limit: number;
  page: number;
  total: number;
  details: ActivityDetailInfo[];
}

export interface FilteAcitivityRequest extends SelectedInfo {}

export interface CreateActivityRequest {
  title: string;
  introduce: string;
  showImg: string[];
  labelform: LabelForm;
}

export interface GetActivityDrafytResponse {
  activeForm?: string;
  bid?: string;
  createdAt?: string;
  endTime?: string;
  holderType?: string;
  ifRegister?: string;
  introduce?: string;
  position?: string;
  registerMethod?: string;
  showImg?: string;
  signer?: string;
  startTime?: string;
  studentId?: string;
  title?: string;
  type?: string;
}

/** 帖子相关请求/接口类型 */
export interface CreatePostRequest {
  title: string;
  introduce: string;
  showImg: string[];
  studentId?: string;
}

export interface GetPostReponse extends PostDetailInfo {}
export interface GetPostReponsePage {
  limit: number;
  page: number;
  total: number;
  details: PostDetailInfo[];
}

export interface GetPostDraftResonse {
  bid: string;
  title: string;
  showImg: string[];
  introduce: string;
  createAt: string;
  studentId: string;
}

/** 草稿相关请求 */
export interface SaveDraftRequest {
  title: string;
  introduce: string;
  showImg: string[];
  labelform?: LabelForm;
  studentId?: string;
  [key: string]: any;
}

/** 用户消息相关请求/响应接口类型 */
export interface GetNotificationCountResponse {
  commentAndAt: number;
  likeAndCollect: number;
  total: number;
  [property: string]: any;
}

export interface GetNotificationListReponse {
  ats?: RespFeedAtResp[];
  collects?: RespFeedCollectResp[];
  comments?: RespFeedCommentResp[];
  invitations?: RespFeedInvitationResp[];
  likes?: RespFeedLikeResp[];
  [property: string]: any;
}

/**
 * resp.FeedAtResp
 */
export interface RespFeedAtResp {
  firstPic?: string;
  id?: number;
  message?: string;
  publishedAt?: string;
  status?: string;
  targetBid?: string;
  userInfo?: RespUserInfo;
  [property: string]: any;
}

/**
 * resp.UserInfo
 */
export interface RespUserInfo {
  avatar?: string;
  studentId?: string;
  username?: string;
  [property: string]: any;
}

/**
 * resp.FeedCollectResp
 */
export interface RespFeedCollectResp {
  firstPic?: string;
  id?: number;
  message?: string;
  publishedAt?: string;
  status?: string;
  targetBid?: string;
  userInfo?: RespUserInfo;
  [property: string]: any;
}

/**
 * resp.FeedCommentResp
 */
export interface RespFeedCommentResp {
  firstPic?: string;
  id?: number;
  message?: string;
  publishedAt?: string;
  status?: string;
  targetBid?: string;
  userInfo?: RespUserInfo;
  [property: string]: any;
}

/**
 * resp.FeedInvitationResp
 */
export interface RespFeedInvitationResp {
  firstPic?: string;
  id?: number;
  message?: string;
  publishedAt?: string;
  status?: string;
  targetBid?: string;
  userInfo?: RespUserInfo;
  [property: string]: any;
}

/**
 * resp.FeedLikeResp
 */
export interface RespFeedLikeResp {
  firstPic?: string;
  id?: number;
  message?: string;
  publishedAt?: string;
  status?: string;
  targetBid?: string;
  userInfo?: RespUserInfo;
  [property: string]: any;
}

export interface CommentRequest {
  content: string;
  parentId: string;
  subject: string;
  [property: string]: any;
}

export interface DeleteCommentRequest {
  targetId: string;
}

export interface LikeCommentRequest {
  subject: string;
  targetId: string;
  [property: string]: any;
}

export interface CommentResponse extends ResponseType {}
