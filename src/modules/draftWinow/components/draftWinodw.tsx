import { View } from '@tarojs/components';
import { memo } from 'react';
import './style.scss';
import post from '@/common/api/post';
import Taro from '@tarojs/taro';
import useUserStore from '@/store/userStore';
import LabelForm from '@/common/types/LabelForm';

const DraftWinodw: React.FC<{
  windowTitle: string;
  setIsShow: (isShow: boolean) => void;
  type: string;
  title: string;
  introduce: string;
  showImg: string[];
  labelform: LabelForm;
}> = memo(({ ...props }) => {
  const { windowTitle, setIsShow, type } = props;
  const { title, introduce, showImg, labelform } = props;
  const { studentid } = useUserStore();
  const { title: blogTitle, introduce: blogIntroduce, showImg: blogShowImg } = props;
  const handleConfirm = (type: string) => {
    if (type === 'event') {
      const data = {
        title,
        introduce,
        showImg,
        labelform,
        studentid,
      };
      console.log(data);
      post('/act/draft', data).then((res) => {
        console.log(res);
        if (res.msg === 'success') {
          Taro.showToast({
            title: `${res.msg}`,
            icon: 'success',
            duration: 1000,
          });
          setIsShow(false);
        }
      });
    } else if (type === 'blog') {
      const data = {
        title: blogTitle,
        introduce: blogIntroduce,
        showImg: blogShowImg,
        studentid,
      };
      post('/post/draft', data).then((res) => {
        Taro.showToast({
          title: `${res.msg}`,
          icon: 'success',
          duration: 1000,
        });
      });
      setIsShow(false);
    }
  };
  return (
    <View className="draftWindow">
      <View className="draftWindow-background"></View>
      <View className="draftWindow-content">
        <View className="draftWindow-content-mask" onClick={() => setIsShow(false)}>
          ×
        </View>
        <View className="draftWindow-content-title">{windowTitle}</View>
        <View className="draftWindow-content-line"></View>
        <View className="draftWindow-content-btn">
          <View className="draftWindow-content-btn-item" onClick={() => handleConfirm(type)}>
            是
          </View>
          <View className="draftWindow-content-btn-item" onClick={() => setIsShow(false)}>
            否
          </View>
        </View>
      </View>
    </View>
  );
});

export default DraftWinodw;
