import { View, Input, Textarea, Text } from '@tarojs/components';
import { memo, useState, useEffect } from 'react';
import './style.scss';
import { CustomInputProps } from '@/common/types';

const CustomInput: React.FC<CustomInputProps> = memo(({ ...props }) => {
  const {
    type = 'text',
    value = '',
    placeholder,
    disabled = false,
    maxLength = 140,
    maxHeight = 120,
    password = false,
    focus = false,
    adjustPosition = true,
    holdKeyboard = false,
    autoFocus = false,
    clearable = false,
    showWordLimit = false,
    title,
    leftIcon,
    rightIcon,
    inputStyle,
    customStyle,
    wrapperStyle,
    wrapperClassName = '',
    className = '',
    onInput,
    onFocus,
    onBlur,
    onConfirm,
    onClear,
    autoHeight,
    cursorSpacing,
    showConfirmBar,
    selectionStart,
    selectionEnd,
  } = props;

  const [innerValue, setInnerValue] = useState(value);

  useEffect(() => {
    if (typeof value !== 'undefined') {
      setInnerValue(value);
    }
  }, [value]);

  const handleInput = (e: any) => {
    const newValue = e.detail.value;
    setInnerValue(newValue);
    if (onInput) {
      onInput(e);
    }
  };

  const handleClear = () => {
    setInnerValue('');
    if (onInput) {
      onInput('');
    }
    if (onClear) {
      onClear();
    }
  };

  const handleFocus = (e: any) => {
    if (onFocus) {
      onFocus(e);
    }
  };

  const handleBlur = (e: any) => {
    if (onBlur) {
      onBlur(e);
    }
  };

  const handleConfirm = (e: any) => {
    if (onConfirm) {
      onConfirm(e.detail.value);
    }
  };

  // 根据类型渲染不同的输入组件
  const renderInputField = () => {
    if (type === 'textarea') {
      return (
        <Textarea
          value={innerValue}
          placeholder={placeholder}
          disabled={disabled}
          maxlength={maxLength}
          focus={focus}
          autoHeight={autoHeight}
          adjustPosition={adjustPosition}
          showConfirmBar={showConfirmBar}
          selectionStart={selectionStart}
          selectionEnd={selectionEnd}
          cursorSpacing={cursorSpacing}
          onInput={handleInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onConfirm={handleConfirm}
          className="custom-input-field custom-textarea-field"
          style={{ maxHeight: `${maxHeight}px`, ...inputStyle }}
        />
      );
    } else {
      return (
        <Input
          type={type === 'password' ? 'text' : type}
          password={password || type === 'password'}
          value={innerValue}
          placeholder={placeholder}
          disabled={disabled}
          maxlength={maxLength}
          focus={focus}
          adjustPosition={adjustPosition}
          holdKeyboard={holdKeyboard}
          autoFocus={autoFocus}
          onInput={handleInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onConfirm={handleConfirm}
          className="custom-input-field"
          style={{ maxHeight: `${maxHeight}px`, ...inputStyle }}
        />
      );
    }
  };

  return (
    <View className={`custom-input ${className}`} style={customStyle}>
      {title && <Text className="custom-input-title">{title}</Text>}
      <View className={`custom-input-wrapper ${wrapperClassName}`} style={wrapperStyle}>
        {leftIcon && (
          <View className="custom-input-left-icon">
            <Text>{leftIcon}</Text>
          </View>
        )}
        {renderInputField()}
        {clearable && innerValue && (
          <View className="custom-input-clear" onClick={handleClear}>
            <Text className="custom-input-clear-icon">×</Text>
          </View>
        )}
        {showWordLimit && (
          <View className="custom-input-limit">
            <Text className="custom-input-limit-text">
              {innerValue.length}/{maxLength}
            </Text>
          </View>
        )}
        {rightIcon && (
          <View className="custom-input-right-icon">
            <Text>{rightIcon}</Text>
          </View>
        )}
      </View>
    </View>
  );
});

export default CustomInput;
