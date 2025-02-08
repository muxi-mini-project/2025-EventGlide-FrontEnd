import "./style.scss"
import { View, Image } from "@tarojs/components"
import pos from "@/common/assets/activity/pos.png"
import date from "@/common/assets/activity/act.png"
import { memo } from "react"

const Active: React.FC<{activeItem, setShowPostWindow: (show: boolean) => void}> = memo(({activeItem, setShowPostWindow}) => {
    return (
        <View className="active-container" onClick={() => setShowPostWindow(true)}>
            <View className="active-line"></View>
            <View className="active-header">{activeItem.title}XXX</View>
            <View className="active-content">
                <View className="active-date">
                    <Image className="active-icon" mode="widthFix" src={date}></Image><View>{activeItem.date}</View>
                </View>
                <View className="active-pos">
                    <Image className="active-icon" mode="widthFix" src={pos}></Image><View>{activeItem.position}</View>
                </View>
            </View>
            <View className="active-underline"></View>
        </View>
    )
})

export default Active