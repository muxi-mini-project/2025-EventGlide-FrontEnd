import { View } from '@tarojs/components';
import './index.scss';
import withDoorGuard from '@/common/hoc';

const Index = () => {
  return <View className="wrapper"></View>;
};

export default withDoorGuard(Index);
