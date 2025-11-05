import { Image, View } from '@tarojs/components';
import { memo } from 'react';
import classnames from 'classnames';
import './style.scss';

const Picture: React.FC<{
  src?: string;
  isShowDelete: boolean;
  size?: number;
  imgUrl: string[];
  setImgUrl: (url: string[]) => void;
}> = memo((props) => {
  if (!Array.isArray(props.imgUrl)) {
    console.error('imgUrl is not an array:', props.imgUrl);
    return null;
  }

  if (props.src !== undefined) {
    return (
      <View
        className="picture"
        style={props.size !== undefined ? `width: ${props.size}rpx; height: ${props.size}rpx;` : ''}
      >
        <Image
          src={props.src}
          mode="scaleToFill"
          className="picture-img"
          style={
            props.size !== undefined ? `width: ${props.size}rpx; height: ${props.size}rpx;` : ''
          }
        ></Image>
        <View
          className={classnames('picture-mask', {
            none: !props.isShowDelete,
          })}
          onClick={() => {
            const newImgUrl = props.imgUrl.filter((url) => url !== props.src);
            props.setImgUrl(newImgUrl);
          }}
        >
          ×
        </View>
      </View>
    );
  } else {
    return null;
  }
});

export default Picture;
