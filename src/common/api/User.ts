import { apiClient } from './request';
import { UserInfo } from '../types';

// 获取用户信息
export const getUserInfo = (studentId: string) => {
  return apiClient.get<UserInfo>(`/user/info/${studentId}`);
};

//验证用户是否存在以及姓名学号是否匹配
export const verifyUserInfo = (realName: string, studentId: string) => {
  return apiClient.post<boolean>('/user/verify', { realName, studentId });
};
