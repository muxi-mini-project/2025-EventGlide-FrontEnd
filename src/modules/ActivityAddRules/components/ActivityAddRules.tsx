import { View, Text } from '@tarojs/components';
import { memo } from 'react';
import './style.scss';

const ActivityAddRules: React.FC<{ setShowAddRules: (show: boolean) => void }> = memo(
  ({ ...props }) => {
    return (
      <View className="rule-window">
        <View className="rule-window-background"></View>
        <View className="rule-window-container">
          <View className="rule-window-close" onClick={() => props.setShowAddRules(false)}>
            ×
          </View>
          <View className="rule-window-header">活动发布注意事项</View>
          <View className="rule-window-gapline1"></View>
          <View className="rule-window-content">
            <Text>
              1、“活动类型”根据活动内容来区分，包括“文艺类”，“体育类”，“竞赛类”，“游戏类”以及“学术类”。
            </Text>
            <Text>
              2、“活动承办方”指活动的承办单位，包括“本校”，“学院”，“社团”，“个人”以及“外校”。
            </Text>
            <Text>
              3、“活动时间”包括活动开始时间和活动结束时间，均应具体到“每分”,活动开始时间与活动结束时间至少应间隔30分钟。
            </Text>
            <Text>4、“活动地点”为自行填写，请填写尽量详细。</Text>
            <Text>5、请根据实际情况填写“是否需要报名”，若需要报名请详细说明报名方式。</Text>
            <Text>6、若勾选“是否外校可见”为“是”，则该活动也将展示在其他学校的首页中。</Text>
            <Text>
              7、所有活动的申报均需进行申报人身份认证。若活动承办方为非个人，则需进行1人身份认证以及活动申报表提交；若活动承办方为个人，则需进行至少3人身份认证。
            </Text>
            <Text>8、确认所有信息填写无误后即可发布审核，审核通过后将在首页进行展示。</Text>
          </View>
        </View>
      </View>
    );
  }
);

export default ActivityAddRules;
