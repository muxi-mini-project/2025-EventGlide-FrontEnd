import "./style.scss"
import { memo, useState } from "react";
import { View, PageContainer } from "@tarojs/components";
import DatePicker from "@/modules/DatePicker";

const FormWindow: React.FC<{ type: string, options: string[], isVisiable: boolean, showFormIndex: number, setIsVisiable: (isVisiable: boolean) => void }> = memo(function FormWindow({ ...props }) {
    const [selectedValue, setSelectedValue] = useState<number[]>([])
    const handleSelect = (value: number) => {
        if (selectedValue.includes(value)) {
            setSelectedValue(selectedValue.filter(item => item !== value))
        }
        else {
            setSelectedValue([...selectedValue, value])
        }
    }
    switch (props.type) {
        case "dateChoice":
            return (
                <DatePicker isVisiable={props.isVisiable} setIsVisiable={props.setIsVisiable} />
            )
        case "SimpChoice":
            return (
                <PageContainer show={props.isVisiable && props.showFormIndex !== 3} overlay={true} position="bottom" onLeave={() => props.setIsVisiable(false)}
                    customStyle="background-color: transparent;" overlayStyle="background-color: rgba(0, 0, 0, 0.5);">
                    <View className="formWindow">
                        <View className="formWindow-title">
                            <View className="formWindow-title-text">请选择</View>
                            <View className="formWindow-title-close" onClick={() => props.setIsVisiable(false)}>完成</View>
                        </View>
                    {(props.options ?? []).map((item, index) => (
                        <View key={index} className="formWindow-item">
                            <View className="formWindow-item-btn" style={{ backgroundColor: selectedValue.includes(index)? "#D8C6EF" : "#FFFFFF" }} onClick={() => handleSelect(index)}></View>
                            <View className="formWindow-item-text">{item}</View>
                        </View>
                    ))}
                    </View>
                </PageContainer>
            )
    }
})

export default FormWindow