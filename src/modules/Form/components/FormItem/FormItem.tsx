import './style.scss';
import { View, Input, Text } from '@tarojs/components';
import React, { memo } from 'react';
import classnames from 'classnames';
import { FormItemType, LabelForm } from '@/common/types';
import Picture from '@/common/components/Picture';

interface FormItemProps extends FormItemType {
  id: number;
  value: string;
  formValue: LabelForm;
  activeForm: string[];
  setActiveForm: (value: string[]) => void;
  setFormValue: (value: LabelForm) => void;
  setIsVisable: (value: boolean) => void;
  setFormIndex: (index: number) => void;
}

const FormItem: React.FC<FormItemProps> = memo(function ({ ...props }) {
  const handleInput = (e: any) => {
    if (props.id === 2) props.setFormValue({ ...props.formValue, organizerUnit: e.detail.value });
    else if (props.id === 6) props.setFormValue({ ...props.formValue, address: e.detail.value });
    else if (props.id === 9)
      props.setFormValue({ ...props.formValue, registerMethod: e.detail.value });
  };
  return (
    <>
      <View className="form">
        <View className="form-title-container">
          <Text
            className={classnames('form-title-required', {
              none: !props.required,
            })}
          >
            *
          </Text>
          <Text className="form-title">{props.text}</Text>
        </View>
        <View className={props.id === 8 && props.activeForm.length !== 0 ? 'none' : 'form-item'}>
          <View className="form-item-gap"></View>
          <Input
            className="form-input"
            onInput={handleInput}
            disabled={props.disabled}
            value={props.id === 8 ? '' : props.value}
            placeholder={`${props.reminder}`}
            onClick={() => {
              props.setIsVisable(true);
              props.setFormIndex(props.id);
            }}
          ></Input>
        </View>
        <View className="form-item-img">
          {props.id === 8 && props.activeForm.length === 1 && (
            <Picture
              src={props.activeForm[0]}
              isShowDelete={true}
              size={100}
              imgUrl={props.activeForm}
              setImgUrl={props.setActiveForm}
            ></Picture>
          )}
        </View>
      </View>
    </>
  );
});

export default FormItem;
