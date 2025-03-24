type PostList = {
  imgUrl: string;
  title: string;
  content: string;
};

type PostCommentProp = {
  username: string;
  desc: string;
  time: string;
  site: string;
};

interface replyType {
  bid: string;
  reply_content: string;
  parentUserName: string;
  reply_creator: {
    avatar: string;
    studentid: string;
    username: string;
  };
  reply_pos: string;
  reply_time: string;
}

interface responseType {
  bid: string;
  commented_pos: string;
  commented_time: string;
  content: string;
  creator: {
    username: string;
    avatar: string;
    studentid: string;
  };
  isLike: string;
  likeNum: number;
  replyNum: number;
  reply: replyType[];
}

interface PostCommentProps extends PostCommentProp {
  res: PostCommentProp[];
}

export default PostList;
export { PostCommentProps, responseType, replyType };
