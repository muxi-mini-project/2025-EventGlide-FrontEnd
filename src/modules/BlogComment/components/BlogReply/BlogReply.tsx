import "./style.scss"
import { View, Image } from "@tarojs/components"
import { replyType } from "@/common/types/PostList"
import { useState, memo } from "react"
import TimeTranslation from "@/common/const/TimeTranslation"

const BlogReply: React.FC<replyType> = memo(({...props}) => {
    return (
        <View className="BlogReply">
        <View className="BlogReply-content">
          <Image className="BlogReply-avatar" src={props.reply_creator.avatar} mode="scaleToFill" />
          <View className="BlogReply-info">
            <View className="BlogReply-info-name">{props.reply_creator.username?? "校灵通"}</View>
            <View className="BlogReply-info-content">{props.reply_content}</View>
            <View className="BlogReply-info-timesite">
              {TimeTranslation(props.reply_time)}&nbsp;&nbsp;{props.reply_pos}
            </View>
          </View>
        </View>
      </View>
    )
})

export default BlogReply