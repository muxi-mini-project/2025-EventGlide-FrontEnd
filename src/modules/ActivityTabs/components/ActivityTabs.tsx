import './style.scss';
import { View, Input, Image } from '@tarojs/components';
import { useState, memo, useEffect } from 'react';
import Taro from '@tarojs/taro';
import searchpic from '@/common/svg/Postlist/搜索.svg';
import choosestyle from '@/common/svg/Postlist/路径.svg';
import choosestyle_active from '@/common/svg/Postlist/路径-active.svg';
import gantanhaozhong from '@/common/svg/Postlist/gantanhaozhong.svg';
import useActivityStore from '@/store/ActivityStore';
import { getActivityList, searchActivityList } from '@/common/api';

const typelist = ['文艺', '体育', '竞赛', '游戏', '学术'];

const formatArrayDisplay = (arr: string[], defaultText: string): string => {
  if (!arr || arr.length === 0) return defaultText;
  if (arr.length === 1) return arr[0];
  return `${arr[0]}等${arr.length}项`;
};

const ActivityTabs: React.FC<{
  setApproximateTime: (value: string) => void;
  showTypeDrawer: boolean;
  setChooseDrawerVisible: (value: boolean) => void;
  chooseDrawerType: string;
  setChooseDrawerType: (value: string) => void;
  setShowColorExplain: (value: boolean) => void;
  onSearch: (keyword: string) => void;
}> = memo(function ({ onSearch, ...props }) {
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
    onSearch(searchValue);
  };
  const handleCancel = () => {
    setSearchValue('');
    onSearch('');
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
          {searchValue && (
            <View className="search-cancel" onClick={handleCancel}>
              取消
            </View>
          )}
        </View>
      </View>
      <View className="sticky-sift">
        <View
          className={`sticky-sift-box ${selectedInfo.detailTime ? 'sticky-sift-box-checked' : ''}`}
          onClick={() => {
            props.setChooseDrawerType('dateChoice');
            props.setChooseDrawerVisible(true);
          }}
        >
          <View
            className={
              (selectedInfo.detailTime || (props.chooseDrawerType === 'dateChoice' && props.showTypeDrawer))
                ? 'sticky-sift-text-checked'
                : 'sticky-sift-text'
            }
          >
            {selectedInfo.detailTime || "时间"}
          </View>
          <Image
            src={
              (selectedInfo.detailTime || (props.chooseDrawerType === 'dateChoice' && props.showTypeDrawer))
                ? choosestyle_active
                : choosestyle
            }
            className="sticky-sift-icon"
            mode="widthFix"
          ></Image>
        </View>
        <View
          className={`sticky-sift-box ${selectedInfo.type.length > 0 ? 'sticky-sift-box-checked' : ''}`}
          onClick={() => {
            props.setChooseDrawerType('typeChoice');
            props.setChooseDrawerVisible(true);
          }}
        >
          <View
            className={
              (selectedInfo.type.length > 0 || (props.chooseDrawerType === 'typeChoice' && props.showTypeDrawer))
                ? 'sticky-sift-text-checked'
                : 'sticky-sift-text'
            }
          >
            {formatArrayDisplay(selectedInfo.type, "类型")}
          </View>
          <Image
            src={
              (selectedInfo.type.length > 0 || (props.chooseDrawerType === 'typeChoice' && props.showTypeDrawer))
                ? choosestyle_active
                : choosestyle
            }
            className="sticky-sift-icon"
            mode="widthFix"
          ></Image>
        </View>
        <View
          className={`sticky-sift-box ${selectedInfo.holderType.length > 0 ? 'sticky-sift-box-checked' : ''}`}
          onClick={() => {
            props.setChooseDrawerType('organizerChoice');
            props.setChooseDrawerVisible(true);
          }}
        >
          <View
            className={
              (selectedInfo.holderType.length > 0 || (props.chooseDrawerType === 'organizerChoice' && props.showTypeDrawer))
                ? 'sticky-sift-text-checked'
                : 'sticky-sift-text'
            }
          >
            {formatArrayDisplay(selectedInfo.holderType, "承办方")}
          </View>
          <Image
            src={
              (selectedInfo.holderType.length > 0 || (props.chooseDrawerType === 'organizerChoice' && props.showTypeDrawer))
                ? choosestyle_active
                : choosestyle
            }
            className="sticky-sift-icon"
            mode="widthFix"
          ></Image>
        </View>
        <View
          className={`sticky-sift-box ${selectedInfo.position.length > 0 ? 'sticky-sift-box-checked' : ''}`}
          onClick={() => {
            props.setChooseDrawerType('siteChoice');
            props.setChooseDrawerVisible(true);
          }}
        >
          <View
            className={
              (selectedInfo.position.length > 0 || (props.chooseDrawerType === 'siteChoice' && props.showTypeDrawer))
                ? 'sticky-sift-text-checked'
                : 'sticky-sift-text'
            }
          >
            {formatArrayDisplay(selectedInfo.position, "地点")}
          </View>
          <Image
            src={
              (selectedInfo.position.length > 0 || (props.chooseDrawerType === 'siteChoice' && props.showTypeDrawer))
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
