import { apiClient } from './request';
import Taro from '@tarojs/taro';
import { CreateActivityRequest, GetActivityResponse, FilteAcitivityRequest } from '../types';

// 创建活动
export const createActivity = (activityData: CreateActivityRequest) => {
  return apiClient.post<GetActivityResponse>('/act/create', activityData);
};

// 获取活动列表
export const getActivityList = (params?: {
  page?: number;
  size?: number;
  type?: string;
  holderType?: string;
  date?: string;
  position?: string;
}) => {
  return apiClient.get<GetActivityResponse[]>('/act/all', params);
};

export const getActivityDraft = () => {
  return apiClient.get<any>('/act/load');
};

// 获取我的活动列表
export const getMyActivityList = (type: 'release' | 'like' | 'favourite') => {
  if (type === 'release') {
    return apiClient.get<GetActivityResponse[]>('/act/own');
  } else if (type === 'like') {
    return apiClient.post<GetActivityResponse[]>('/user/like/act', {
      studentId: Taro.getStorageSync('sid'),
    });
  } else if (type === 'favourite') {
    return apiClient.post<GetActivityResponse[]>('/user/collect/act', {
      studentId: Taro.getStorageSync('sid'),
    });
  }
  throw new Error('Invalid type for activity list');
};

// 通过id获取活动
export const getActivityById = (activityId: string) => {
  return apiClient.get<GetActivityResponse>(`/act/${activityId}`);
};

// 获取其他用户活动列表
export const getOtherUserActivityList = (targetUser: string) => {
  return apiClient.get<GetActivityResponse[]>(`/act/user/${targetUser}`);
};

// 获取活动详情
export const getActivityDetail = (activityId: string) => {
  return apiClient.get<GetActivityResponse>(`/act/detail/${activityId}`);
};

// 根据搜索获取帖子列表
export const searchActivityList = (data?: { name: string }) => {
  return apiClient.post<GetActivityResponse[]>('/act/name', data);
};

// 筛选活动
export const filterActivity = (filterData: FilteAcitivityRequest) => {
  return apiClient.post<GetActivityResponse[]>('/act/search', filterData);
};
