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
import { apiClient } from '@/common/api';
import { CheckLoginResponse } from '@/common/types';

function MainPage() {
  useDidShow(() => {
    const checkTokendate = async (sid: string) => {
      try {
        const result = await apiClient.get<CheckLoginResponse>(`/user/info/${sid}`);
        console.log(result.data);
      } catch (error) {
        Taro.reLaunch({ url: '/pages/login/index' });
      }
    };
    const checkToken = () => {
      try {
        const token = Taro.getStorageSync('token');
        const sid = Taro.getStorageSync('sid');
        if (!token || !sid) {
          Taro.reLaunch({ url: '/pages/login/index' });
        } else {
          checkTokendate(sid);
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
