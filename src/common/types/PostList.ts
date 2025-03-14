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
}

interface responseType {
    bid: string,
    commented_pos: string,
    commented_time: string,
    content: string,
    creator: {
        username: string,
        avatar: string,
        studentid: string,
    }
    likeNum: number,
    replyNum: number,
    reply: responseType[]
}

interface PostCommentProps extends PostCommentProp {
    res: PostCommentProp[];
}

export default PostList;
export { PostCommentProps, responseType };