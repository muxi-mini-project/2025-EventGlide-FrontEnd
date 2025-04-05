import { View } from "@tarojs/components";
import "./index.scss";
import {
  activeOrganizerOption,
  activeTypeOption,
  activeSiteOption,
} from "@/common/const/Formconst";
import classnames from "classnames";
import { useState } from "react";
import DatePicker from "@/modules/DatePicker";
import useActivityStore from "@/store/ActivityStore";
import { year, month, day, hour, minute } from "@/common/const/DateList";
import { switchTab, useDidShow } from "@tarojs/taro";
import {
  NavigationBar,
  NavigationBarBack,
} from "@/common/components/NavigationBar";

const Index = () => {
  const [activeOrganizer, setActiveOrganizer] = useState<number[]>([0]);
  const [activeType, setActiveType] = useState<number[]>([0]);
  const [activeSite, setActiveSite] = useState<number[]>([0]);
  const [activeOrganizerAll, setActiveOrganizerAll] = useState(false);
  const [activeTypeAll, setActiveTypeAll] = useState(false);
  const [activeSiteAll, setActiveSiteAll] = useState(false);
  const [activeSign, setActiveSign] = useState(false);
  const [activeSignText, setActiveSignText] = useState("否");
  const [isDatePickerVisiable, setIsDatePickerVisiable] = useState(false);
  const [activeYearIndex, setActiveYearIndex] = useState(0);
  const [activeMonthIndex, setActiveMonthIndex] = useState(0);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [activeHourIndex, setActiveHourIndex] = useState(0);
  const [activeMinuteIndex, setActiveMinuteIndex] = useState(0);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [timeType, setTimeType] = useState("start");

  const { setSelectInfo, setIsSelect } = useActivityStore();
  useDidShow(() => {
    setIsSelect(true);
  });

  const handleOnclick = (index: number, type: string) => {
    if (type === "organizer") {
      if (!activeOrganizer.includes(index))
        setActiveOrganizer([...activeOrganizer, index]);
      else setActiveOrganizer(activeOrganizer.filter((item) => item !== index));
    } else if (type === "type") {
      if (!activeType.includes(index)) setActiveType([...activeType, index]);
      else setActiveType(activeType.filter((item) => item !== index));
    } else if (type === "site") {
      if (!activeSite.includes(index)) setActiveSite([...activeSite, index]);
      else setActiveSite(activeSite.filter((item) => item !== index));
    }
  };
  const handleAllClick = (type: string) => {
    if (type === "organizer") {
      setActiveOrganizerAll(!activeOrganizerAll);
      setActiveOrganizer(
        activeOrganizerAll
          ? []
          : [...activeOrganizerOption.map((_, index) => index)],
      );
    } else if (type === "type") {
      setActiveTypeAll(!activeTypeAll);
      setActiveType(
        activeTypeAll ? [] : [...activeTypeOption.map((_, index) => index)],
      );
    } else if (type === "site") {
      setActiveSiteAll(!activeSiteAll);
      setActiveSite(
        activeSiteAll ? [] : [...activeSiteOption.map((_, index) => index)],
      );
    }
  };
  const handleSignClick = (type: string = "否") => {
    if (type === "否") {
      setActiveSign(false);
      setActiveSignText("否");
    } else if (type === "是") {
      setActiveSign(true);
      setActiveSignText("是");
    } else if (type === "") {
      setActiveSign(activeSign);
      setActiveSignText(activeSignText);
    }
  };
  const handlereset = () => {
    setActiveOrganizer([0]);
    setActiveType([0]);
    setActiveSite([0]);
    setActiveOrganizerAll(false);
    setActiveTypeAll(false);
    setActiveSiteAll(false);
    setActiveSign(false);
  };

  const handleConfirm = () => {
    const selectedInfo = {
      holderType: activeOrganizerOption.filter((_, index) =>
        activeOrganizer.includes(index),
      ),
      type: activeTypeOption.filter((_, index) => activeType.includes(index)),
      position: activeSiteOption.filter((_, index) =>
        activeSite.includes(index),
      ),
      if_register: activeSignText,
      detailTime: {
        startTime: startTime,
        endTime: endTime,
      },
    };
    setSelectInfo(selectedInfo);
    switchTab({ url: "/pages/indexHome/index" });
  };

  const handleTimeConfirm = (type: string) => {
    if (type === "start") {
      setStartTime(
        `${year[activeYearIndex]}-${month[activeMonthIndex]}-${day[activeDayIndex]} ${hour[activeHourIndex]}:${minute[activeMinuteIndex]}`,
      );
    } else if (type === "end") {
      setEndTime(
        `${year[activeYearIndex]}-${month[activeMonthIndex]}-${day[activeDayIndex]} ${hour[activeHourIndex]}:${minute[activeMinuteIndex]}`,
      );
    }
    setIsDatePickerVisiable(false);
  };

  return (
    <>
      <NavigationBarBack
        backgroundColor="#FFFFFF"
        title="筛选"
        url="/pages/indexHome/index"
      ></NavigationBarBack>
      <View className="actScreen-page">
        <View className="actScreen-page-container">
          <View className="actScreen-page-container-title">活动承办方</View>
          <View className="actScreen-page-container-all">
            <View className="actScreen-page-container-all-text">全选</View>
            {activeOrganizerAll === true ? (
              <View
                className="actScreen-page-container-all-radio-active"
                onClick={() => handleAllClick("organizer")}
              >
                <View className="actScreen-page-container-all-radio-active-icon"></View>
              </View>
            ) : (
              <View
                className="actScreen-page-container-all-radio"
                onClick={() => handleAllClick("organizer")}
              ></View>
            )}
          </View>
          <View className="actScreen-page-container-choice">
            {activeOrganizerOption.map((item, index) => (
              <View
                className={classnames("label", {
                  "active-label": activeOrganizer.includes(index),
                })}
                onClick={() => handleOnclick(index, "organizer")}
                key={index}
              >
                {item}
              </View>
            ))}
          </View>
        </View>
        <View className="actScreen-page-container">
          <View className="actScreen-page-container-title">活动类型</View>
          <View className="actScreen-page-container-all">
            <View className="actScreen-page-container-all-text">全选</View>
            {activeTypeAll === true ? (
              <View
                className="actScreen-page-container-all-radio-active"
                onClick={() => handleAllClick("type")}
              >
                <View className="actScreen-page-container-all-radio-active-icon"></View>
              </View>
            ) : (
              <View
                className="actScreen-page-container-all-radio"
                onClick={() => handleAllClick("type")}
              ></View>
            )}
          </View>
          <View className="actScreen-page-container-choice">
            {activeTypeOption.map((item, index) => (
              <View
                className={classnames("label", {
                  "active-label": activeType.includes(index),
                })}
                onClick={() => handleOnclick(index, "type")}
                key={index}
              >
                {item}
              </View>
            ))}
          </View>
        </View>
        <View className="actScreen-page-time">
          <View className="actScreen-page-time-title">活动时间</View>
          <View className="actScreen-page-time-choice">
            <View
              className="actScreen-page-time-choice-item"
              onClick={() => {
                setIsDatePickerVisiable(true);
                setTimeType("start");
              }}
            >
              {startTime === "" ? "请选择开始时间" : startTime}
            </View>
            <View className="actScreen-page-time-choice-text">-</View>
            <View
              className="actScreen-page-time-choice-item"
              onClick={() => {
                setIsDatePickerVisiable(true);
                setTimeType("end");
              }}
            >
              {endTime === "" ? "请选择结束时间" : endTime}
            </View>
          </View>
        </View>
        <View className="actScreen-page-container">
          <View className="actScreen-page-container-title">活动地点</View>
          <View className="actScreen-page-container-all">
            <View className="actScreen-page-container-all-text">全选</View>
            {activeSiteAll === true ? (
              <View
                className="actScreen-page-container-all-radio-active"
                onClick={() => handleAllClick("site")}
              >
                <View className="actScreen-page-container-all-radio-active-icon"></View>
              </View>
            ) : (
              <View
                className="actScreen-page-container-all-radio"
                onClick={() => handleAllClick("site")}
              ></View>
            )}
          </View>
          <View className="actScreen-page-container-choice">
            {activeSiteOption.map((item, index) => (
              <View
                className={classnames("label", {
                  "active-label": activeSite.includes(index),
                })}
                onClick={() => handleOnclick(index, "site")}
                key={index}
                style={{ fontSize: "24rpx" }}
              >
                {item}
              </View>
            ))}
          </View>
        </View>
        <View className="actScreen-page-sign">
          <View className="actScreen-page-sign-title">是否需要报名</View>
          <View className="actScreen-page-sign-choice">
            {activeSign === true ? (
              <View
                className="actScreen-page-sign-choice-active"
                onClick={() => handleSignClick("")}
              >
                <View className="actScreen-page-container-all-radio-active-icon"></View>
              </View>
            ) : (
              <View
                className="actScreen-page-sign-choice-radio"
                onClick={() => handleSignClick("是")}
              ></View>
            )}
            <View className="actScreen-page-sign-choice-text">是</View>
            {activeSign === false ? (
              <View
                className="actScreen-page-sign-choice-active"
                onClick={() => handleSignClick("")}
              >
                <View className="actScreen-page-container-all-radio-active-icon"></View>
              </View>
            ) : (
              <View
                className="actScreen-page-sign-choice-radio"
                onClick={() => handleSignClick("否")}
              ></View>
            )}
            <View className="actScreen-page-sign-choice-text">否</View>
          </View>
        </View>
        <View className="actScreen-page-floor">
          <View
            className="actScreen-page-floor-btn"
            onClick={() => handlereset()}
          >
            重置
          </View>
          <View className="actScreen-page-floor-btn" onClick={handleConfirm}>
            确定
          </View>
        </View>
      </View>
      {isDatePickerVisiable && (
        <DatePicker
          isVisiable={isDatePickerVisiable}
          setIsVisiable={setIsDatePickerVisiable}
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
          handleConfirm={handleTimeConfirm}
          timeType={timeType}
        />
      )}
    </>
  );
};

export default Index;
