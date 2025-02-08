import { View, ScrollView } from '@tarojs/components'
import Active from '@/modules/activityItem/index'
import ActiveList from '@/common/types/ActiveList'
import './index.scss'
import Sticky from "@/modules/index-sticky/index"
import PostWindow from '@/modules/PostWindow'
import { useState } from 'react'

const activeList: ActiveList[] = new Array(20).fill(
  {
    title: '活动标题',
    date: "01月13日 9：00-1月13日 11：00",
    position: '南湖综合楼'
  }
)

const Index = () => {
  const [showPostWindow, setShowPostWindow] = useState(false)
  return (
    <>
      <ScrollView className="active" scrollY={true}>
        <View className="sticky-header" >
          <Sticky />
        </View>
        <View className="sticky-item" >
          {activeList.map((activeItem, index) => (
            <Active key={index} activeItem={activeItem} setShowPostWindow={setShowPostWindow}/>
          ))}
        </View>
      </ScrollView>
      {showPostWindow && <PostWindow WindowType="active" setShowPostWindow={setShowPostWindow}></PostWindow>}
      {/* // <View className='test'>牛魔</View> */}
    </>
  )
}

export default Index