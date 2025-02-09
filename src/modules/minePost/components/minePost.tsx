import { memo } from "react";
import { View, ScrollView, GridView } from "@tarojs/components";
import Post from "@/modules/Post";
import "./style.scss";
import listType from "@/common/types/PostList";

const MinePost: React.FC<{ activeIndex: 'release'|'favourite' }> = memo(function ({ activeIndex }) { 
    const waterFallList: listType[] = new Array(50).fill({
        imgUrl: '波奇.jpg',
        title: '校灵通',
        content: '111',
    })
    return (
        <View className='blog-container'>
        <ScrollView type="custom">
            <GridView type="masonry" crossAxisGap={5} mainAxisGap={5}>
                {waterFallList.map((item, index) => (
                    <Post item={item} index={index} key={index} />
                ))}
            </GridView>
        </ScrollView>
    </View>
    )
})

export default MinePost;