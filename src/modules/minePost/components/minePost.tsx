import { memo } from 'react';
import { View, ScrollView, GridView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useState, useEffect } from 'react';
import Post from '@/modules/Post';
import './style.scss';
import usePostStore from '@/store/PostStore';
import useUserStore from '@/store/userStore';
import get from '@/common/api/get';
import post from '@/common/api/post';
import { blogType } from '@/store/PostStore';

// import handleInteraction from "@/common/const/Interaction";

const MinePost: React.FC<{
  activeIndex: 'release' | 'favourite';
  activePage: 'activity' | 'post';
  isSticky: boolean;
  setIsSticky: (isSticky: boolean) => void;
}> = memo(function ({ activeIndex, activePage, isSticky, setIsSticky }) {
  return (
    <ScrollView
      className="minepost-container"
      type="custom"
      id="minepost-scrollview"
      style={{ height: 'calc(100vh - 200rpx)' }}
      scrollY={isSticky ? true : false}
      usingSticky={true}
      enhanced={true}
      showScrollbar={false}
    ></ScrollView>
  );
});

export default MinePost;
