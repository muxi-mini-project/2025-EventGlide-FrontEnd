import { View, Image } from '@tarojs/components';
import { memo } from 'react';
import Taro from '@tarojs/taro';
import './style.scss';
import avatar from '@/common/assets/Postlist/波奇.jpg';
import Naviarrow from '@/common/svg/arrowhead/Naviarrow.svg';
import { UserInfo } from '@/common/types';

const NavigationBar: React.FC<{ url: string; userInfo: UserInfo }> = memo(({ userInfo }) => {
  return (
    <View className="navigationBar">
      <View className="navigationBar-back" onClick={() => Taro.navigateBack()}>
        <Image className="navigationBar-back-icon" mode="widthFix" src={Naviarrow}></Image>
      </View>
      <View className="navigationBar-user">
        <Image
          className="navigationBar-user-avatar"
          mode="scaleToFill"
          src={userInfo.avatar || avatar}
        ></Image>
        <View className="navigationBar-user-name">{userInfo.username}</View>
      </View>
    </View>
  );
});

const NavigationBarTabBar: React.FC<{
  backgroundColor: string;
  title: string;
  color?: string;
}> = memo(({ backgroundColor, title, color }) => {
  return (
    <View className="navigationBar" style={{ backgroundColor }}>
      <View className="navigationBar-title" style={{ color }}>
        {title}
      </View>
    </View>
  );
});

const NavigationBarBack: React.FC<{
  backgroundColor: string;
  title: string;
  url: string;
}> = memo(({ backgroundColor, title }) => {
  return (
    <View className="navigationBar" style={{ backgroundColor }}>
      <View onClick={() => Taro.navigateBack()} className="navigationBar-back">
        <Image className="navigationBar-back-icon" mode="widthFix" src={Naviarrow}></Image>
      </View>
      <View className="navigationBar-title">{title}</View>
    </View>
  );
});

export { NavigationBar, NavigationBarTabBar, NavigationBarBack };
