import { create } from 'zustand';
import { SelectedInfo, ActivityDetailInfo } from '@/common/types';

interface ActivityStoreState {
  selectedInfo: SelectedInfo;
  activeList: ActivityDetailInfo[];
  selectedItem: ActivityDetailInfo;
  isSelect: boolean;
  selectComment: string;
  setSelectComment: (comment: string) => void;
  setIsSelect: (type: boolean) => void;
  setSelectInfo: (info: SelectedInfo) => void; //筛选条件
  setActiveList: (list: ActivityDetailInfo[]) => void;
  setSelectedItem: (list: ActivityDetailInfo) => void; //选中的活动详情
  setLikeNumChange: (id: string, type: string) => void;
  setCollectNumChange: (id: string, type: string) => void;
}

const useActivityStore = create<ActivityStoreState>((set) => ({
  selectedInfo: {
    holderType: [],
    type: [],
    position: [],
    ifRegister: '',
    detailTime: '',
  },
  activeList: [],
  selectedItem: {} as ActivityDetailInfo,
  isSelect: false,
  selectComment: '',
  setSelectComment: (comment) => set(() => ({ selectComment: comment })),
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
          likeNum: type === 'add' ? item.likeNum + 1 : item.likeNum - 1,
          isLike: type === 'add' ? 'true' : 'false',
        };
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
          collectNum: type === 'add' ? item.collectNum + 1 : item.collectNum - 1,
          isCollect: type === 'add' ? 'true' : 'false',
        };
      }
      return item;
    });
    set(() => ({ activeList: updatedActiveList }));
  },
}));

export default useActivityStore;
