import { View } from '@tarojs/components';
import './index.scss';
import {
  activeOrganizerOption,
  activeTypeOption,
  activeSiteOption,
} from '@/common/const/Formconst';
import classnames from 'classnames';
import { useState, useEffect } from 'react';
import DatePicker from '@/modules/DatePicker';
import useActivityStore from '@/store/ActivityStore';
import { switchTab, useDidShow } from '@tarojs/taro';
import { NavigationBarBack } from '@/common/components/NavigationBar';

const Index = () => {
  const [activeOrganizer, setActiveOrganizer] = useState<number[]>([]);
  const [activeType, setActiveType] = useState<number[]>([]);
  const [activeSite, setActiveSite] = useState<number[]>([]);
  const [activeOrganizerAll, setActiveOrganizerAll] = useState(false);
  const [activeTypeAll, setActiveTypeAll] = useState(false);
  const [activeSiteAll, setActiveSiteAll] = useState(false);
  const [needSign, setNeedSign] = useState(false);
  const [notSign, setNotSign] = useState(false);
  const [signText, setSignText] = useState('');
  const [load, setLoad] = useState(false);
  const [isDatePickerVisiable, setIsDatePickerVisiable] = useState(false);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [timeType, setTimeType] = useState('start');

  const { setSelectInfo, setIsSelect, selectedInfo } = useActivityStore();
  useDidShow(() => {
    console.log(selectedInfo);
    if (selectedInfo) {
      const organizerIndexes = selectedInfo.holderType
        .map((type) => activeOrganizerOption.indexOf(type))
        .filter((index) => index !== -1);
      setActiveOrganizer(organizerIndexes.length > 0 ? organizerIndexes : []);
      setActiveOrganizerAll(organizerIndexes.length === activeOrganizerOption.length);

      const typeIndexes = selectedInfo.type
        .map((type) => activeTypeOption.indexOf(type))
        .filter((index) => index !== -1);
      setActiveType(typeIndexes.length > 0 ? typeIndexes : []);
      setActiveTypeAll(typeIndexes.length === activeTypeOption.length);

      const siteIndexes = selectedInfo.position
        .map((type) => activeSiteOption.indexOf(type))
        .filter((index) => index !== -1);
      setActiveSite(siteIndexes.length > 0 ? siteIndexes : []);
      setActiveSiteAll(siteIndexes.length === activeSiteOption.length);

      setSignText(selectedInfo.ifRegister);
      if (selectedInfo.ifRegister === '否') {
        setNeedSign(false);
        setNotSign(true);
      } else if (selectedInfo.ifRegister === '是') {
        setNeedSign(true);
        setNotSign(false);
      } else {
        setNeedSign(false);
        setNotSign(false);
      }

      setStartTime(selectedInfo.detailTime?.startTime || '');
      setEndTime(selectedInfo.detailTime?.endTime || '');
    }
    setLoad(true);
  });

  /*useEffect(() => {
    const updatedInfo = {
      holderType: activeOrganizerOption.filter((_, index) => activeOrganizer.includes(index)),
      type: activeTypeOption.filter((_, index) => activeType.includes(index)),
      position: activeSiteOption.filter((_, index) => activeSite.includes(index)),
      ifRegister: signText,
      detailTime: {
        startTime: startTime,
        endTime: endTime,
      },
    };
    console.log(updatedInfo);
    if (load) setSelectInfo(updatedInfo);
  }, [activeOrganizer, activeType, activeSite, signText, startTime, endTime]);*/

  const handleOnclick = (index: number, type: string) => {
    if (type === 'organizer') {
      if (!activeOrganizer.includes(index)) setActiveOrganizer([...activeOrganizer, index]);
      else setActiveOrganizer(activeOrganizer.filter((item) => item !== index));
    } else if (type === 'type') {
      if (!activeType.includes(index)) setActiveType([...activeType, index]);
      else setActiveType(activeType.filter((item) => item !== index));
    } else if (type === 'site') {
      if (!activeSite.includes(index)) setActiveSite([...activeSite, index]);
      else setActiveSite(activeSite.filter((item) => item !== index));
    }
  };
  const handleAllClick = (type: string) => {
    if (type === 'organizer') {
      setActiveOrganizerAll(!activeOrganizerAll);
      setActiveOrganizer(
        activeOrganizerAll ? [] : [...activeOrganizerOption.map((_, index) => index)]
      );
    } else if (type === 'type') {
      setActiveTypeAll(!activeTypeAll);
      setActiveType(activeTypeAll ? [] : [...activeTypeOption.map((_, index) => index)]);
    } else if (type === 'site') {
      setActiveSiteAll(!activeSiteAll);
      setActiveSite(activeSiteAll ? [] : [...activeSiteOption.map((_, index) => index)]);
    }
  };
  const handleSignClick = (type: number = 0) => {
    if (type === 0) {
      setNeedSign(!needSign);
      setNotSign(false);
      if (signText === '是') {
        setSignText('');
      } else {
        setSignText('是');
      }
    } else {
      setNotSign(!notSign);
      setNeedSign(false);
      if (signText === '否') {
        setSignText('');
      } else {
        setSignText('否');
      }
    }
  };
  const handlereset = () => {
    setActiveOrganizer([]);
    setActiveType([]);
    setActiveSite([]);
    setActiveOrganizerAll(false);
    setActiveTypeAll(false);
    setActiveSiteAll(false);
    setNeedSign(false);
    setNotSign(false);
    setSignText('');
    setStartTime('');
    setEndTime('');
    //setIsSelect(false);
  };

  const handleConfirm = () => {
    const selectedInfo = {
      holderType: activeOrganizerOption.filter((_, index) => activeOrganizer.includes(index)),
      type: activeTypeOption.filter((_, index) => activeType.includes(index)),
      position: activeSiteOption.filter((_, index) => activeSite.includes(index)),
      ifRegister: signText,
      detailTime: {
        startTime: startTime,
        endTime: endTime,
      },
    };
    setIsSelect(true);
    setSelectInfo(selectedInfo);
    switchTab({ url: '/pages/indexHome/index' });
    console.log(selectedInfo);
  };

  const handleTimeConfirm = (item) => {
    if (timeType === 'start') {
      setStartTime(`${item.date}-${item.time}`);
    } else if (timeType === 'end') {
      setEndTime(`${item.date}-${item.time}`);
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
                onClick={() => handleAllClick('organizer')}
              >
                <View className="actScreen-page-container-all-radio-active-icon"></View>
              </View>
            ) : (
              <View
                className="actScreen-page-container-all-radio"
                onClick={() => handleAllClick('organizer')}
              ></View>
            )}
          </View>
          <View className="actScreen-page-container-choice">
            {activeOrganizerOption.map((item, index) => (
              <View
                className={classnames('label', {
                  'active-label': activeOrganizer.includes(index),
                })}
                onClick={() => handleOnclick(index, 'organizer')}
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
                onClick={() => handleAllClick('type')}
              >
                <View className="actScreen-page-container-all-radio-active-icon"></View>
              </View>
            ) : (
              <View
                className="actScreen-page-container-all-radio"
                onClick={() => handleAllClick('type')}
              ></View>
            )}
          </View>
          <View className="actScreen-page-container-choice">
            {activeTypeOption.map((item, index) => (
              <View
                className={classnames('label', {
                  'active-label': activeType.includes(index),
                })}
                onClick={() => handleOnclick(index, 'type')}
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
                setTimeType('start');
              }}
            >
              {startTime === '' ? '请选择开始时间' : startTime}
            </View>
            <View className="actScreen-page-time-choice-text">-</View>
            <View
              className="actScreen-page-time-choice-item"
              onClick={() => {
                setIsDatePickerVisiable(true);
                setTimeType('end');
              }}
            >
              {endTime === '' ? '请选择结束时间' : endTime}
            </View>
          </View>
        </View>
        <View className="actScreen-page-sign">
          <View className="actScreen-page-sign-title">是否需要报名</View>
          <View className="actScreen-page-sign-choice">
            {needSign ? (
              <View
                className="actScreen-page-sign-choice-active"
                onClick={() => handleSignClick(0)}
              >
                <View className="actScreen-page-container-all-radio-active-icon"></View>
              </View>
            ) : (
              <View
                className="actScreen-page-sign-choice-radio"
                onClick={() => handleSignClick(0)}
              ></View>
            )}
            <View className="actScreen-page-sign-choice-text">是</View>
            {notSign ? (
              <View
                className="actScreen-page-sign-choice-active"
                onClick={() => handleSignClick(1)}
              >
                <View className="actScreen-page-container-all-radio-active-icon"></View>
              </View>
            ) : (
              <View
                className="actScreen-page-sign-choice-radio"
                onClick={() => handleSignClick(1)}
              ></View>
            )}
            <View className="actScreen-page-sign-choice-text">否</View>
          </View>
        </View>
        <View className="actScreen-page-floor">
          <View className="actScreen-page-floor-btn" onClick={() => handlereset()}>
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
          handleConfirm={handleTimeConfirm}
          timeType={timeType}
        />
      )}
    </>
  );
};

export default Index;
