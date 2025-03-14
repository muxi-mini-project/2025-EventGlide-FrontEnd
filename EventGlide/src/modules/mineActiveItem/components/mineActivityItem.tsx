import React, { memo } from 'react';
import { View, Image } from '@tarojs/components';
import { MineActivityList } from '@/common/types/ActiveList'
import './style.scss'
import avatar from '@/common/assets/Postlist/波奇.jpg'
import favor from '@/common/assets/Postlist/images/收藏.png'
import commentpic from '@/common/assets/Postlist/评论.png'

const MineActivityItem: React.FC<MineActivityList> = memo(({ ...props }) => {
    return (
        <View className='mine-activity-container'>
            <Image className='mine-activity-avatar'  src={avatar}></Image>
            <View className='mine-activity-content'>
                <View className='mine-activity-content-uername'>{props.name}</View>
                <View className='mine-activity-content-title'>{props.title}</View>
            </View>
            <View className='mine-activity-info'>
                <View className='mine-activity-content-picture'>
                    <View className='mine-activity-content-picture-box'></View>
                    <Image className='mine-activity-content-picture-img' mode='widthFix' src={avatar}></Image>
                    <Image className='mine-activity-content-picture-img' mode='widthFix' src={avatar}></Image>
                    <Image className='mine-activity-content-picture-img' mode='widthFix' src={avatar}></Image>
                </View>
                <View className='mine-activity-content-favor'>
                    <Image className='mine-activity-content-favor-img' src={favor}></Image>
                    {props.favorite}
                </View>
                <View className='mine-activity-content-comment'>
                    <Image className='mine-activity-content-comment-img' mode='widthFix' src={commentpic}></Image>
                    {props.comment}
                </View>
            </View>
        </View>
    )
})

export default MineActivityItem;