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

const Index = () => {
  const [activeOrganizer, setActiveOrganizer] = useState<number[]>([0]);
  const [activeType, setActiveType] = useState<number[]>([0]);
  const [activeSite, setActiveSite] = useState<number[]>([0]);
  const [activeOrganizerAll, setActiveOrganizerAll] = useState(false);
  const [activeTypeAll, setActiveTypeAll] = useState(false);
  const [activeSiteAll, setActiveSiteAll] = useState(false);
  const [activeSign, setActiveSign] = useState(false);
  const [isDatePickerVisiable, setIsDatePickerVisiable] = useState(false);

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
          : [...activeOrganizerOption.map((item, index) => index)],
      );
    } else if (type === "type") {
      setActiveTypeAll(!activeTypeAll);
      setActiveType(
        activeTypeAll ? [] : [...activeTypeOption.map((item, index) => index)],
      );
    } else if (type === "site") {
      setActiveSiteAll(!activeSiteAll);
      setActiveSite(
        activeSiteAll ? [] : [...activeSiteOption.map((item, index) => index)],
      );
    }
  };
  const handleSignClick = () => {
    setActiveSign(!activeSign);
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

  return (
    <>
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
              onClick={() => setIsDatePickerVisiable(true)}
            >
              请选择开始时间
            </View>
            <View className="actScreen-page-time-choice-text">-</View>
            <View
              className="actScreen-page-time-choice-item"
              onClick={() => setIsDatePickerVisiable(true)}
            >
              请选择结束时间
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
                onClick={() => handleSignClick()}
              >
                <View className="actScreen-page-container-all-radio-active-icon"></View>
              </View>
            ) : (
              <View
                className="actScreen-page-sign-choice-radio"
                onClick={() => handleSignClick()}
              ></View>
            )}
            <View className="actScreen-page-sign-choice-text">是</View>
            {activeSign === false ? (
              <View
                className="actScreen-page-sign-choice-active"
                onClick={() => handleSignClick()}
              >
                <View className="actScreen-page-container-all-radio-active-icon"></View>
              </View>
            ) : (
              <View
                className="actScreen-page-sign-choice-radio"
                onClick={() => handleSignClick()}
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
          <View className="actScreen-page-floor-btn">确定</View>
        </View>
      </View>
      {isDatePickerVisiable && (
        <DatePicker
          isVisiable={isDatePickerVisiable}
          setIsVisiable={setIsDatePickerVisiable}
        />
      )}
    </>
  );
};

export default Index;
