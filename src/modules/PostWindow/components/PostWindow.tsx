import "./style.scss"
import { View, Image, Text } from "@tarojs/components"
import { useState, memo } from "react"
import Picture from "@/common/components/Picture"
import { navigateTo } from "@tarojs/taro"
import favor from "@/common/assets/Postlist/images/收藏.png"
import favorAct from "@/common/assets/Postlist/images-active/收藏-active.png"
import commentPic from "@/common/assets/Postlist/评论.png"

const Label: React.FC<{text: string}> = memo(({text}) => {
    return (
        <View className="post-window-label-item">{text}
        </View>
    )
})

const AddConfirm: React.FC = memo(() => {
    const handleConfirm = () => {
        navigateTo({ url: "/pages/addSuccess/index" })
    }

    return (
        <View className="post-window-footer-confirm" onClick={handleConfirm}>
            确定
        </View>
    )
})

const ActiveWindow: React.FC<{favorNum: number, commentNum: number}> = memo(({...props}) => {
    const [isActive, setIsActive] = useState(false)
    const handleClick = () => {
        setIsActive(!isActive)
    }

    return (
        <View className="post-window-footer-active">
            <View className="post-window-footer-active-item">
                {isActive ? <Image src={favorAct} mode='widthFix' className="pwfai-img" onClick={handleClick}></Image> :
                    <Image src={favor} className="pwfai-img" onClick={handleClick}></Image>}
                {props.favorNum}
            </View>
            <View className="post-window-footer-active-item">
                <Image src={commentPic} mode="widthFix" className="pwfai-img" style={"width: 44rpx;"}></Image>
                <Text>{props.commentNum}</Text>
            </View>
        </View>
    )
})

const PostWindow: React.FC<{ WindowType: "add" | "active", setShowPostWindow: (show: boolean) => void }> = memo(({...props}) => {
    const [content, setContent] = useState("为了让大家更好地了解该活动，请介绍一下活动亮点， 活动流程和注意事项等内容......")
    const list: { src?: string, isShowDelete: boolean }[] = new Array(5).fill({ src: "", isShowDelete: false });
    const labelList: string[] = ["活动类型", "活动地点", "需要报名", "外校可见"]

    return (
        <View className="post-window">
            <View className="post-window-background"></View>
            <View className="post-window-container">
                <View className="post-window-close" onClick={() => props.setShowPostWindow(false)}>×</View>
                <View className="post-window-header">活动名称</View>
                <View className="post-window-gapline1"></View>
                <View className="post-window-content">{content}</View>
                <View className="post-window-label">
                    {labelList.map((item, index) => (
                        <Label key={index} text={item}></Label>
                    ))}
                </View>
                <View className="post-window-pic">
                    {list.map((item, index) => (
                        <Picture key={index} src={item.src} isShowDelete={item.isShowDelete}></Picture>
                    ))} 
                </View>
                <View className="post-window-gapline2"></View>
                <View className="post-window-footer">
                    {props.WindowType === "add" && <AddConfirm></AddConfirm>}
                    {props.WindowType === "active" && <ActiveWindow favorNum={111} commentNum={111}></ActiveWindow>}
                </View>
            </View>
        </View>
    )
})

export default PostWindow