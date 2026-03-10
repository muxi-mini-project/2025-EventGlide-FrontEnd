import { View } from '@tarojs/components';
import { useState } from 'react';
import CustomTabBar from '@/common/components/CustomTabBar';
import IndexHome from '@/pages/indexHome';
import AddHome from '@/pages/addHome';
import PostHome from '@/pages/postHome';
import MineHome from '@/pages/mineHome';
import './index.scss';

export default function MainPage() {
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
