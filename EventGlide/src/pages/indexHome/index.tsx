import { View, ScrollView } from '@tarojs/components'
import Active from '@/modules/activityItem/index'
import ActiveList from '@/common/types/ActiveList'
import './index.scss'
import Sticky from "@/modules/index-sticky/index"

const activeList: ActiveList[] = new Array(20).fill(
  {
    title: '活动标题',
    date: "01月13日 9：00-1月13日 11：00",
    position: '南湖综合楼'
  }
)

const Index = () => {
  return (
    <ScrollView className="active" scrollY={true}>
      <View className="sticky-header" >
        <Sticky />
      </View>
      <View className="sticky-item" >
        {activeList.map((activeItem, index) => (
          <Active key={index} activeItem={activeItem} />
        ))}
      </View>
    </ScrollView>
    // <View className='test'>牛魔</View>
  )
}

export default Index