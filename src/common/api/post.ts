import Taro from '@tarojs/taro';
const preUrl = 'https://api.inside-me.top';

const post = async (url: string, ...args: any) => {
  const getToken = () => {
    return new Promise((resolve, reject) => {
      void Taro.getStorage({
        key: 'token',
        success: (res) => resolve(res.data),
        fail: (err) => reject(err),
      });
    });
  };
  const token = await getToken();
  const header = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json;charset=utf-8',
  };
  const res = await Taro.request({
    url: `${preUrl}${url}`,
    method: 'POST',
    header,
    data: JSON.stringify(args[0]),
  });
  // console.log(res)
  return res.data;
};
export default post;
