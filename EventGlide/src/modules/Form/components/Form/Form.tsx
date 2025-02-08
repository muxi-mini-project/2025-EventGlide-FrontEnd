import "./style.scss"
import { View, Input, Text } from "@tarojs/components"
import React, { memo, useState } from "react"
import formType from "@/common/types/FormType"
import FormWindow from "../FormWindow/FormWindow"
 

const Form: React.FC<formType> = memo(function ({...props}) {

    const [isWindowShow, setIsWindowShow] = useState(false)
    
    return (
        <View className="form">
            <View className="form-title-container">
                <Text className="form-required">*</Text><Text className="form-title">{props.text}</Text>
            </View>
            <View className="form-item">
                <View className="form-item-gap"></View>
                <Input className="form-input" placeholder={`${props.reminder}`} onClick={() => setIsWindowShow(true)}></Input>
                {isWindowShow && <FormWindow type={props.type} options={props.options} onClose={() => setIsWindowShow(false)}/>}
            </View>
        </View>
    )
})

export default Form