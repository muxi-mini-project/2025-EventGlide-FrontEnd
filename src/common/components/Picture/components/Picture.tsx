import { Image, View } from '@tarojs/components'
import { memo } from 'react'
import classnames from 'classnames'
import test from '@/common/assets/Postlist/波奇.jpg'
import './style.scss'

const Picture: React.FC<{ src?: string, isShowDelete: boolean }> = memo((props) => {
    return (
        <View className='picture'>
            <Image src={test} mode='widthFix' className='picture-img'></Image>
            <View className={classnames('picture-mask', {'none': !props.isShowDelete})}>×</View>
        </View>
    )
})

export default Picture