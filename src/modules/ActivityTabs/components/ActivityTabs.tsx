import './style.scss';
import { View, Radio, RadioGroup, Input, Label, Image } from '@tarojs/components';
import { useState, memo, useEffect } from 'react';
import Taro, { navigateTo } from '@tarojs/taro';
import classnames from 'classnames';
import searchpic from '@/common/assets/Postlist/搜索.png';
import useActivityStore from '@/store/ActivityStore';
import { getActivityList, searchActivityList } from '@/common/api';

const datelist = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
const typelist = ['文艺', '体育', '竞赛', '游戏', '学术'];

const ActivityTabs: React.FC<{
  setApproximateTime: (value: string) => void;
  setType: (value: string[]) => void;
}> = memo(function ({ ...props }) {
  const [checkDateIndex, setCheckDateIndex] = useState<number>(-1);
  const [checkTypeIndex, setCheckTypeIndex] = useState<number[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const { setActiveList, setSelectInfo, selectedInfo } = useActivityStore();
  const [placeholder, setPlaceholder] = useState<string>('在这里可以查找你想要的活动哦');

  useEffect(() => {
    const typeIndexes = selectedInfo.type
      .map((type) => typelist.indexOf(type))
      .filter((index) => index !== -1);
    setCheckTypeIndex(typeIndexes);
  }, [selectedInfo]);

  const handleDateClick = (index: number) => {
    if (checkDateIndex === index) {
      setCheckDateIndex(-1);
      props.setApproximateTime('');
    } else {
      setCheckDateIndex(index);
      props.setApproximateTime(datelist[index]);
    }
  };
  const handleTypeClick = (index: number) => {
    let newCheckTypeIndex: number[];
    if (checkTypeIndex.includes(index)) {
      newCheckTypeIndex = checkTypeIndex.filter((item) => item !== index);
    } else {
      newCheckTypeIndex = [...checkTypeIndex, index];
    }
    setCheckTypeIndex(newCheckTypeIndex);
    const selectedTypes = typelist.filter((_, idx) => newCheckTypeIndex.includes(idx));
    props.setType(selectedTypes);
    setSelectInfo({
      ...selectedInfo,
      type: selectedTypes,
    });
  };
  const handleFocusChange = () => {
    setPlaceholder('');
  };
  const handleBlurChange = () => {
    setPlaceholder('在这里可以查找你想要的活动哦');
  };
  const handleInputChange = (e: any) => {
    setSearchValue(e.detail.value);
  };
  const handleSearch = async () => {
    if (searchValue === '') {
      try {
        const res = await getActivityList();
        if (res.msg === 'success') {
          setActiveList(res.data);
        } else {
          Taro.showToast({
            title: `${res.msg}`,
            icon: 'none',
            duration: 1000,
          });
        }
      } catch (error) {
        console.error('获取活动列表失败:', error);
        Taro.showToast({
          title: '获取活动列表失败',
          icon: 'none',
          duration: 1000,
        });
      }
    } else {
      try {
        const res = await searchActivityList({ name: searchValue });
        if (res.msg === 'success') {
          setActiveList(res.data);
        } else {
          Taro.showToast({
            title: `${res.msg}`,
            icon: 'none',
            duration: 1000,
          });
        }
      } catch (error) {
        console.error('搜索活动失败:', error);
        Taro.showToast({
          title: '搜索活动失败',
          icon: 'none',
          duration: 1000,
        });
      }
    }
  };
  return (
    <View className="sticky-container">
      <View className="sticky-search">
        <View className="search-input-box">
          <Image src={searchpic} className="gap" mode="widthFix"></Image>
          <Input
            className="search-input"
            onFocus={handleFocusChange}
            onBlur={handleBlurChange}
            placeholder={placeholder}
            value={searchValue}
            onInput={handleInputChange}
            onConfirm={handleSearch}
            type="text"
          />
        </View>
        <View className="search-btn" onClick={handleSearch}>
          搜索
        </View>
      </View>
      <View className="sticky-date">
        <View className="sticky-date-line"></View>
        <RadioGroup className="sticky-date-group">
          {datelist.map((item, index) => (
            <Label
              className={classnames('date-list-view', {
                'date-checked': checkDateIndex === index,
              })}
              for={'index'}
              onClick={() => handleDateClick(index)}
            >
              <Radio className="none" key={index} value={item}></Radio>
              {item}
            </Label>
          ))}
        </RadioGroup>
        <View
          className="sticky-date-check"
          onClick={() => {
            navigateTo({ url: '/subpackage/actScreen/index' });
          }}
        >
          筛选
        </View>
      </View>
      <View className="sticky-type">
        <RadioGroup className="sticky-type-group">
          {typelist.map((item, index) => (
            <View className="type-list-view-box" key={index} onClick={() => handleTypeClick(index)}>
              <Label
                className={classnames('type-list-view', {
                  'type-checked': checkTypeIndex.includes(index),
                })}
                for={'index'}
              >
                <Radio className="none" key={index} value={item}></Radio>
                {item}
              </Label>
            </View>
          ))}
        </RadioGroup>
      </View>
    </View>
  );
});

export default ActivityTabs;
