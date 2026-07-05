import React, { memo } from 'react';
import './style.scss';
import { ButtonProps } from '@/common/types';
import { View, Button as TaroButton } from '@tarojs/components';
import { navigateTo, reLaunch } from '@tarojs/taro';
import classnames from 'classnames';
import Taro from '@tarojs/taro';

const Button: React.FC<ButtonProps> = memo(function ({ ...props }) {
  const handleClick = () => {
    if (props.url === '/pages/indexHome/index' || props.url === '/pages/postHome/index') {
      reLaunch({ url: props.url });
    } else if (!props.url) {
      return;
    } else if (props.url === '/pages/main/index') {
      Taro.switchTab({ url: props.url });
    } else navigateTo({ url: props.url });
  };

  // 如果是表单提交按钮，使用Taro的Button组件
  if (props.formType) {
    return (
      <TaroButton
        formType={props.formType}
        className={classnames('btn', { 'btn-border': props.isBorder })}
        style={`background-color: ${props.backgroundColor}; color: ${props.textColor};`}
      >
        {props.text}
      </TaroButton>
    );
  }

  // 普通按钮，使用自定义View实现
  return (
    <View
      className={classnames('btn', { 'btn-border': props.isBorder })}
      onClick={handleClick}
      style={`background-color: ${props.backgroundColor}; color: ${props.textColor};`}
    >
      {props.text}
    </View>
  );
});

export default Button;
