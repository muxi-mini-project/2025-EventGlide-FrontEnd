import "./style.scss"
import { View, Radio, RadioGroup, Input, Label, Image } from "@tarojs/components"
import { useState } from "react"
import classnames from "classnames"
import searchpic from "@/common/assets/Postlist/搜索.png"

const datelist = ["今天", "明天", "周日", "周一", "周二", "周三", "周四", "周五", "周六"]
const typelist = [
    "文艺","体育","竞赛","游戏","学术"
]

function Sticky() {
    // const [value, setValue] = useState<string>("");
    const [checkDateIndex, setCheckDateIndex] = useState<number>(0);
    const [checkTypeIndex, setCheckTypeIndex] = useState<number>(0);
    const [placeholder, setPlaceholder] = useState<string>("在这里可以查找你想要的活动哦");
    // const inputRef = useRef(null);
    const handleFocusChange = () => {
        setPlaceholder("")
    }
    const handleBlurChange = () => {
        setPlaceholder("在这里可以查找你想要的活动哦")
    }
    return (
        <View className="sticky-container">
            <View className="sticky-search">
                <View className="search-input-box">
                    <Image src={searchpic} className="gap" mode="widthFix"></Image>
                    <Input className="search-input" onFocus={handleFocusChange} onBlur={handleBlurChange} placeholder={placeholder} type="text" />
                </View>
                <View className="search-btn">搜索</View>
            </View>
            <View className="sticky-date">
                <View className="sticky-date-line"></View>
                <RadioGroup className="sticky-date-group">
                    {datelist.map((item, index) => (
                        <Label className={classnames("date-list-view", { "date-checked": checkDateIndex === index })} for={'index'} onClick={() => setCheckDateIndex(index)}><Radio className="none"  key={index}  value={item}></Radio>{item}
                        </Label>
                    ))}
                </RadioGroup>
                <View className="sticky-date-check">
                    筛选
                </View>
            </View>
            <View className="sticky-type">
                <RadioGroup className="sticky-type-group">
                    {typelist.map((item, index) => (
                        <View className="type-list-view-box" key={index} onClick={() => setCheckTypeIndex(index)}>
                            <Label className={classnames("type-list-view", { "type-checked": checkTypeIndex === index })} for={'index'}><Radio className="none" key={index}  value={item}></Radio>{item}
                            </Label>
                        </View>
                    ))}
                </RadioGroup>
            </View>
        </View>
    )
}

export default Sticky