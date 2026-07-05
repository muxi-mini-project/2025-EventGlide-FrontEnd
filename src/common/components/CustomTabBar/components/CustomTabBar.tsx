import { View, Image } from '@tarojs/components';
import './style.scss';
import Icon from '@/common/svg/tabBar/tab_icon.svg';

const tabs = [{ title: '首页' }, { title: '添加' }, { title: '发现' }, { title: '我的' }];

type Props = {
  activeIndex: number;
  onChange: (i: number) => void;
};

export default function CustomTabBar({ activeIndex, onChange }: Props) {
  return (
    <View className="tabbar">
      <View
        className="indicator"
        style={{
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      />

      {tabs.map((tab, i) => {
        const chars = tab.title.split('');

        return (
          <View
            key={i}
            className={`tab-item ${activeIndex === i ? 'active' : ''}`}
            onClick={() => onChange(i)}
          >
            <View className="tab-title">
              <View className="tab-char char-left">{chars[0]}</View>

              <View className="tab-char char-right">{chars[1]}</View>
            </View>
            <Image className="tab-icon tab-default" src={Icon} />

            <Image className="tab-icon tab-active-icon" src={Icon} />
          </View>
        );
      })}
    </View>
  );
}
