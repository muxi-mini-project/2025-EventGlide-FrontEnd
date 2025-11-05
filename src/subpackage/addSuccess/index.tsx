import { View, Image } from '@tarojs/components';
import Button from '@/common/components/Button';
import './index.scss';
import img from '@/common/assets/add/提交成功.png';

const Index = () => {
  const btn1 = {
    url: '/subpackage/isChecking/index',
    text: '查看详细',
    backgroundColor: '#CF79FA',
    textColor: '#FFFEFF',
    isBorder: false,
  };
  const btn2 = {
    url: '/pages/indexHome/index',
    text: '返回首页',
    backgroundColor: '#ffffff',
    textColor: '#D290F2',
    isBorder: true,
  };

  return (
    <View className="addSuccess-page">
      <View className="addSuccess-page-content">
        <Image className="addSuccess-page-content-img" mode="widthFix" src={img}></Image>
        <View className="addSuccess-page-content-title">提交成功</View>
        <View className="addSuccess-page-content-desc">
          恭喜您！您的报名申请已提交成功,请等待系统审核
        </View>
      </View>
      <View className="addSuccess-page-btn">
        <Button {...btn1}></Button>
        <Button {...btn2}></Button>
      </View>
    </View>
  );
};

export default Index;
