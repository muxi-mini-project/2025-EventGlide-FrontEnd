import './style.scss';
import { memo, useEffect, useState } from 'react';
import { View } from '@tarojs/components';
import DatePicker from '@/modules/DatePicker';
import Drawer from '@/common/components/Drawer';
import {
  activeOrganizerOption,
  activeTypeOption,
  activeSiteOption,
} from '@/common/const/Formconst';
import useActivityStore from '@/store/ActivityStore';

const ActivityTypeDrawer: React.FC<any> = memo(function ActivityTypeDrawer({ ...props }) {
  const { setSelectInfo, selectedInfo } = useActivityStore();
  const [activeYearIndex, setActiveYearIndex] = useState(0);
  const [activeMonthIndex, setActiveMonthIndex] = useState(0);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [activeHourIndex, setActiveHourIndex] = useState(0);
  const [activeMinuteIndex, setActiveMinuteIndex] = useState(0);
  const [selectedIndexes, setSelectedIndexes] = useState<{
    typeChoice: string[];
    organizerChoice: string[];
    siteChoice: string[];
  }>({
    typeChoice: [],
    organizerChoice: [],
    siteChoice: [],
  });
  const choosetype = new Map<string, [string, string[]]>([
    ['typeChoice', ['选择类型', activeTypeOption]],
    ['organizerChoice', ['选择承办方', activeOrganizerOption]],
    ['siteChoice', ['选择地点', activeSiteOption]],
  ]);
  useEffect(() => {
    console.log(selectedInfo);
    setSelectedIndexes({
      typeChoice: selectedInfo.type || [],
      organizerChoice: selectedInfo.holderType || [],
      siteChoice: selectedInfo.position || [],
    });
  }, []);
  const handleSelect = (value: string, style: string) => {
    setSelectedIndexes((prev) => {
      const currentSelected = prev[style];
      let newSelected;

      if (currentSelected.includes(value)) {
        newSelected = currentSelected.filter((item) => item !== value);
      } else {
        newSelected = [...currentSelected, value];
      }

      return {
        ...prev,
        [style]: newSelected,
      };
    });
  };

  const handleConfirm = (item) => {
    if (props.type === 'dateChoice') {
      let date = `${item.date} ${item.time}`;
      if (item.date === '' || item.time === '') {
        date = '';
      }
      setSelectInfo({
        ...selectedInfo,
        detailTime: date,
      });
    } else {
      setSelectInfo({
        ...selectedInfo,
        type: selectedIndexes.typeChoice,
        position: selectedIndexes.siteChoice,
        holderType: selectedIndexes.organizerChoice,
      });
    }
    props.setType([]);
    props.setIsVisiable(false);
  };
  const reset = () => {
    if (props.type === 'typeChoice') {
      setSelectedIndexes((prev) => ({
        ...prev,
        typeChoice: [],
      }));
    } else if (props.type === 'organizerChoice') {
      setSelectedIndexes((prev) => ({
        ...prev,
        organizerChoice: [],
      }));
    } else if (props.type === 'siteChoice') {
      setSelectedIndexes((prev) => ({
        ...prev,
        siteChoice: [],
      }));
    }
  };
  if (props.type === 'dateChoice') {
    return (
      <DatePicker
        isVisiable={props.isVisiable}
        setIsVisiable={props.setIsVisiable}
        handleConfirm={handleConfirm}
        allowTimeClear={true}
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
  } else {
    return (
      <Drawer
        visible={props.isVisiable}
        onClose={() => props.setIsVisiable(false)}
        placement="bottom"
        showHeader={false}
      >
        <View className="activetype-title">{choosetype.get(props.type)?.[0] || '选择'}</View>
        <View>
          {props.type == 'siteChoice' ? (
            <View className="activetype-site">
              <View className="activetype-site-container">
                {activeSiteOption.slice(0, 4).map((option, index) => (
                  <View
                    key={index}
                    className={`activetype-site-option ${
                      selectedIndexes[props.type].includes(option) ? 'selected' : ''
                    }`}
                    onClick={() => handleSelect(option, props.type)}
                  >
                    {option}
                  </View>
                ))}
              </View>
              <View className="activetype-site-container">
                {activeSiteOption.slice(4, 8).map((option, index) => (
                  <View
                    key={index}
                    className={`activetype-site-option ${
                      selectedIndexes[props.type].includes(option) ? 'selected' : ''
                    }`}
                    onClick={() => handleSelect(option, props.type)}
                  >
                    {option}
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <View className="activetype-content">
              {(choosetype.get(props.type)?.[1] || []).map((option, index) => (
                <View
                  key={index}
                  className={`activetype-option ${
                    selectedIndexes[props.type].includes(option) ? 'selected' : ''
                  }`}
                  onClick={() => handleSelect(option, props.type)}
                >
                  {option}
                </View>
              ))}
            </View>
          )}
        </View>
        <View className="activetype-confirm">
          <View className="activetype-confirm-reset" onClick={reset}>
            重置
          </View>
          <View className="activetype-confirm-btn" onClick={handleConfirm}>
            确定
          </View>
        </View>
      </Drawer>
    );
  }
});

export default ActivityTypeDrawer;
