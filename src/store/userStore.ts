import { create } from "zustand";

import user from "@/common/types/User";

interface userStoreType extends user {
    setId: (id: number) => void;
    setAvatar: (avatar: string) => void;
    setUsername: (username: string) => void;
    setSchool: (school: string) => void;
    setCollege: (college: string) => void;
    setStudentId: (studentId: string) => void;
}

const useUserStore = create<userStoreType>((set) => ({
    id: 0,
    avatar: "",
    username: "",
    school: "",
    college: "",
    studentid: "",
    setId: (id) => set(() => ({ id })),
    setAvatar: (avatar) => set(() => ({ avatar })),
    setUsername: (username) => set(() => ({ username })),
    setSchool: (school) => set(() => ({ school })),
    setCollege: (college) => set(() => ({ college })),
    setStudentId: (studentId) => set(() => ({ studentid: studentId })),
}));

export default useUserStore;