type ActiveList = {
    title: string;
    date?: string;
    position?: string;
}

interface MineActivityList extends ActiveList {
    avatar?: string;
    name: string;
    favorite: number;
    comment: number;
    // introduce: string;
}

export type { MineActivityList };

export default ActiveList;