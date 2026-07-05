import React from 'react';
import { View, Image } from '@tarojs/components';
import './style.scss';
import { ScrollTopProps } from '@/common/types';
import toTop from '@/common/assets/Postlist/totop.png';

const ScrollTop: React.FC<ScrollTopProps> = ({ setScrollTop, isVisible, bottom = 100 }) => {
  const onScrollTop = () => {
    setScrollTop(1);

    setTimeout(() => {
      setScrollTop(0);
    }, 0);
  };
  return (
    <View
      className={`scroll-top ${isVisible ? 'scroll-top-visible' : ''} `}
      style={{ bottom }}
      onClick={onScrollTop}
    >
      <Image className="scroll-top-icon" src={toTop} mode="widthFix" />
    </View>
  );
};

export default ScrollTop;
