import { View } from "@tarojs/components";
import { useState, memo } from "react";
import { navigateTo, navigateBack } from "@tarojs/taro";
import "./index.scss";
import AddPeopleProps from "@/common/types/AddPeopleProps";
import classnames from "classnames";
import useSignersStore from "@/store/SignersStore";

const AddPeopleItem: React.FC<AddPeopleProps> = memo(
  ({ id, name, number, isEditormode }) => {
    const { setRemoveSigner } = useSignersStore();
    const handleRemove = () => {
      setRemoveSigner(id);
    };
    return (
      <>
        <View
          className={classnames("addPeopleItem", "border", {
            "border-top": id === 1,
            "border-bottom": id === 10 && isEditormode,
          })}
        >
          {isEditormode && (
            <View className="addPeopleItem-edit" onClick={handleRemove}>
              －
            </View>
          )}
          <View className="addPeopleItem-id">{id}</View>
          <View className="addPeopleItem-info">
            <View className="addPeopleItem-info-name">{name}</View>
            <View className="addPeopleItem-info-number">{number}</View>
          </View>
        </View>
      </>
    );
  },
);

const Index = () => {
  const [isEditormode, setIsEditormode] = useState(false);
  const { signers } = useSignersStore();

  return (
    <View className="addPeopleIndex">
      <View
        className="addPeopleIndex-title"
        onClick={() => setIsEditormode(!isEditormode)}
      >
        {isEditormode ? "完成" : "编辑"}
      </View>
      <View className="addPeopleIndex-content">
        {signers.map((item, index) => (
          <AddPeopleItem
            key={index}
            id={index + 1}
            name={item.name}
            number={item.studentId}
            isEditormode={isEditormode}
          />
        ))}
      </View>
      {!isEditormode && (
        <View className="addPeopleIndex-add">
          <View
            className="addPeopleIndex-add-icon"
            onClick={() => navigateTo({ url: "/pages/addPeoplePage/index" })}
          >
            +
          </View>
          <View className="addPeopleIndex-add-text">继续添加</View>
        </View>
      )}
      <View className="addPeopleIndex-footer" onClick={() => navigateBack()}>
        完成
      </View>
    </View>
  );
};

export default Index;
