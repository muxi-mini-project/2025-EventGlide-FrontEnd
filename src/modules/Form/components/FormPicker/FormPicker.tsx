import './style.scss';
import { memo, useState, useEffect } from 'react';
import { View } from '@tarojs/components';
import DatePicker from '@/modules/DatePicker';
import ImagePicker from '@/modules/ImagePicker';
import Drawer from '@/common/components/Drawer';

// formList 索引 → formValue key 的映射
const FORM_KEY_MAP: Record<number, string> = {
  0: 'type',
  1: 'holderType',
  2: 'startTime',
  3: 'endTime',
  4: 'position',
  5: 'ifRegister',
  6: 'activeForm',
  7: 'registerMethod',
};

const FormPicker: React.FC<any> = memo(function FormPicker({ ...props }) {
  const showLIst = [0, 1, 5];
  const [selectedValue, setSelectedValue] = useState<number>(-1);
  const [activeYearIndex, setActiveYearIndex] = useState(0);
  const [activeMonthIndex, setActiveMonthIndex] = useState(0);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [activeHourIndex, setActiveHourIndex] = useState(0);
  const [activeMinuteIndex, setActiveMinuteIndex] = useState(0);

  // 切换表单字段时，从 formValue 同步 selectedValue
  useEffect(() => {
    if (showLIst.includes(props.showFormIndex)) {
      const key = FORM_KEY_MAP[props.showFormIndex];
      const val = props.formValue?.[key];
      if (val) {
        const idx = (props.options ?? []).indexOf(val);
        setSelectedValue(idx >= 0 ? idx : -1);
      } else {
        setSelectedValue(-1);
      }
    }
  }, [props.showFormIndex]);

  const handleSelect = (value: number) => {
    if (selectedValue === value) {
      setSelectedValue(-1);
    } else {
      setSelectedValue(value);
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
    } else if (selectedValue >= 0 && selectedValue < props.options.length) {
      const dynamicKey = FORM_KEY_MAP[props.showFormIndex];
      props.setFormValue({
        ...props.formValue,
        [dynamicKey]: props.options[selectedValue],
      });
    }
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
              <View key={index} className="formWindow-item">
                <View
                  className="formWindow-item-btn"
                  style={{
                    backgroundColor: selectedValue === index ? '#7D73F0' : '#FFFFFF',
                  }}
                  onClick={() => handleSelect(index)}
                ></View>
                <View className="formWindow-item-text">{item}</View>
              </View>
            ))}
          </View>
        </Drawer>
      );
  }
});

export default FormPicker;
