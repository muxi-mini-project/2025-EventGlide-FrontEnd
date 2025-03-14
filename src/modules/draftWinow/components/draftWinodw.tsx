import { View } from "@tarojs/components";
import { memo } from "react";
import "./style.scss";

const DraftWinodw: React.FC<{
  title: string;
  setIsShow: (isShow: boolean) => void;
}> = memo(({ title, setIsShow }) => {
  return (
    <View className="draftWindow">
      <View className="draftWindow-background"></View>
      <View className="draftWindow-content">
        <View
          className="draftWindow-content-mask"
          onClick={() => setIsShow(false)}
        >
          ×
        </View>
        <View className="draftWindow-content-title">{title}</View>
        <View className="draftWindow-content-line"></View>
        <View className="draftWindow-content-btn">
          <View
            className="draftWindow-content-btn-item"
            onClick={() => setIsShow(false)}
          >
            是
          </View>
          <View
            className="draftWindow-content-btn-item"
            onClick={() => setIsShow(false)}
          >
            否
          </View>
        </View>
      </View>
    </View>
  );
});

export default DraftWinodw;
