import { create } from 'zustand';
import { PostDetailInfo } from '@/common/types';

interface PostStoreType {
  showImg: string[];
  title: string;
  introduce: string;
  studentId: string;
  PostList: PostDetailInfo[];
  selectPostList: PostDetailInfo[];
  PostIndex: number;
  postUpdates: Record<string, Partial<PostDetailInfo>>;
  backPage: string;
  selectCommentPost: string;
  setSelectCommentPost: (bid: string) => void;
  setBackPage: (page: string) => void;
  setPostList: (PostList: PostDetailInfo[]) => void;
  setSelectPostList: (PostList: PostDetailInfo[]) => void;
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
  selectPostList: [],
  postUpdates: {},
  PostIndex: -1,
  backPage: '',
  selectCommentPost: '',
  setSelectCommentPost: (bid) => set(() => ({ selectCommentPost: bid })),
  setBackPage: (page) => set(() => ({ backPage: page })),
  setPostList: (PostList) => set(() => ({ PostList })),
  setSelectPostList: (PostList) => set(() => ({ selectPostList: PostList })),
  setPostIndex: (bid) => {
    const currentPostList = get().selectPostList;
    const index = currentPostList.findIndex((b) => b.id === bid); // 找到 bid 对应的索引
    set(() => ({ PostIndex: index }));
  },
  setLikeNumChange: (blog, type) => {
    const currentPostList = get().selectPostList;
    const updatedPostList = currentPostList.map((b) => {
      if (b.id === blog.id) {
        return {
          ...b,
          likeNum: type === 1 ? b.likeNum + 1 : b.likeNum - 1,
          isLike: type === 1 ? 'true' : 'false',
        };
      }
      return b;
    });
    const postUpdates = { ...get().postUpdates };
    const updatedItem = updatedPostList.find((b) => b.id === blog.id);
    if (updatedItem) {
      postUpdates[blog.id] = {
        likeNum: updatedItem.likeNum,
        isLike: updatedItem.isLike,
      };
    }

    set(() => ({
      PostList: updatedPostList,
      selectPostList: updatedPostList,
      postUpdates,
    }));
  },
  setCollectNumChange: (blog, type) => {
    const currentPostList = get().selectPostList;
    const updatedPostList = currentPostList.map((b) => {
      if (b.id === blog.id) {
        return {
          ...b,
          collectNum: type === 1 ? b.collectNum + 1 : b.collectNum - 1,
          isCollect: type === 1 ? 'true' : 'false',
        };
      }
      return b;
    });
    const postUpdates = { ...get().postUpdates };
    const updatedItem = updatedPostList.find((b) => b.id === blog.id);
    if (updatedItem) {
      postUpdates[blog.id] = {
        collectNum: updatedItem.collectNum,
        isCollect: updatedItem.isCollect,
      };
    }

    set(() => ({
      PostList: updatedPostList,
      selectPostList: updatedPostList,
      postUpdates,
    }));
  },
  setPoststudentId: (id) => set(() => ({ studentId: id })),
  setImgUrl: (url) => set(() => ({ showImg: url })),
  setContent: (title, description, imgUrl) =>
    set(() => ({ title, introduce: description, showImg: imgUrl })),
  setCommentNumChange: (blog) => {
    const currentPostList = get().selectPostList;
    const updatedPostList = currentPostList.map((b) => {
      if (b.id === blog.id) {
        return {
          ...b,
          commentNum: b.commentNum + 1,
        };
      }
      return b;
    });
    const postUpdates = { ...get().postUpdates };
    const updatedItem = updatedPostList.find((b) => b.id === blog.id);
    if (updatedItem) {
      postUpdates[blog.id] = {
        commentNum: updatedItem.commentNum,
      };
    }

    set(() => ({
      PostList: updatedPostList,
      selectPostList: updatedPostList,
      postUpdates,
    }));
  },
}));

export default usePostStore;
