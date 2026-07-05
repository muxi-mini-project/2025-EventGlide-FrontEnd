import './style.scss';
import { View } from '@tarojs/components';
import { navigateTo } from '@tarojs/taro';
import { memo } from 'react';
import Picture from '@/common/components/Picture';
import { holdertype, activeColor } from '@/common/const/Formconst';

interface ActivityData {
  title?: string;
  introduce?: string;
  showImg?: string[] | null;
  type?: string;
  holderType?: string;
  ifRegister?: boolean | string;
}

interface ActivityContentProps {
  activityData: ActivityData;
  canDeleteImages?: boolean;
  isDraftMode?: boolean; // 如果是草稿模式，会显示默认提示文字等
  setShowPostWindow?: (visible: boolean) => void;
}

const ActivityContent: React.FC<ActivityContentProps> = memo(
  ({
    activityData,
    canDeleteImages = false,
    isDraftMode = false,
    setShowPostWindow = () => {},
  }) => {
    const { introduce: description, showImg, type, holderType, ifRegister } = activityData;

    // 处理报名状态文本
    let registerText = '无需报名';
    if (ifRegister === '是' || ifRegister === true) registerText = '需要报名';

    // 默认内容文本
    const defaultDescription =
      '为了让大家更好地了解该活动，请介绍一下活动亮点， 活动流程和注意事项等内容......';

    // 图片列表处理
    const imgList = showImg && Array.isArray(showImg) ? showImg : [];

    return (
      <View
        className="activity-content"
        onClick={() => {
          navigateTo({ url: '/subpackage/actComment/index' });
          setShowPostWindow(false);
        }}
      >
        <View className="activity-content-text">
          {isDraftMode
            ? description !== ''
              ? description
              : defaultDescription
            : description
              ? description
              : '暂无介绍'}
        </View>

        <View className="activity-content-other">
          <View className="activity-content-types">
            <View className="activity-content-types-item">
              {holdertype.get(holderType || '') || holderType || ''}
            </View>
            <View
              className="activity-content-types-item"
              style={
                activeColor.get(type || '')
                  ? `background-color: ${activeColor.get(type || '')}`
                  : 'background-color: #bd96ee'
              }
            >
              {type || ''}
            </View>
          </View>

          <View className="activity-content-pic">
            {imgList.map((item, index) => (
              <Picture
                key={index}
                src={item}
                isShowDelete={canDeleteImages}
                imgUrl={[]}
                setImgUrl={([]) => {}}
              ></Picture>
            ))}
          </View>
        </View>
      </View>
    );
  }
);

export default ActivityContent;
