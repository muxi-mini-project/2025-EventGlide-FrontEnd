import { create } from "zustand";

type blogType = {
  bid: string;
  collectNum: number;
  commentNum: number;
  introduce: string;
  likeNum: number;
  isLike: string;
  isCollect: string;
  showImg: string[];
  title: string;
  userInfo: {
    avatar: string;
    school: string;
    studentid: string;
    username: string;
  };
};

interface PostStoreType {
  showImg: string[];
  title: string;
  introduce: string;
  studentid: string;
  blogList: blogType[];
  blogIndex: number;
  setBlogList: (blogList: blogType[]) => void;
  setBlogIndex: (index: number) => void;
  setLikeNumChange: (blog: blogType, type: number) => void;
  setCollectNumChange: (blog: blogType, type: number) => void;
  setImgUrl: (url: string[]) => void;
  setPostStudentId: (id: string) => void;
  setContent: (title: string, description: string, imgUrl: string[]) => void;
}

const usePostStore = create<PostStoreType>((set, get) => ({
  showImg: [],
  title: "",
  introduce: "",
  studentid: "",
  blogList: [],
  blogIndex: -1,
  setBlogList: (blogList) => set(() => ({ blogList })),
  setBlogIndex: (index) => set(() => ({ blogIndex: index })),
  setLikeNumChange: (blog, type) => {
    const currentBlogList = get().blogList;
    const updatedBlogList = currentBlogList.map((b) => {
      if (b.bid === blog.bid) {
        return {
          ...b,
          likeNum: type === 1 ? b.likeNum + 1 : b.likeNum - 1,
          isLike: type === 1 ? "true" : "false",
        };
      }
      return b;
    });
    set(() => ({ blogList: updatedBlogList }));
  },
  setCollectNumChange: (blog, type) => {
    const currentBlogList = get().blogList;
    const updatedBlogList = currentBlogList.map((b) => {
      if (b.bid === blog.bid) {
        return {
          ...b,
          collectNum: type === 1 ? b.collectNum + 1 : b.collectNum - 1,
          isCollect: type === 1 ? "true" : "false",
        };
      }
      return b;
    });
    set(() => ({ blogList: updatedBlogList }));
  },
  setPostStudentId: (id) => set(() => ({ studentid: id })),
  setImgUrl: (url) => set(() => ({ showImg: url })),
  setContent: (title, description, imgUrl) =>
    set(() => ({ title, introduce: description, showImg: imgUrl })),
}));

export default usePostStore;
export { blogType };