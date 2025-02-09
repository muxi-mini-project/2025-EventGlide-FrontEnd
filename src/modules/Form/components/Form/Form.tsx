import "./style.scss"
import { View, Input, Text } from "@tarojs/components"
import React, { memo, useState } from "react"
import formType from "@/common/types/FormType"
import classnames from "classnames"


interface formProps extends formType {
    id: number;
    setIsVisable: (value: boolean) => void;
    setFormIndex: (index: number) => void;
}
 

const Form: React.FC<formProps> = memo(function ({...props}) {
    // console.log(props)
    
    return (
        <View className="form" onClick={() => { props.setIsVisable(true); props.setFormIndex(props.id); }}>
            <View className="form-title-container">
                <Text className={classnames("form-title-required", { "none": !props.required })}>*</Text><Text className="form-title">{props.text}</Text>
            </View>
            <View className="form-item">
                <View className="form-item-gap"></View>
                <Input className="form-input" disabled={props.disabled} placeholder={`${props.reminder}`} onClick={() => props.setIsVisable(true)}></Input>
            </View>
        </View>
    )
})

export default Form