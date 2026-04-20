import { View, Image } from '@tarojs/components';
import { reLaunch } from '@tarojs/taro';
import { useState, useEffect } from 'react';
import Taro from '@tarojs/taro';
import './index.scss';
import schoolSrc from '@/common/svg/mineInfo/学校.svg';
import departmentSrc from '@/common/svg/mineInfo/院系.svg';
import cardSrc from '@/common/svg/mineInfo/一卡通号.svg';
import useUserStore from '@/store/userStore';
import ImagePicker from '@/modules/ImagePicker';
import { post } from '@/common/api/request';
import { NavigationBarBack } from '@/common/components/NavigationBar';
import PictureCut from '@/modules/picturecut/components/picturecut';
import Modal from '@/common/components/Modal';
import CustomInput from '@/common/components/CustomInput';

const Index = () => {
  const {
    studentId: studentId,
    username,
    school,
    college,
    avatar,
  } = useUserStore((state) => state);
  const { setUsername } = useUserStore();
  const [inputValue, setInputValue] = useState('');
  const [isVisiable, setIsVisiable] = useState(false);
  const [imgUrl, setImgUrl] = useState<string[]>([avatar]);
  const [cutImgUrl, setCutImgUrl] = useState<string[]>([]);
  const [isCutVisible, setIsCutVisible] = useState(false);
  const [isRenameVisible, setIsRenameVisible] = useState<boolean>(false);

  const handleInputChange = (e: any) => {
    setInputValue(e.detail.value);
  };

  const handleConfirm = async () => {
    if (!inputValue) {
      Taro.showToast({ title: '昵称不能为空', icon: 'none' });
      return;
    } else {
      try {
        const res = await post('/user/username', { newName: inputValue, studentId: studentId });
        console.log(res);
        setUsername(inputValue);
      } catch (error) {
        console.error('更新昵称失败:', error);
        Taro.showToast({ title: '更新昵称失败', icon: 'none' });
      }
      setIsRenameVisible(false);
      setInputValue('');
    }
  };

  const handleLogOut = async () => {
    try {
      const res = await post('/user/logout');
      console.log(res);
      if (res.msg === 'success') {
        Taro.showToast({ title: '退出成功', icon: 'success' });
        Taro.removeStorageSync('token');
        reLaunch({ url: '/pages/login/index' });
      }
    } catch (error) {
      console.error('退出登录失败:', error);
      Taro.showToast({ title: '退出登录失败', icon: 'none' });
    }
  };

  useEffect(() => {
    console.log(cutImgUrl);
    if (cutImgUrl.length > 0) {
      setIsCutVisible(true);
    }
  }, [cutImgUrl]);

  return (
    <>
      <NavigationBarBack backgroundColor="#FFFFFF" title="账号设置" url="/pages/mineHome/index" />
      <View className="userProfile-page">
        <View className="userProfile-user">
          <View className="userProfile-container-top">
            <View className="userProfile-container-column">头像</View>
            <View className="userProfile-container-avatar">
              <Image
                className="userProfile-container-img"
                style={'border-radius: 50%;height: 80rpx;width: 80rpx;background-color: #F9F8FC;'}
                mode="aspectFill"
                src={imgUrl[0]}
                onClick={() => setIsVisiable(true)}
              />
            </View>
          </View>
          <View className="userProfile-container-bottom">
            <View className="userProfile-container-column">昵称</View>
            <View className="userProfile-container-desc" onClick={() => setIsRenameVisible(true)}>
              {username ? username : '点击设置昵称'}
            </View>
          </View>
        </View>
        <View className="userProfile-desc">
          <View className="userProfile-container-top">
            <View className="userProfile-container-column">实名信息</View>
          </View>
          <View className="userProfile-container">
            <View className="userProfile-container-column">
              <Image className="userProfile-container-icon" mode="widthFix" src={schoolSrc} />
              学校
            </View>
            <View className="userProfile-container-desc">{school}</View>
          </View>
          <View className="userProfile-container">
            <View className="userProfile-container-column">
              <Image className="userProfile-container-icon" mode="widthFix" src={departmentSrc} />
              院系
            </View>
            <View className="userProfile-container-desc">{college ? college : '未获取'}</View>
          </View>
          <View className="userProfile-container-bottom">
            <View className="userProfile-container-column">
              <Image className="userProfile-container-icon" mode="widthFix" src={cardSrc} />
              一卡通号
            </View>
            <View className="userProfile-container-desc">{studentId}</View>
          </View>
        </View>
        <View className="userProfile-floor-btn" onClick={() => handleLogOut()}>
          退出登录
        </View>
      </View>
      <ImagePicker
        isVisiable={isVisiable}
        setIsVisiable={setIsVisiable}
        imgUrl={imgUrl}
        setImgUrl={setCutImgUrl}
        type="event"
        count={1}
        isRequest={true}
      />

      <Modal
        visible={isRenameVisible}
        showHeader={false}
        onConfirm={handleConfirm}
        onClose={() => setIsRenameVisible(false)}
      >
        <CustomInput
          className="userProfile-container-input"
          wrapperStyle={{ border: 'none' }}
          value={inputValue}
          onInput={handleInputChange}
          onConfirm={handleConfirm}
          maxLength={7}
        />
      </Modal>

      {cutImgUrl.length > 0 && (
        <PictureCut
          isvisible={isCutVisible}
          imgUrl={cutImgUrl}
          setImgUrl={setImgUrl}
          setIsVisible={setIsCutVisible}
          studentId={studentId}
        />
      )}
    </>
  );
};

export default Index;
