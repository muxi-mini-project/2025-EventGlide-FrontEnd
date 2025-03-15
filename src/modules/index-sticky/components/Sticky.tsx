import "./style.scss";
import {
  View,
  Radio,
  RadioGroup,
  Input,
  Label,
  Image,
} from "@tarojs/components";
import { useState, memo } from "react";
import { navigateTo } from "@tarojs/taro";
import classnames from "classnames";
import searchpic from "@/common/assets/Postlist/搜索.png";

const datelist = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
const typelist = ["文艺", "体育", "竞赛", "游戏", "学术"];

const Sticky: React.FC<{
  setApproximateTime: (value: string) => void;
  setType: (value: string) => void;
}> = memo(function ({ ...props }) {
  const [checkDateIndex, setCheckDateIndex] = useState<number>(-1);
  const [checkTypeIndex, setCheckTypeIndex] = useState<number>(-1);
  const [placeholder, setPlaceholder] =
    useState<string>("在这里可以查找你想要的活动哦");
  const handleDateClick = (index: number) => {
    if (checkDateIndex === index) {
      setCheckDateIndex(-1);
      props.setApproximateTime("");
    } else {
      setCheckDateIndex(index);
      props.setApproximateTime(datelist[index]);
    }
  };
  const handleTypeClick = (index: number) => {
    if (checkTypeIndex === index) {
      setCheckTypeIndex(-1);
      props.setType("");
    } else {
      setCheckTypeIndex(index);
      props.setType(typelist[index]);
    }
  };
  const handleFocusChange = () => {
    setPlaceholder("");
  };
  const handleBlurChange = () => {
    setPlaceholder("在这里可以查找你想要的活动哦");
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
            type="text"
          />
        </View>
        <View className="search-btn">搜索</View>
      </View>
      <View className="sticky-date">
        <View className="sticky-date-line"></View>
        <RadioGroup className="sticky-date-group">
          {datelist.map((item, index) => (
            <Label
              className={classnames("date-list-view", {
                "date-checked": checkDateIndex === index,
              })}
              for={"index"}
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
            navigateTo({ url: "/pages/actScreen/index" });
          }}
        >
          筛选
        </View>
      </View>
      <View className="sticky-type">
        <RadioGroup className="sticky-type-group">
          {typelist.map((item, index) => (
            <View
              className="type-list-view-box"
              key={index}
              onClick={() => handleTypeClick(index)}
            >
              <Label
                className={classnames("type-list-view", {
                  "type-checked": checkTypeIndex === index,
                })}
                for={"index"}
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

export default Sticky;
