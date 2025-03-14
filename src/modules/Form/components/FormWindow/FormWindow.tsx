import "./style.scss";
import { memo, useState } from "react";
import { View, PageContainer } from "@tarojs/components";
import DatePicker from "@/modules/DatePicker";
import AlbumWindow from "@/modules/albumWindow";
import { year, month, day, hour, minute } from "@/common/const/DateList";

const FormWindow: React.FC<any> = memo(function FormWindow({ ...props }) {
  const [selectedValue, setSelectedValue] = useState<number>(-1);
  const [activeYearIndex, setActiveYearIndex] = useState(0);
  const [activeMonthIndex, setActiveMonthIndex] = useState(0);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [activeHourIndex, setActiveHourIndex] = useState(0);
  const [activeMinuteIndex, setActiveMinuteIndex] = useState(0);

  const showLIst = [0, 1, 5];

  const handleSelect = (value: number) => {
    if (selectedValue === value) {
      setSelectedValue(-1);
    } else {
      setSelectedValue(value);
    }
  };

  const handleConfirm = () => {
    props.setIsVisiable(false);
    if (props.type === "dateChoice") {
      const date = `${year[activeYearIndex]}-${month[activeMonthIndex]}-${day[activeDayIndex]} ${hour[activeHourIndex]}:${minute[activeMinuteIndex]}`;
      console.log(date);
      props.setFormValue({
        ...props.formValue,
        [Object.keys(props.formValue)[props.showFormIndex]]: date,
      });
    } else if (selectedValue >= 0 && selectedValue < props.options.length) {
      const keys = Object.keys(props.formValue);
      const dynamicKey = keys[props.showFormIndex];

      props.setFormValue({
        ...props.formValue,
        [dynamicKey]: props.options[selectedValue],
      });
    }
  };
  switch (props.type) {
    case "albumChoice":
      return (
        <AlbumWindow
          isVisiable={props.isVisiable}
          setIsVisiable={props.setIsVisiable}
          imgUrl={props.activeForm}
          setImgUrl={props.setActiveForm}
          isOverlay={true}
          type="event"
        />
      );
    case "dateChoice":
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
    case "SimpChoice":
      return (
        <PageContainer
          show={props.isVisiable && showLIst.includes(props.showFormIndex)}
          overlay={true}
          position="bottom"
          onLeave={() => props.setIsVisiable(false)}
          customStyle="background-color: transparent;"
          overlayStyle="background-color: rgba(0, 0, 0, 0.5);"
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
                    backgroundColor:
                      selectedValue === index ? "#D8C6EF" : "#FFFFFF",
                  }}
                  onClick={() => handleSelect(index)}
                ></View>
                <View className="formWindow-item-text">{item}</View>
              </View>
            ))}
          </View>
        </PageContainer>
      );
  }
});

export default FormWindow;
