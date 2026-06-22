import { apiClient } from './request';
import Taro from '@tarojs/taro';
import {
  CreateActivityRequest,
  GetActivityResponse,
  GetActivityResponsePage,
  FilteAcitivityRequest,
} from '../types';

// 创建活动
export const createActivity = (activityData: CreateActivityRequest) => {
  return apiClient.post<GetActivityResponse>('/act/create', activityData);
};

// 获取活动列表
export const getActivityList = (params?: { page: number; limit: number }) => {
  return apiClient.post<GetActivityResponsePage>('/act/all', params);
};

export const getActivityDraft = () => {
  return apiClient.get<any>('/act/load');
};

// 获取我的活动列表
export const getMyActivityList = (
  type: 'release' | 'like' | 'favourite',
  limit: number,
  page: number,
  keyword?: string
) => {
  if (type === 'release') {
    return apiClient.post<GetActivityResponsePage>('/act/own', { limit, page, keyword });
  } else if (type === 'like') {
    return apiClient.post<GetActivityResponsePage>('/user/like/act', { limit, page, keyword });
  } else if (type === 'favourite') {
    return apiClient.post<GetActivityResponsePage>('/user/collect/act', { limit, page, keyword });
  }
  throw new Error('Invalid type for activity list');
};

// 通过id获取活动
export const getActivityById = (activityId: string) => {
  return apiClient.get<GetActivityResponse>(`/act/${activityId}`);
};

// 获取其他用户活动列表
export const getOtherUserActivityList = (limit: number, page: number, studentId: string) => {
  return apiClient.post<GetActivityResponsePage>(`/act/student/${studentId}`, {
    limit,
    page,
    studentId,
  });
};

// 获取活动详情
export const getActivityDetail = (activityId: string) => {
  return apiClient.get<GetActivityResponse>(`/act/detail/${activityId}`);
};

// 根据搜索获取帖子列表
export const searchActivityList = (data?: { name: string; limit: number; page: number }) => {
  return apiClient.post<GetActivityResponsePage>('/act/name', data);
};

// 筛选活动
export const filterActivity = (filterData: FilteAcitivityRequest) => {
  return apiClient.post<GetActivityResponsePage>('/act/search', filterData);
};
