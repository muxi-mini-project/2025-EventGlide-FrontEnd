import Taro, { navigateTo } from '@tarojs/taro';
import { fetchToQiniu } from '../api/qiniu';
import { Image } from '../types';

type AlbumFunctionProps<T extends string | Image> = {
  setIsVisiable: (isVisiable: boolean) => void;
  setImgUrl: (imgUrl: T[]) => void;
  imgUrl: T[];
  count: number;
  url: string;
  isAlbum: boolean;
  isRequest?: boolean;
  /** 上传后是否携带图片宽高（showImg 需要），默认 false */
  withSize?: boolean;
};

const handleChooseImage = <T extends string | Image>({
  setIsVisiable,
  setImgUrl,
  imgUrl,
  count,
  url,
  isAlbum,
  isRequest = false,
  withSize = false,
}: AlbumFunctionProps<T>) => {
  Taro.chooseImage({
    count: count,
    sizeType: ['original', 'compressed'],
    sourceType: isAlbum ? ['album'] : ['camera'],
    success: async (res) => {
      let newImgUrl: T[] = [...imgUrl];

      for (const filePath of res.tempFilePaths) {
        try {
          const qiniuUrl = await fetchToQiniu(filePath);
          if (!qiniuUrl) continue;
          if (withSize) {
            const imgInfo = await Taro.getImageInfo({ src: filePath });
            newImgUrl.push({ url: qiniuUrl, width: imgInfo.width, height: imgInfo.height } as T);
          } else {
            newImgUrl.push(qiniuUrl as T);
          }
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
