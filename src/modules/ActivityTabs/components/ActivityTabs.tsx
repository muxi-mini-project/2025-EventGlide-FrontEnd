import './style.scss';
import { View, Radio, RadioGroup, Input, Label, Image } from '@tarojs/components';
import { useState, memo, useEffect } from 'react';
import Taro, { navigateTo } from '@tarojs/taro';
import classnames from 'classnames';
import searchpic from '@/common/svg/Postlist/搜索.svg';
import choosestyle from '@/common/svg/Postlist/路径.svg';
import choosestyle_active from '@/common/svg/Postlist/路径-active.svg';
import gantanhaozhong from '@/common/svg/Postlist/gantanhaozhong.svg';
import useActivityStore from '@/store/ActivityStore';
import { getActivityList, searchActivityList } from '@/common/api';

const datelist = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
const typelist = ['文艺', '体育', '竞赛', '游戏', '学术'];

const ActivityTabs: React.FC<{
  setApproximateTime: (value: string) => void;
  setType: (value: string[]) => void;
  showTypeDrawer: boolean;
  setChooseDrawerVisible: (value: boolean) => void;
  chooseDrawerType: string;
  setChooseDrawerType: (value: string) => void;
  setShowColorExplain: (value: boolean) => void;
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

  /*   const handleDateClick = (index: number) => {
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
  }; */
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
            placeholder-class="input-placeholder"
            value={searchValue}
            onInput={handleInputChange}
            onConfirm={handleSearch}
            type="text"
            confirmType="search"
          />
        </View>
      </View>
      <View className="sticky-sift">
        <View
          className="sticky-sift-box"
          onClick={() => {
            props.setChooseDrawerType('dateChoice');
            props.setChooseDrawerVisible(true);
          }}
        >
          <View
            className={
              props.chooseDrawerType === 'dateChoice' && props.showTypeDrawer
                ? 'sticky-sift-text-checked'
                : 'sticky-sift-text'
            }
          >
            时间
          </View>
          <Image
            src={
              props.chooseDrawerType === 'dateChoice' && props.showTypeDrawer
                ? choosestyle_active
                : choosestyle
            }
            className="sticky-sift-icon"
            mode="widthFix"
          ></Image>
        </View>
        <View
          className="sticky-sift-box"
          onClick={() => {
            props.setChooseDrawerType('typeChoice');
            props.setChooseDrawerVisible(true);
          }}
        >
          <View
            className={
              props.chooseDrawerType === 'typeChoice' && props.showTypeDrawer
                ? 'sticky-sift-text-checked'
                : 'sticky-sift-text'
            }
          >
            类型
          </View>
          <Image
            src={
              props.chooseDrawerType === 'typeChoice' && props.showTypeDrawer
                ? choosestyle_active
                : choosestyle
            }
            className="sticky-sift-icon"
            mode="widthFix"
          ></Image>
        </View>
        <View
          className="sticky-sift-box"
          onClick={() => {
            props.setChooseDrawerType('organizerChoice');
            props.setChooseDrawerVisible(true);
          }}
        >
          <View
            className={
              props.chooseDrawerType === 'organizerChoice' && props.showTypeDrawer
                ? 'sticky-sift-text-checked'
                : 'sticky-sift-text'
            }
          >
            承办方
          </View>
          <Image
            src={
              props.chooseDrawerType === 'organizerChoice' && props.showTypeDrawer
                ? choosestyle_active
                : choosestyle
            }
            className="sticky-sift-icon"
            mode="widthFix"
          ></Image>
        </View>
        <View
          className="sticky-sift-box"
          onClick={() => {
            props.setChooseDrawerType('siteChoice');
            props.setChooseDrawerVisible(true);
          }}
        >
          <View
            className={
              props.chooseDrawerType === 'siteChoice' && props.showTypeDrawer
                ? 'sticky-sift-text-checked'
                : 'sticky-sift-text'
            }
          >
            地点
          </View>
          <Image
            src={
              props.chooseDrawerType === 'siteChoice' && props.showTypeDrawer
                ? choosestyle_active
                : choosestyle
            }
            className="sticky-sift-icon"
            mode="widthFix"
          ></Image>
        </View>
        <Image
          onClick={() => props.setShowColorExplain(true)}
          src={gantanhaozhong}
          className="sticky-sift-notice"
          mode="widthFix"
        ></Image>
      </View>
    </View>
  );
});

export default ActivityTabs;
