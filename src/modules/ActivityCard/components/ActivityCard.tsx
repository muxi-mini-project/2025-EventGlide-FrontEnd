import './style.scss';
import { View, Image } from '@tarojs/components';
import pos from '@/common/svg/activity/pos.svg';
import date from '@/common/svg/activity/date.svg';
import { memo, useState } from 'react';
import { ActivityDetailInfo } from '@/common/types';
import { activeColor, holdertype } from '@/common/const/Formconst';
import TimeTranslation from '@/common/utils/TimeTranslation';

const ActivityCard: React.FC<{
  activeItem: ActivityDetailInfo;
  setShowPostWindow: (show: boolean) => void;
  isbottomline?: boolean;
}> = memo(({ activeItem, setShowPostWindow, isbottomline = true }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };
  return (
    <View className="active-container" onClick={() => setShowPostWindow(true)}>
      <View className="active-image">
        <Image
          className={`active-image-img ${imageLoaded ? 'loaded' : ''}`}
          src={activeItem.showImg[0]}
          onLoad={handleImageLoad}
          mode="aspectFill"
        ></Image>
        {!imageLoaded && <View className="image-loader"></View>}
      </View>
      <View className="active-header">{activeItem.title}</View>
      <View className="active-content">
        <View className="active-date">
          <Image className="active-icon" mode="widthFix" src={date}></Image>
          <View className="active-date-text">
            {TimeTranslation(activeItem.detailTime.startTime)} -{' '}
            {TimeTranslation(activeItem.detailTime.endTime)}
          </View>
        </View>
        <View className="active-pos">
          <Image className="active-icon" mode="widthFix" src={pos}></Image>
          <View className="active-pos-text">{activeItem.position}</View>
        </View>
      </View>
      <View className="active-footer">
        <View className="active-footer-holder">
          {holdertype.get(activeItem.holderType) || activeItem.holderType}
        </View>
        <View
          className="active-footer-type"
          style={
            activeColor.get(activeItem.type)
              ? `background-color: ${activeColor.get(activeItem.type)}`
              : 'background-color: #bd96ee'
          }
        >
          {activeItem.type}
        </View>
      </View>
      <View
        style={isbottomline ? { display: 'block' } : { display: 'none' }}
        className="active-underline"
      ></View>
    </View>
  );
});

export default ActivityCard;
