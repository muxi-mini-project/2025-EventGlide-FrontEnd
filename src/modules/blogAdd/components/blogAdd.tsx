import { View } from "@tarojs/components"
import "./style.scss"

const BlogAdd: React.FC<{setIsVisiable: (value: boolean) => void}> = (props) => {
    return (
        <View className="blog-add" onClick={() => props.setIsVisiable(true)}>＋</View>
    )
}

export default BlogAdd