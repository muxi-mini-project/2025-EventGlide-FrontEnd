import { View, Image } from "@tarojs/components"
import { memo } from "react"
import { switchTab } from "@tarojs/taro";
import "./style.scss"
import avatar from "@/common/assets/Postlist/波奇.jpg"
import Naviarrow from "@/common/assets/arrowhead/Naviarrow.png"
import user from "@/common/types/User";

const NavigationBar: React.FC<{ url: string, userInfo: user  }> = memo(({ url, userInfo }) => {
  return (
    <View className="navigationBar">
          <Image onClick={() => switchTab({ url: url })} className="navigationBar-back" mode="widthFix" src={Naviarrow}></Image>
          <View className="navigationBar-user">
              <Image className="navigationBar-user-avatar" mode="scaleToFill" src={userInfo.avatar || avatar}></Image>
              <View className="navigationBar-user-name">{userInfo.username}</View>
          </View>
    </View>
  )
})

export default NavigationBar