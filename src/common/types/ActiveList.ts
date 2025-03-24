import user from "./User";

type ActiveList = {
    date: string;
    position: string;
}

interface MineActivityList {
    avatar: string;
    title: string;
    name: string;
    likes: number;
    collectNum: number;
    comment: number;
    introduce: string;
    showImg: string[];
    isLike: string;
    isCollect: string;
}

interface selectedInfo {
    holderType: string[];
    type: string[];
    detailTime: { startTime: string, endTime: string };
    position: string[];
    if_register: string;
}

interface ActivityDetailList {
    bid: string;
    userInfo: user;
    title: string;
    detailTime: { startTime: string, endTime: string };
    position: string;
    introduce: string;
    holderType: string;
    type: string;
    if_register: boolean;
    showImg: string[];
    collectNum: number;
    likeNum: number;
    commentNum: number;
    isLike: string;
    isCollect: string;
}

export type { MineActivityList, selectedInfo, ActivityDetailList };

export default ActiveList;