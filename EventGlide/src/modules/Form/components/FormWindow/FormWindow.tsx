import "./style.scss"
import { Picker, View } from "@tarojs/components";

function FormWindow({ ...props }) {
    console.log(props)
    const state = {
        multiSelector: [
          ['饭', '粥', '粉'],
          ['猪肉', '牛肉'],
        ],
        mulitSelectorValues: [0, 1],
    };
    switch(props.type){
        case "textInput":
            return null;
        case "dateChoice":
            return (
                <Picker mode="multiSelector" range={state.multiSelector}
                    value={state.mulitSelectorValues} onChange={(e) => {console.log(e)}}>
                    <View className="picker-view"></View>
                </Picker>
            )
        case "SimpChoice":
            return (
                <div className="form-window"></div>
            )
    }
}

export default FormWindow