import { View, Image } from '@tarojs/components';
import './index.scss';
import addpic from '@/common/svg/add/addHome.svg';
import remindpic from '@/common/svg/add/remind.svg';
import Button from '@/common/components/Button';
import { ButtonProps } from '@/common/types';
import useActivityStore from '@/store/ActivityStore';
import { useDidShow } from '@tarojs/taro';
import { NavigationBarTabBar } from '@/common/components/NavigationBar';
import { useState } from 'react';
import ActivityAddRules from '@/modules/ActivityAddRules';
import withDoorGuard from '@/common/hoc';

const Index = () => {
  const [showAddRules, setShowAddRules] = useState(false);

  const addBtn: ButtonProps = {
    url: '/subpackage/addIntroduce/index',
    text: '去填写',
    backgroundColor: '#7D73F0',
    textColor: '#fff',
    isBorder: false,
  };
  const { setIsSelect } = useActivityStore();
  useDidShow(() => {
    setIsSelect(false);
  });

  const handleAddRulesClick = () => {
    setShowAddRules(true);
  };

  return (
    <>
      <NavigationBarTabBar backgroundColor="#fff" title="添加"></NavigationBarTabBar>
      <View className="add-page">
        <View className="add-main">
          <Image src={addpic} className="add-pic" mode="widthFix"></Image>
          <View className="add-text">活动填写后可在主页发布</View>
        </View>
        <View className="add-begin">
          <Button
            url={addBtn.url}
            text={addBtn.text}
            backgroundColor={addBtn.backgroundColor}
            textColor={addBtn.textColor}
            isBorder={addBtn.isBorder}
          ></Button>
          <View className="add-remind">
            <Image src={remindpic} className="remind-pic" mode="widthFix"></Image>
            <View className="remind-text" onClick={handleAddRulesClick}>
              查看注意事项
            </View>
          </View>
        </View>
      </View>
      {showAddRules && (
        <ActivityAddRules showAddRules={showAddRules} setShowAddRules={setShowAddRules} />
      )}
    </>
  );
};

export default withDoorGuard(Index);
