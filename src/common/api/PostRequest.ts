import { apiClient } from './request';
import Taro from '@tarojs/taro';
import { GetPostReponse, CreatePostRequest, GetPostDraftResonse } from '../types';
// 创建帖子
export const createPost = (postData: CreatePostRequest) => {
  return apiClient.post<any>('/post/create', postData);
};

// 获取帖子列表
export const getPostList = (params?: { page?: number; size?: number; type?: string }) => {
  return apiClient.get<GetPostReponse[]>('/post/all', params);
};

// 根据搜索获取帖子列表
export const searchPostList = (data?: { name: string }) => {
  return apiClient.post<GetPostReponse[]>('/post/find', data);
};

// 获取我的帖子列表
export const getMyPostList = (type: 'release' | 'like' | 'favourite') => {
  if (type === 'release') {
    return apiClient.get<GetPostReponse[]>('/post/own');
  } else if (type === 'like') {
    return apiClient.post<GetPostReponse[]>('/user/like/post', {
      sid: Taro.getStorageSync('sid'),
    });
  } else if (type === 'favourite') {
    return apiClient.post<GetPostReponse[]>('/user/collect/post', {
      sid: Taro.getStorageSync('sid'),
    });
  }
  throw new Error('Invalid type for post list');
};

// 通过id获取帖子
export const getPostById = (postId: string) => {
  return apiClient.get<GetPostReponse>(`/post/${postId}`);
};

// 获取其他用户帖子列表
export const getOtherUserPostList = (targetUser: string) => {
  return apiClient.get<GetPostReponse[]>(`/post/user/${targetUser}`);
};

// 加载帖子草稿
export const loadPostDraft = () => {
  return apiClient.get<GetPostDraftResonse>('/post/load'); // 返回类型待定，根据实际API响应确定
};

// 保存帖子草稿
export const savePostDraft = (draftData: CreatePostRequest) => {
  return apiClient.post<CreatePostRequest>('/post/draft', draftData);
};
