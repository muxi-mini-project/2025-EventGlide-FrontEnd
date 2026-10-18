import { View } from '@tarojs/components';
import { memo } from 'react';
import './style.scss';
import { ImagePickerProps, Image } from '@/common/types';
import { handleChooseImage } from '@/common/utils/AlbumFunction';
import Drawer from '@/common/components/Drawer';

const ImagePickerInner = <T extends string | Image>({
  isVisiable,
  setIsVisiable,
  imgUrl,
  setImgUrl,
  type,
  count = 9,
  isRequest = false,
  withSize = false,
}: ImagePickerProps<T>) => {
  const handleChooseImageClick = () => {
    if (type === 'blog') {
      handleChooseImage<T>({
        setIsVisiable,
        setImgUrl,
        imgUrl,
        count: count,
        url: '/subpackage/postAdd/index',
        isAlbum: true,
        withSize,
      });
    } else if (type === 'event') {
      handleChooseImage<T>({
        setIsVisiable,
        setImgUrl,
        imgUrl,
        count: count,
        url: '',
        isAlbum: true,
        isRequest: isRequest,
        withSize,
      });
    }
  };
  const handleTakePhotoClick = () => {
    if (type === 'blog') {
      handleChooseImage<T>({
        setIsVisiable,
        setImgUrl,
        imgUrl,
        count: 1,
        url: '/subpackage/postAdd/index',
        isAlbum: false,
        withSize,
      });
    } else if (type === 'event') {
      handleChooseImage<T>({
        setIsVisiable,
        setImgUrl,
        imgUrl,
        count: 1,
        url: '',
        isAlbum: false,
        isRequest: isRequest,
        withSize,
      });
    }
  };
  return (
    <Drawer
      visible={isVisiable}
      onClose={() => setIsVisiable(false)}
      placement="bottom"
      showHeader={false}
    >
      <View className="album-window-content">
        <View className="album-window-content-btn1" onClick={() => handleChooseImageClick()}>
          从相册中选择
        </View>
        <View className="album-window-content-btn2" onClick={() => handleTakePhotoClick()}>
          拍摄
        </View>
        <View className="album-window-content-cancel" onClick={() => setIsVisiable(false)}>
          取消
        </View>
      </View>
    </Drawer>
  );
};

const ImagePicker = memo(ImagePickerInner) as unknown as typeof ImagePickerInner;

export default ImagePicker;
