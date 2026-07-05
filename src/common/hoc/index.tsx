import React from 'react';
import useDoorStore from '@/store/DoorStote';
import { View, Image, Text } from '@tarojs/components';
import Logo from '@/common/svg/logo/mainlogo.svg';
import { NavigationBarTabBar } from '@/common/components/NavigationBar';
import './index.scss';

// 门页（加载中/阻断时显示）
const DoorPage = () => (
  <>
    <NavigationBarTabBar backgroundColor="#FFFFFF" title="校灵通"></NavigationBarTabBar>
    <View className="door-page">
      <View className="door-page-logo">
        <Image src={Logo} mode="widthFix" className="door-page-logo-img" />
        <Text className="door-page-logo-text">校灵通</Text>
        <Text className="door-page-logo-desc">EventGlide</Text>
      </View>
    </View>
  </>
);

// 高阶组件：灰度发布守卫
const withDoorGuard = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const WithDoorGuard: React.FC<P> = (props) => {
    const { doorStatus } = useDoorStore();

    // 根据状态显示不同内容
    switch (doorStatus) {
      case 'pass':
        return <WrappedComponent {...props} />;
      case 'block':
        return <DoorPage />;
      case 'loading':
        return <DoorPage />;
      default:
        return <DoorPage />;
    }
  };

  WithDoorGuard.displayName = `WithDoorGuard(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithDoorGuard;
};

export default withDoorGuard;
