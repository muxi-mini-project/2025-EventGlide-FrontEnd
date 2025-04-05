import { View, PageContainer, ScrollView } from "@tarojs/components";
import React, { useState, useEffect, memo } from "react";
import Taro from "@tarojs/taro";
import "./style.scss";
import classnames from "classnames";
import { year, month, day, hour, minute } from "@/common/const/DateList";

const DatePickerItem: React.FC<any> = ({
  activeIndex,
  setActiveIndex,
  list,
  type,
}) => {
  const handleScroll = (e) => {
    const scrollTop = e.detail.scrollTop;
    if (scrollTop % 52 === 0) {
      setActiveIndex(Math.floor(scrollTop / 52));
    } else if (scrollTop % 52 <= 26) {
      setActiveIndex(Math.floor(scrollTop / 52));
      Taro.nextTick(() => {
        Taro.createSelectorQuery()
          .select(`#scroll-view-${type}`)
          .node()
          .exec((res) => {
            const scrollView = res[0].node;
            if (scrollView) {
              scrollView.scrollTo({
                top: Math.floor(scrollTop / 52) * 52,
                duration: 300,
                animated: true,
              });
            }
          });
      });
    } else if (scrollTop % 52 > 26 && scrollTop % 52 < 52) {
      setActiveIndex(Math.floor(scrollTop / 52) + 1);
      Taro.nextTick(() => {
        Taro.createSelectorQuery()
          .select(`#scroll-view-${type}`)
          .node()
          .exec((res) => {
            const scrollView = res[0].node;
            if (scrollView) {
              scrollView.scrollTo({
                top: (Math.floor(scrollTop / 52) + 1) * 52,
                duration: 300,
                animated: true,
              });
            }
          });
      });
    }
  };
  return (
    <ScrollView
      id={`scroll-view-${type}`}
      scrollY={true}
      className="Scrolled-content"
      style={"height:260px"}
      usingSticky={true}
      enableFlex={true}
      scrollWithAnimation={true}
      onScroll={(e) => handleScroll(e)}
      enhanced={true}
    >
      <View
        className="Scrolled-snap"
        style={"height:52px;"}
        id="Scrolled-pos"
      ></View>
      <View className="Scrolled-item" style={"height:52px;"}></View>
      {list.map((item, index) => (
        <View
          key={index}
          className={classnames("Scrolled-item", {
            active: activeIndex === index,
          })}
          id={`item-${index}`}
          style={"height:52px;"}
        >
          {item}
        </View>
      ))}
      <View className="Scrolled-item" style={"height:52px;"}></View>
      <View className="Scrolled-item" style={"height:52px;"}></View>
    </ScrollView>
  );
};

const DatePicker: React.FC<any> = memo(
  ({
    isVisiable,
    setIsVisiable,
    handleConfirm,
    activeYearIndex,
    setActiveYearIndex,
    activeMonthIndex,
    setActiveMonthIndex,
    activeDayIndex,
    setActiveDayIndex,
    activeHourIndex,
    setActiveHourIndex,
    activeMinuteIndex,
    setActiveMinuteIndex,
    timeType,
  }) => {
    const [screenWidth, setScreenWidth] = useState(0);

    useEffect(() => {
      const systemInfo = Taro.getWindowInfo();
      setScreenWidth(systemInfo.screenWidth);
    }, []);

    return (
      <>
        <View onClick={() => setIsVisiable(true)}>打开</View>
        <PageContainer
          show={isVisiable}
          overlay={true}
          customStyle="background-color:transparent;"
          onLeave={() => setIsVisiable(false)}
        >
          <View className="Scrolled-title">
            <View
              className="Scrolled-title-text1"
              onClick={() => setIsVisiable(false)}
            >
              取消
            </View>
            <View className="Scrolled-title-text2">选择时间</View>
            <View
              className="Scrolled-title-text3"
              onClick={() => handleConfirm(timeType)}
            >
              确定
            </View>
          </View>
          <View className="Scrolled-container" style={"height: 260px;"}>
            <DatePickerItem
              activeIndex={activeYearIndex}
              setActiveIndex={setActiveYearIndex}
              list={year}
              type="year"
            />
            <DatePickerItem
              activeIndex={activeMonthIndex}
              setActiveIndex={setActiveMonthIndex}
              list={month}
              type="month"
            />
            <DatePickerItem
              activeIndex={activeDayIndex}
              setActiveIndex={setActiveDayIndex}
              list={day}
              type="day"
            />
            <DatePickerItem
              activeIndex={activeHourIndex}
              setActiveIndex={setActiveHourIndex}
              list={hour}
              type="hour"
            />
            <DatePickerItem
              activeIndex={activeMinuteIndex}
              setActiveIndex={setActiveMinuteIndex}
              list={minute}
              type="minute"
            />
          </View>
        </PageContainer>
      </>
    );
  },
);

export default DatePicker;
