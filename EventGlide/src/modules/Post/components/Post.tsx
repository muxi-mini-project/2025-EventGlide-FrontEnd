import "./style.scss"
import { View, Image, Text } from "@tarojs/components"
import img1 from "@/common/assets/Postlist/波奇.jpg"
import img2 from "@/common/assets/Postlist/11.jpg"
import pic from "@/common/assets/Postlist/波奇.jpg"
import favorite from "@/common/assets/Postlist/images/点赞1.png"
import favoriteActive from "@/common/assets/Postlist/images-active/点赞1-active.png"
import { memo, useState } from "react"

const Post: React.FC<any> = memo(function ({ item, index }) {
  const [isFavorite, setIsFavorite] = useState(false)
  // console.log(item);
  if (!item) {
    return null
  }
  let img;
  if (index % 6 === 0 || index % 4 === 0) {
    img = img1;
  }
  else if (index % 2 === 0) {
    img = img2;
  }
  else {
    img = img2;
  }
  // console.log(img);
  return (
    <View className="post-container" >
      <Image className="img" mode="widthFix" lazyLoad={true} src={img} ></Image>
      <View className="content">
        <View className="title-container">
          <View className="post-user">
            <Image className="avatar" src={pic} mode="widthFix"></Image>
            <Text className="username">{item.title}</Text>
          </View>
          <View className="post-favorite">
            <Image className="avatar" src={isFavorite ? favoriteActive : favorite} mode="widthFix" onClick={() => setIsFavorite(!isFavorite)}></Image>
            <View className="count">{item.content}</View>
          </View>
        </View>
      </View>
    </View>
  )
})

export default Post