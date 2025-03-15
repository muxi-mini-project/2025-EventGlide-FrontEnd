import "./style.scss"
import { View, Image } from "@tarojs/components"
import pos from "@/common/assets/activity/pos.png"
import date from "@/common/assets/activity/act.png"
import { memo } from "react"
import { ActivityDetailList } from "@/common/types/ActiveList"
import { activeColor } from "@/common/const/Formconst"
import TimeTranslation from "@/common/const/TimeTranslation"

const Active: React.FC<{ activeItem: ActivityDetailList, setShowPostWindow: (show: boolean) => void }> = memo(({ activeItem, setShowPostWindow }) => {
    // console.log(activeItem)
    return (
        <View className="active-container" onClick={() => setShowPostWindow(true)}>
            <View className="active-line" style={activeColor.get(activeItem.holderType) ? `background-color: ${activeColor.get(activeItem.holderType)}`: "background-color: #F68C8C"}></View>
            <View className="active-header" >{activeItem.title}</View>
            <View className="active-content">
                <View className="active-date">
                    <Image className="active-icon" mode="widthFix" src={date}></Image><View>{TimeTranslation(activeItem.detailTime.startTime)} - {TimeTranslation(activeItem.detailTime.endTime)}</View>
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