// 统一类型导出文件
export type {
  // 用户相关类型
  UserInfo,
} from './UserTypes';

export type {
  // 帖子相关类型
  PostList,
  PostCommentProp,
  CreatorType,
  ReplyType,
  ResponseType,
  PostCommentProps,
  PostDetailInfo,
} from './PostTypes';

export type {
  // 活动相关类型
  ActiveList,
  MyActivityList,
  SelectedInfo,
  ActivityDetailInfo,
  LetterType,
} from './ActivityTypes';

export type {
  // 表单相关类型
  InputType,
  FormItemType,
  LabelForm,
  DateItem,
  CalendarDay,
} from './FormTypes';

export type {
  // UI组件相关类型
  ModalProps,
  DrawerProps,
  CustomInputProps,
  ButtonProps,
  ImagePickerProps,
  ConfirmModalProps,
  AddPeopleProps,
  PictureCutProps,
  ReplyInputProps,
} from './UiProps';

export type {
  LoginRequest,
  LoginResponse,
  CheckLoginResponse,
  GetActivityDrafytResponse,
  FilteAcitivityRequest,
  CreateActivityRequest,
  GetActivityResponse,
  GetActivityResponsePage,
  CreatePostRequest,
  GetNotificationCountResponse,
  GetNotificationListReponse,
  GetPostDraftResonse,
  GetPostReponse,
  GetPostReponsePage,
  SaveDraftRequest,
  CommentRequest,
  DeleteCommentRequest,
  CommentResponse,
  LikeCommentRequest,
} from './RequestType';

export type {
  ReplyItemProps,
  ReplyListProps,
  CommentItemProps,
  CommentListProps,
} from './CommentTypes';

// 导入资源模块声明
//import './global/';
