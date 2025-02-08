import { View, ScrollView, GridView, Image, Input } from '@tarojs/components'
// import { useState } from 'react'
import listType from '@/common/types/PostList'
import './index.scss'
import Post from '@/modules/Post/index'
import searchpic from "@/common/assets/Postlist/搜索.png"
import Info from "@/common/assets/Postlist/info.png"

const waterFallList: listType[] = new Array(50).fill({
    imgUrl: '波奇.jpg',
    title: '校灵通',
    content: '111',
})

const Index = () => {

    return (
        <View className='blog-page'>
            <View className='search-container'>
                <Image src={Info} className='info-icon' mode="widthFix"></Image>
                <View className="sticky-search">
                    <View className="search-input-box">
                        <Image src={searchpic} className="gap" mode="widthFix"></Image>
                        <Input className="search-input"  placeholder="搜索你想要的" type="text" />
                    </View>
                    <View className="search-btn">搜索</View>
                </View>
            </View>
            <View className='blog-container'>
                <ScrollView type="custom">
                    <GridView type="masonry" crossAxisGap={5} mainAxisGap={5}>
                        {waterFallList.map((item, index) => (
                            <Post item={item} index={index} key={index} />
                        ))}
                    </GridView>
                </ScrollView>
            </View>
        </View>
    )
}

export default Index