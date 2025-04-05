import { create } from "zustand";
import { selectedInfo, ActivityDetailList } from "@/common/types/ActiveList";

interface ActivityStoreState {
  selectedInfo: selectedInfo | null;
  activeList: ActivityDetailList[];
  selectedItem: ActivityDetailList;
  isSelect: boolean;
  setIsSelect: (type: boolean) => void;
  setSelectInfo: (info: selectedInfo | null) => void; //筛选条件
  setActiveList: (list: ActivityDetailList[]) => void;
  setSelectedItem: (list: ActivityDetailList) => void; //选中的活动详情
  setLikeNumChange: (id: string, type: string) => void;
  setCollectNumChange: (id: string, type: string) => void;
}

const useActivityStore = create<ActivityStoreState>((set) => ({
  selectedInfo: null,
  activeList: [],
  selectedItem: {} as ActivityDetailList,
  isSelect: false,
  setIsSelect: (type) => set(() => ({ isSelect: type })),
  setSelectInfo: (info) => set(() => ({ selectedInfo: info })),
  setActiveList: (list) => set(() => ({ activeList: list })),
  setSelectedItem: (Item) => set(() => ({ selectedItem: Item })),
  setLikeNumChange: (id, type) => {
    const currentActiveList = useActivityStore.getState().activeList;
    const updatedActiveList = currentActiveList.map((item) => { 
      if (item.bid === id) {
        return {
          ...item,
          likeNum: type === "add" ? item.likeNum + 1 : item.likeNum - 1,
          isLike: type === "add" ? "true" : "false"
        }
      }
      return item;
    });
    set(() => ({ activeList: updatedActiveList }));
  },
  setCollectNumChange: (id, type) => {
    const currentActiveList = useActivityStore.getState().activeList;
    const updatedActiveList = currentActiveList.map((item) => { 
      if (item.bid === id) {
        return {
          ...item,
          collectNum: type === "add" ? item.collectNum + 1 : item.collectNum - 1,
          isCollect: type === "add" ? "true" : "false"
        }
      }
      return item;
    });
    set(() => ({ activeList: updatedActiveList }));
  }
}));

export default useActivityStore;
