import Modal from '@/common/components/Modal';
import './style.scss';
import { memo } from 'react';
import { View } from '@tarojs/components';

const ColorExplain: React.FC<{
  visible: boolean;
  onClose: () => void;
}> = memo(({ ...props }) => {
  const { visible, onClose } = props;
  return (
    <Modal
      title={'标签颜色说明'}
      visible={visible}
      onClose={onClose}
      showConfirm={false}
      showCancel={false}
    >
      <View className="color-explain">
        <View className="color-explain-content">
          活动展示界面用不同的标签颜色表示活动的类型，供用户了解参与。
        </View>
        <View className="color-explain-content">
          其中，黄色表示文艺类，绿色表示体育类，橙色表示竞赛类，蓝色表示游戏类，粉色表示学术类。
        </View>
      </View>
    </Modal>
  );
});

export default ColorExplain;
