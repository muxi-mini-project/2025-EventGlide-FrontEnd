import { View, Image } from '@tarojs/components';
import { useState, memo } from 'react';
import { navigateTo, navigateBack } from '@tarojs/taro';
import './index.scss';
import withDoorGuard from '@/common/hoc';
import { AddPeopleProps } from '@/common/types';
import classnames from 'classnames';
import useSignersStore from '@/store/SignersStore';
import ConfirmModal from '@/modules/ConfirmModal';
import addlogo from '@/common/svg/add/addLogo.svg';
import deleteLogo from '@/common/svg/add/deleteLogo.svg';
import { NavigationBarBack } from '@/common/components/NavigationBar';

const AddPeopleItem: React.FC<AddPeopleProps> = memo(
  ({ id, name, number, isEditormode, setIsVisible, setSelectedId }) => {
    const handleClick = (e: any) => {
      e.stopPropagation();
      setSelectedId(id);
      setIsVisible(true);
    };

    return (
      <>
        <View
          className={classnames('addPeopleItem', 'border', {
            'border-top': id === 1,
            'border-bottom': id === 10 && isEditormode,
          })}
        >
          {isEditormode && (
            <View className="addPeopleItem-edit" onClick={(e) => handleClick(e)}>
              <Image src={deleteLogo} className="addPeopleItem-edit-img" />
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
  }
);

const Index = () => {
  const [isEditormode, setIsEditormode] = useState(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<number>(-1);
  const { signers, setRemoveSigner } = useSignersStore();

  const handleRemove = () => {
    setRemoveSigner(selectedId);
    setIsVisible(false);
  };

  return (
    <>
      <NavigationBarBack backgroundColor="#F9F8FC" title="添加" url="/pages/mineHome/index" />
      <View className="addPeopleIndex">
        <View className="addPeopleIndex-title" onClick={() => setIsEditormode(!isEditormode)}>
          {isEditormode ? '完成' : '编辑'}
        </View>
        <View className="addPeopleIndex-content">
          {signers.map((item, index) => (
            <AddPeopleItem
              key={index}
              id={index + 1}
              name={item.name}
              number={item.studentId}
              isEditormode={isEditormode}
              setSelectedId={setSelectedId}
              setIsVisible={setIsVisible}
            />
          ))}
        </View>
        {!isEditormode && (
          <View className="addPeopleIndex-add">
            <View
              className="addPeopleIndex-add-icon"
              onClick={() => navigateTo({ url: '/subpackage/addPeoplePage/index' })}
            >
              <Image src={addlogo} className="addPeopleIndex-add-icon-img" />
            </View>
            <View className="addPeopleIndex-add-text">继续添加</View>
          </View>
        )}
        <View className="addPeopleIndex-footer" onClick={() => navigateBack()}>
          完成
        </View>
        <ConfirmModal
          visible={isVisible}
          onClose={() => setIsVisible(false)}
          onConfirm={handleRemove}
          title="是否删除该申报人信息"
          headerClassName="textmid"
        />
      </View>
    </>
  );
};

export default withDoorGuard(Index);
