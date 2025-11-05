import { View, PageContainer } from '@tarojs/components';
import { memo } from 'react';
import './style.scss';
import AlbumWindowProps from '@/common/types/AlbumWindowProps';
import { handleChooseImage } from '@/common/const/AlbumFunction';

const AlbumWindow: React.FC<AlbumWindowProps> = memo(function AlbumWindow({
  isVisiable,
  setIsVisiable,
  isOverlay,
  imgUrl,
  setImgUrl,
  type,
  count = 9,
  isRequest = false,
}) {
  const handleChooseImageClick = () => {
    if (type === 'blog') {
      handleChooseImage({
        setIsVisiable,
        setImgUrl,
        imgUrl,
        count: count,
        url: '/subpackage/blogAdd/index',
        isAlbum: true,
      });
    } else if (type === 'event') {
      handleChooseImage({
        setIsVisiable,
        setImgUrl,
        imgUrl,
        count: count,
        url: '',
        isAlbum: true,
        isRequest: isRequest,
      });
    }
  };
  const handleTakePhotoClick = () => {
    if (type === 'blog') {
      handleChooseImage({
        setIsVisiable,
        setImgUrl,
        imgUrl,
        count: 1,
        url: '/subpackage/blogAdd/index',
        isAlbum: false,
      });
    } else if (type === 'event') {
      handleChooseImage({
        setIsVisiable,
        setImgUrl,
        imgUrl,
        count: 1,
        url: '',
        isAlbum: false,
        isRequest: isRequest,
      });
    }
  };
  return (
    <PageContainer
      show={isVisiable}
      overlay={isOverlay}
      position="bottom"
      onLeave={() => setIsVisiable(false)}
      customStyle="background-color: transparent;"
      overlayStyle="background-color: rgba(0, 0, 0, 0.5);"
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
    </PageContainer>
  );
});

export default AlbumWindow;
