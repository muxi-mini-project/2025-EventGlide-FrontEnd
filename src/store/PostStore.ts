import { create } from 'zustand';
import { PostDetailInfo } from '@/common/types';

interface PostStoreType {
  showImg: string[];
  title: string;
  introduce: string;
  studentId: string;
  PostList: PostDetailInfo[];
  PostIndex: number;
  backPage: string;
  selectCommentPost: string;
  setSelectCommentPost: (bid: string) => void;
  setBackPage: (page: string) => void;
  setPostList: (PostList: PostDetailInfo[]) => void;
  setPostIndex: (bid: string) => void;
  setLikeNumChange: (blog: PostDetailInfo, type: number) => void;
  setCollectNumChange: (blog: PostDetailInfo, type: number) => void;
  setImgUrl: (url: string[]) => void;
  setPoststudentId: (id: string) => void;
  setCommentNumChange: (blog: PostDetailInfo) => void;
  setContent: (title: string, description: string, imgUrl: string[]) => void;
}

const usePostStore = create<PostStoreType>((set, get) => ({
  showImg: [],
  title: '',
  introduce: '',
  studentId: '',
  PostList: [],
  PostIndex: -1,
  backPage: '',
  selectCommentPost: '',
  setSelectCommentPost: (bid) => set(() => ({ selectCommentPost: bid })),
  setBackPage: (page) => set(() => ({ backPage: page })),
  setPostList: (PostList) => set(() => ({ PostList })),
  setPostIndex: (bid) => {
    const currentPostList = get().PostList;
    const index = currentPostList.findIndex((b) => b.bid === bid); // 找到 bid 对应的索引
    set(() => ({ PostIndex: index }));
  },
  setLikeNumChange: (blog, type) => {
    const currentPostList = get().PostList;
    const updatedPostList = currentPostList.map((b) => {
      if (b.bid === blog.bid) {
        return {
          ...b,
          likeNum: type === 1 ? b.likeNum + 1 : b.likeNum - 1,
          isLike: type === 1 ? 'true' : 'false',
        };
      }
      return b;
    });
    set(() => ({ PostList: updatedPostList }));
  },
  setCollectNumChange: (blog, type) => {
    const currentPostList = get().PostList;
    const updatedPostList = currentPostList.map((b) => {
      if (b.bid === blog.bid) {
        return {
          ...b,
          collectNum: type === 1 ? b.collectNum + 1 : b.collectNum - 1,
          isCollect: type === 1 ? 'true' : 'false',
        };
      }
      return b;
    });
    set(() => ({ PostList: updatedPostList }));
  },
  setPoststudentId: (id) => set(() => ({ studentId: id })),
  setImgUrl: (url) => set(() => ({ showImg: url })),
  setContent: (title, description, imgUrl) =>
    set(() => ({ title, introduce: description, showImg: imgUrl })),
  setCommentNumChange: (blog) => {
    const currentPostList = get().PostList;
    const updatedPostList = currentPostList.map((b) => {
      if (b.bid === blog.bid) {
        return {
          ...b,
          commentNum: b.commentNum + 1,
        };
      }
      return b;
    });
    set(() => ({ PostList: updatedPostList }));
  },
}));

export default usePostStore;
