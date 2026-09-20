import './style.scss';
import { memo, useState, useEffect } from 'react';
import { View, Input } from '@tarojs/components';
import DatePicker from '@/modules/DatePicker';
import ImagePicker from '@/modules/ImagePicker';
import Drawer from '@/common/components/Drawer';

// formList 索引 → formValue key 的映射
const FORM_KEY_MAP: Record<number, string> = {
  0: 'type',
  1: 'holderType',
  2: 'organizerUnit',
  3: 'startTime',
  4: 'endTime',
  5: 'position',
  6: 'address',
  7: 'ifRegister',
  8: 'activeForm',
  9: 'registerMethod',
};

const FormPicker: React.FC<any> = memo(function FormPicker({ ...props }) {
  const showLIst = [0, 1, 5, 7];
  const [selectedValue, setSelectedValue] = useState<number>(-1);
  const [activeYearIndex, setActiveYearIndex] = useState(0);
  const [activeMonthIndex, setActiveMonthIndex] = useState(0);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [activeHourIndex, setActiveHourIndex] = useState(0);
  const [activeMinuteIndex, setActiveMinuteIndex] = useState(0);
  const [customPosition, setCustomPosition] = useState<string>('');

  // 切换表单字段时，从 formValue 同步 selectedValue
  useEffect(() => {
    if (showLIst.includes(props.showFormIndex)) {
      const key = FORM_KEY_MAP[props.showFormIndex];
      const val = props.formValue?.[key];
      if (val) {
        const idx = (props.options ?? []).indexOf(val);
        if (idx >= 0) {
          setSelectedValue(idx);
        } else if (props.showFormIndex === 5 && val) {
          setSelectedValue(props.options.length - 1);
          setCustomPosition(val);
        } else {
          setSelectedValue(-1);
        }
      } else {
        setSelectedValue(-1);
      }
    }
  }, [props.showFormIndex]);

  const handleSelect = (value: number) => {
    if (selectedValue === value) {
      setSelectedValue(-1);
      setCustomPosition('');
    } else {
      setSelectedValue(value);
      if (props.options[value] !== '其它') {
        setCustomPosition('');
      }
    }
  };

  const handleConfirm = (item) => {
    props.setIsVisiable(false);
    if (props.type === 'dateChoice') {
      const date = `${item.date} ${item.time}`;
      const dynamicKey = FORM_KEY_MAP[props.showFormIndex];
      props.setFormValue({
        ...props.formValue,
        [dynamicKey]: date,
      });
    } else if (props.showFormIndex === 5) {
      const dynamicKey = FORM_KEY_MAP[props.showFormIndex];
      if (selectedValue >= 0 && selectedValue < props.options.length) {
        const selectedOption = props.options[selectedValue];
        if (selectedOption === '其它') {
          if (customPosition.trim()) {
            props.setFormValue({
              ...props.formValue,
              [dynamicKey]: customPosition.trim(),
            });
          } else {
            props.setFormValue({
              ...props.formValue,
              [dynamicKey]: '其它',
            });
          }
        } else {
          props.setFormValue({
            ...props.formValue,
            [dynamicKey]: selectedOption,
          });
        }
      }
    } else if (selectedValue >= 0 && selectedValue < props.options.length) {
      const dynamicKey = FORM_KEY_MAP[props.showFormIndex];
      props.setFormValue({
        ...props.formValue,
        [dynamicKey]: props.options[selectedValue],
      });
    }
  };

  const handleCustomInput = (e: any) => {
    setCustomPosition(e.detail.value);
  };

  switch (props.type) {
    case 'albumChoice':
      return (
        <ImagePicker
          isVisiable={props.isVisiable}
          setIsVisiable={props.setIsVisiable}
          imgUrl={props.activeForm}
          setImgUrl={props.setActiveForm}
          type="event"
        />
      );
    case 'dateChoice':
      return (
        <DatePicker
          isVisiable={props.isVisiable}
          setIsVisiable={props.setIsVisiable}
          handleConfirm={handleConfirm}
          activeYearIndex={activeYearIndex}
          setActiveYearIndex={setActiveYearIndex}
          activeMonthIndex={activeMonthIndex}
          setActiveMonthIndex={setActiveMonthIndex}
          activeDayIndex={activeDayIndex}
          setActiveDayIndex={setActiveDayIndex}
          activeHourIndex={activeHourIndex}
          setActiveHourIndex={setActiveHourIndex}
          activeMinuteIndex={activeMinuteIndex}
          setActiveMinuteIndex={setActiveMinuteIndex}
        />
      );
    case 'SimpChoice':
      return (
        <Drawer
          visible={props.isVisiable && showLIst.includes(props.showFormIndex)}
          onClose={() => props.setIsVisiable(false)}
          placement="bottom"
          showHeader={false}
        >
          <View className="formWindow">
            <View className="formWindow-title">
              <View className="formWindow-title-text">请选择</View>
              <View className="formWindow-title-close" onClick={handleConfirm}>
                完成
              </View>
            </View>
            {(props.options ?? []).map((item, index) => (
              <View
                key={index}
                className="formWindow-item"
                onClick={() => handleSelect(index)}
              >
                <View
                  className="formWindow-item-btn"
                  style={{
                    backgroundColor: selectedValue === index ? '#7D73F0' : '#FFFFFF',
                  }}
                ></View>
                <View className="formWindow-item-text">{item}</View>
              </View>
            ))}
            {props.showFormIndex === 5 &&
              selectedValue >= 0 &&
              props.options[selectedValue] === '其它' && (
                <View className="formWindow-custom-input">
                  <View className="formWindow-custom-input-label">请输入地点：</View>
                  <Input
                    className="formWindow-custom-input-field"
                    placeholder="请输入自定义地点"
                    value={customPosition}
                    onInput={handleCustomInput}
                  />
                </View>
              )}
          </View>
        </Drawer>
      );
  }
});

export default FormPicker;
