import React, { memo } from 'react';
import "./style.scss"
import BtnType from '@/common/types/BtnType';
import { View } from '@tarojs/components';
import { navigateTo, reLaunch } from '@tarojs/taro';
import classnames from 'classnames';


const Button: React.FC<BtnType> = memo(function ({ ...props }) {

    const handleClick = () => {
        if (props.url === "/pages/indexHome/index" || props.url === "/pages/blogHome/index") {
            reLaunch({ url: props.url })
        }
        else if (!props.url) {
            return;
        }    
        else
            navigateTo({ url: props.url })
    } 

    return (
        <View className={classnames("btn", {'btn-border': props.isBorder})} onClick={handleClick} style={`background-color: ${props.backgroundColor}; color: ${props.textColor};`}>{props.text}</View>
    )
})

export default Button;
