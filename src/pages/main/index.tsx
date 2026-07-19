import { View } from '@tarojs/components';
import { useDidShow } from '@tarojs/taro';
import { useState } from 'react';
import Taro from '@tarojs/taro';
import CustomTabBar from '@/common/components/CustomTabBar';
import IndexHome from '@/pages/indexHome';
import AddHome from '@/pages/addHome';
import PostHome from '@/pages/postHome';
import MineHome from '@/pages/mineHome';
import './index.scss';

function MainPage() {
  useDidShow(() => {
    const checkToken = () => {
      try {
        const token = Taro.getStorageSync('token');
        if (!token) {
          Taro.reLaunch({ url: '/pages/login/index' });
        }
      } catch (error) {
        Taro.reLaunch({ url: '/pages/login/index' });
      }
    };
    checkToken();
  });
  const [activeTab, setActiveTab] = useState(0);

  const pages = [
    <IndexHome key="home" />,
    <AddHome key="add" />,
    <PostHome key="post" />,
    <MineHome key="mine" />,
  ];

  return (
    <View className="main-layout">
      <View className="page-container">
        {pages.map((page, i) => (
          <View key={i} className={`page ${activeTab === i ? 'active' : ''}`}>
            {page}
          </View>
        ))}
      </View>

      <CustomTabBar activeIndex={activeTab} onChange={setActiveTab} />
    </View>
  );
}
export default MainPage;
