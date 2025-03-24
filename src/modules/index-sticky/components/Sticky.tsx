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
import Taro, { navigateTo } from "@tarojs/taro";
import classnames from "classnames";
import searchpic from "@/common/assets/Postlist/搜索.png";
import post from "@/common/api/post";
import useActivityStore from "@/store/ActivityStore";
import get from "@/common/api/get";
import useUserStore from "@/store/userStore";

const datelist = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
const typelist = ["文艺", "体育", "竞赛", "游戏", "学术"];

const Sticky: React.FC<{
  setApproximateTime: (value: string) => void;
  setType: (value: string) => void;
}> = memo(function ({ ...props }) {
  const [checkDateIndex, setCheckDateIndex] = useState<number>(-1);
  const [checkTypeIndex, setCheckTypeIndex] = useState<number>(-1);
  const [searchValue, setSearchValue] = useState<string>("");
  const { setActiveList } = useActivityStore();
  const { studentid } = useUserStore();
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
  const handleInputChange = (e: any) => {
    setSearchValue(e.detail.value);
  }
  const handleSearch = () => {
    if (searchValue === "") {
      get(`/act/all/${studentid}`).then((res) => {
        if (res.msg === "success") {
          setActiveList(res.data);
        }
        else {
          Taro.showToast({
            title: `${res.msg}`,
            icon: "none",
            duration: 1000,
          });
        }
      });
    }
    else {
      post("/act/name", { name: searchValue }).then((res) => {
        if (res.msg === "success") {
          setActiveList(res.data);
        }
        else {
          Taro.showToast({
            title: `${res.msg}`,
            icon: "none",
            duration: 1000,
          });
        }
      });
    }
  }
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
        <View className="search-btn" onClick={handleSearch}>搜索</View>
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
            navigateTo({ url: "/subpackage/actScreen/index" });
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
