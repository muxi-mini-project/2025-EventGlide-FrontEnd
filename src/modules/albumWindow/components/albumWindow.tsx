import { View, PageContainer} from '@tarojs/components'
import {  memo } from'react'
import "./style.scss"
import AlbumWindowProps from '@/common/types/AlbumWindowProps'

const AlbumWindow: React.FC<AlbumWindowProps> = memo(function AlbumWindow({ isVisiable, setIsVisiable, isOverlay }) {
    return (
        <PageContainer show={isVisiable} overlay={isOverlay} position='bottom' onLeave={() => setIsVisiable(false)}
            customStyle="background-color: transparent;"  overlayStyle="background-color: rgba(0, 0, 0, 0.5);" >
            <View className='album-window-content'>
                <View className='album-window-content-btn1'>从相册中选择</View>
                <View className='album-window-content-btn2'>拍摄</View>
                <View  className='album-window-content-cancel' onClick={() => setIsVisiable(false)}>取消</View>
            </View>
        </PageContainer>
    )
})

export default AlbumWindow