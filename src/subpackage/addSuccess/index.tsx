import { View, Image } from '@tarojs/components';
import Button from '@/common/components/Button';
import './index.scss';
import img from '@/common/assets/add/提交成功.png';
import { NavigationBarTabBar } from '@/common/components/NavigationBar';

const Index = () => {
  const btn1 = {
    url: '/subpackage/review/index',
    text: '查看详细',
    backgroundColor: '#7D73F0',
    textColor: '#FFFEFF',
    isBorder: false,
  };
  const btn2 = {
    url: '/pages/main/index',
    text: '回到首页',
    backgroundColor: '#ffffff',
    textColor: '#C890F2',
    isBorder: true,
    borderColor: '#E4D1F9',
  };

  return (
    <>
      <NavigationBarTabBar backgroundColor="#FFFFFF" title="提交成功" />
      <View className="addSuccess-page">
        <View className="addSuccess-page-content">
          <Image className="addSuccess-page-content-img" mode="widthFix" src={img}></Image>
          <View className="addSuccess-page-content-title">提交成功</View>
          <View className="addSuccess-page-content-desc">
            恭喜您！您的报名申请已提交成功,请等待系统审核
          </View>
        </View>
        <View className="addSuccess-page-btn">
          {/* <Button {...btn1}></Button> */}
          <Button {...btn2}></Button>
        </View>
      </View>
    </>
  );
};

export default Index;
