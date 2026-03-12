import Taro from '@tarojs/taro';
import Message from '../components/Message';

export interface RequestConfig {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  params?: any;
  header?: Record<string, string>;
  timeout?: number;
  skipAuth?: boolean; //是否需要token认证
}

export interface ApiResponse<T = any> {
  code: number;
  data: T;
  msg: string;
}

class ApiRequest {
  private baseURL: string;
  private defaultTimeout: number;

  constructor(baseUrl: string, timeout: number = 10000) {
    this.baseURL = baseUrl;
    this.defaultTimeout = timeout;
  }

  async request<T>(config: RequestConfig): Promise<ApiResponse<T>> {
    try {
      const headers: Record<string, string> = {
        ContentType: 'application/json;charse=UTF-8',
        ...config.header,
      };

      if (!config.skipAuth && !config.url.includes('/user/login')) {
        const token = await this.getToken();
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
      }

      let url = this.baseURL + config.url;

      if (config.params) {
        const queryString = Object.keys(config.params)
          .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(config.params[key])}`)
          .join('&');
        url += (url.includes('?') ? '&' : '?') + queryString;
      }

      const response = await Taro.request({
        url,
        method: config.method || 'GET',
        data: config.data,
        header: headers,
        timeout: config.timeout || this.defaultTimeout,
      });

      const result = response.data as ApiResponse<T>;

      if (result.code !== 200) {
        Message.error(result.msg || '请求失败');
        throw new Error(result.msg || '请求失败');
      }

      return result;
    } catch (error: any) {
      console.error('API Request Error', error);
      if (config.url == '/user/login') {
        Message.error(error.errMsg || '学号或密码错误');
      } else {
        Message.error(error.errMsg || '网络请求失败');
      }
      throw error;
    }
  }

  getToken() {
    return new Promise((resolve, reject) => {
      void Taro.getStorage({
        key: 'token',
        success: (res) => resolve(res.data),
        fail: (err) => reject(err),
      });
    });
  }

  get<T>(url: string, params?: any, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.request<T>({ url, method: 'GET', params, ...config });
  }

  post<T>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.request<T>({ url, method: 'POST', data, ...config });
  }

  put<T>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.request<T>({ url, method: 'PUT', data, ...config });
  }

  delete<T>(url: string, config?: Partial<RequestConfig>): Promise<ApiResponse<T>> {
    return this.request<T>({ url, method: 'DELETE', ...config });
  }
}

export const apiClient = new ApiRequest('https://api.inside-me.top');

export const request = <T>(config: RequestConfig) => apiClient.request<T>(config);

export const get = <T>(url: string, params?: any, config?: Partial<RequestConfig>) => {
  return apiClient.get<T>(url, params, config);
};

export const post = <T>(url: string, data?: any, config?: Partial<RequestConfig>) => {
  return apiClient.post<T>(url, data, config);
};
