import Taro, { navigateTo } from '@tarojs/taro';
import { fetchToQiniu } from '../api/qiniu';

type AlbumFunctionProps = {
  setIsVisiable: (isVisiable: boolean) => void;
  setImgUrl: (imgUrl: string[]) => void;
  imgUrl: string[];
  count: number;
  url: string;
  isAlbum: boolean;
  isRequest?: boolean;
};

const handleChooseImage = ({
  setIsVisiable,
  setImgUrl,
  imgUrl,
  count,
  url,
  isAlbum,
  isRequest = false,
}: AlbumFunctionProps) => {
  Taro.chooseImage({
    count: count,
    sizeType: ['original', 'compressed'],
    sourceType: isAlbum ? ['album'] : ['camera'],
    success: async (res) => {
      let newImgUrl: string[] = [...imgUrl];

      for (const filePath of res.tempFilePaths) {
        try {
          const qiniuUrl = await fetchToQiniu(filePath);
          if (qiniuUrl) newImgUrl.push(qiniuUrl as string);
        } catch (error) {
          console.error('上传到七牛云失败:', error);
          Taro.showToast({
            title: '图片上传失败',
            icon: 'none',
            duration: 2000,
          });
        }
      }

      if (isRequest) {
        newImgUrl = newImgUrl.filter((item) => !imgUrl.includes(item));
        setImgUrl(newImgUrl);
      } else setImgUrl(newImgUrl);
      setIsVisiable(false);
      console.log(url);
      if (url !== '') navigateTo({ url: url });
    },
    fail: (err) => {
      /* Taro.showToast({
        title: err.errMsg,
        icon: 'none',
        duration: 2000,
      }); */
      console.error(err);
    },
  });
};

export { handleChooseImage };
