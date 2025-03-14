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
    comment: number;
    introduce: string;
    showImg: string[];
    isLike: string;
    isCollect: string;
}

interface selectedInfo {
    host: string[] | null;
    type: string[] | null;
    detailDate: { startTime: string, endTime: string } | null;
    position: string[] | null;
    if_register: boolean | null;
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