import Taro from '@tarojs/taro';
import get from './get';

export interface WebGetTubeTokenData {
  access_token: string;
  domain_name: string;
}
export interface QiniuUploadResponse {
  key: string;
  hash: string;
}
export interface ResponseQiniu {
  code?: number;
  data: WebGetTubeTokenData;
  msg?: string;
}
export const fetchQiniuToken = async () => {
  try {
    const url = '/user/token/qiniu';

    const response: ResponseQiniu = await get(url);
    return response.data;
  } catch (error) {
    Taro.showToast({
      title: '上传失败',
      icon: 'none',
      duration: 2000,
    });
    console.error('Error fetching Qiniu token:', error);
  }
};
export const fetchToQiniu = async (filepath: string) => {
  try {
    const data = await fetchQiniuToken();
    if (!data || !data.access_token || !data.domain_name) {
      Taro.showToast({
        title: '上传',
        icon: 'none',
        duration: 2000,
      });
      throw new Error('Qiniu token 无');
    }

    const { access_token, domain_name } = data;

    return new Promise((resolve, reject) => {
      void Taro.uploadFile({
        url: 'https://upload-z2.qiniup.com',
        filePath: filepath,
        name: 'file',
        formData: {
          token: access_token,
        },
        success: (res) => {
          resolve(`http://${domain_name}/${JSON.parse(res.data)?.key}`);
        },
        fail: (err) => {
          reject(err);
        },
      });
    });
  } catch (error) {
    Taro.showToast({
      title: '上传失败',
      icon: 'none',
      duration: 2000,
    });
    console.error('Error in fetchToQiniu:', error);
    throw error;
  }
};