import { View, Image } from "@tarojs/components";
import './index.scss'
import MinePost from "@/modules/minePost/index";
import MineActivity from "@/modules/mineActivity/index";
import { useState } from "react";
import classnames from "classnames";
import avatar from "@/common/assets/Postlist/波奇.jpg"
import arrowheadw from "@/common/assets/arrowhead/引导箭头-白.png"
import arrowheadp from "@/common/assets/arrowhead/引导箭头-紫.png"
import search from "@/common/assets/Postlist/搜索.png"

const Index = () => {

  const [activePage, setActivePage] = useState<'activity' | 'post'>('post');
  const [activeIndex, setActiveIndex] = useState<'release' | 'favourite'>('release');

  return (
    <View className="mine-page">
      <View className="mine-user">
        <View className="mine-user-content">
          <Image className="mine-user-avatar" src={avatar}></Image>
          <View className="mine-user-info">
            <View className="mine-user-name">用户名</View>
            <View className="mine-user-school">华中师范大学</View>
          </View>
          <Image className="mine-user-arrowhead" mode="widthFix" src={arrowheadw}></Image>
        </View>
        <View className="mine-user-check">
          <View className="mine-user-check-info">审核中</View>
          <Image className="mine-user-check-arrowhead" mode="widthFix" src={arrowheadp}></Image>
        </View>
      </View>
      <View className="mine-order">
        <View className="mine-order-title">
          <View className="mine-order-title-choice">
            <View className={classnames("mine-order-title-choice-left", {"active-decoration-left": activePage === 'post'})} onClick={() => setActivePage('post')}>帖子</View>
            <View className={classnames("mine-order-title-choice-right", {"active-decoration-right": activePage === 'activity'})} onClick={() => setActivePage('activity')}>活动</View>
          </View>
          <Image className="mine-order-title-search" mode="widthFix" src={search}></Image>
          <View className="mine-order-title-line"></View>
          <View className="mine-order-title-index">
            <View className={classnames("mine-order-title-index-left", {"active-decoration-item": activeIndex === 'release'})} onClick={() => setActiveIndex('release')}>发布</View>
            <View className={classnames("mine-order-title-index-right", {"active-decoration-item": activeIndex === 'favourite'})} onClick={() => setActiveIndex('favourite')}>收藏</View>
          </View>
        </View>
        <View className="mine-order-content">
          {activePage === 'post' ? <MinePost activeIndex={activeIndex} /> : <MineActivity activeIndex={activeIndex} />}
        </View>
      </View>
    </View>
  );
};

export default Index;
