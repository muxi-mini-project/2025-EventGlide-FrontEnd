export interface CreatorType {
  username: string;
  avatar: string;
  studentId: string;
}

export interface ReplyType {
  bid: string;
  replyContent: string;
  creator: CreatorType;
  parentUserName?: string;
  replyCreator: {
    avatar: string;
    studentId: string;
    username: string;
  };
  replyPos: string;
  replyTime: string;
  // 可选属性
  isLike?: string;
  likeNum?: number;
}

// 响应类型（一级评论）
export interface ResponseType {
  bid: string;
  commentedPos: string;
  commentedTime: string;
  content: string;
  creator: CreatorType;
  isLike: string;
  likeNum: number;
  replyNum: number;
  reply: ReplyType[] | null;
  // 可选属性
  parentId?: string;
  rootId?: string;
}

// ReplyItem组件属性
export interface ReplyItemProps {
  // 基础属性
  bid: string;
  content?: string;
  replyContent?: string;
  creator?: CreatorType;
  replyCreator?: {
    avatar: string;
    studentId: string;
    username: string;
  };
  parentUserName?: string;
  replyTime?: string;
  commentedTime?: string;
  replyPos?: string;
  son?: boolean;

  // 交互相关属性
  isLike: string;
  likeNum: number;

  // 事件处理函数
  replycomment?: (visible: boolean) => void;
  setReplyId: (id: string) => void;
  setCommentItems?: (content: string) => void;
  setCommentCreator?: (creator: CreatorType) => void;
  setCommentid?: (id: string) => void;
  longClick?: () => void;
}

// ReplyList组件属性
export interface ReplyListProps {
  replies: ReplyType[] | null;
  replycomment: (visible: boolean) => void;
  setReplyId: (id: string) => void;
  setCommentItems: (content: string) => void;
  setCommentCreator: (creator: CreatorType) => void;
  setCommentid: (id: string) => void;
  longClick: () => void;
  // 可选：每次展开的最大数量
  expandLimit?: number;
}

// CommentItem组件属性
export interface CommentItemProps {
  comment: ResponseType;
  replycomment: (visible: boolean) => void;
  setReplyId: (id: string) => void;
  setCommentItems: (content: string) => void;
  setCommentCreator: (creator: CreatorType) => void;
  setCommentid: (id: string) => void;
  longClick: () => void;
  // 可选：每次展开的最大数量
  expandLimit?: number;
}

// CommentList组件属性
export interface CommentListProps {
  comments: ResponseType[];
  replycomment: (visible: boolean) => void;
  setReplyId: (id: string) => void;
  setCommentItems: (content: string) => void;
  setCommentCreator: (creator: CreatorType) => void;
  setCommentid: (id: string) => void;
  longClick: () => void;
  // 可选：每次展开的最大数量
  expandLimit?: number;
}
