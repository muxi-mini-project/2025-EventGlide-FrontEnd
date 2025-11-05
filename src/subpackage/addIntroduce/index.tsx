import Button from '@/common/components/Button';
import { View, Image, Input, Textarea } from '@tarojs/components';
import { useEffect, useState } from 'react';
import './index.scss';
import Taro from '@tarojs/taro';
import Picture from '@/common/components/Picture';
import draft from '@/common/svg/add/draft.svg';
import DraftWinodw from '@/modules/draftWinow';
import AlbumWindow from '@/modules/albumWindow';
import useActiveInfoStore from '@/store/activeInfoStore';
import { useDidShow } from '@tarojs/taro';
import get from '@/common/api/get';
import LabelForm from '@/common/types/LabelForm';

const Index = () => {
  const [isShowDraft, setIsShowDraft] = useState(false);
  const [isShowAlbum, setIsShowAlbum] = useState(false);
  const [imgUrl, setImgUrl] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { setBasicInfo } = useActiveInfoStore();
  const [count, setCount] = useState(0);

  useDidShow(() => {
    get('/act/load').then((res) => {
      if (res.msg === 'success') {
        console.log(res.data);
        setTitle(title || res.data.Title);
        setDescription(description || res.data.Introduce);
        if (Array.isArray(res.data.ShowImg)) {
          setImgUrl(res.data.ShowImg);
        } else if (typeof res.data.ShowImg === 'string' && res.data.ShowImg !== '') {
          setImgUrl([res.data.ShowImg]);
        } else {
          setImgUrl([]);
        }
        setCount(res.data.Introduce?.length || 0);
      }
    });
  });

  const btn = {
    // url: "",
    text: '下一步',
    backgroundColor: '#CF79FA',
    textColor: '#FFFEFF',
    isBorder: false,
  };
  const handleNextClick = () => {
    if (!title.trim() && !description.trim()) {
      Taro.showToast({
        title: '请填写活动标题和活动内容',
        icon: 'none',
        duration: 2000,
      });
      return;
    }
    if (!title.trim()) {
      Taro.showToast({
        title: '请填写活动标题',
        icon: 'none',
        duration: 2000,
      });
      return;
    }
    if (!description.trim()) {
      Taro.showToast({
        title: '请填写活动内容',
        icon: 'none',
        duration: 2000,
      });
      return;
    }
    Taro.navigateTo({
      url: '/subpackage/addLabel/index',
    });
    setBasicInfo(title, description, imgUrl);
  };

  return (
    <>
      <View className="add-introduce">
        <View className="add-introduce-container">
          <View className="add-introduce-container-title">{count}/1000</View>
          <View className="add-introduce-container-content">
            <Input
              style={'font-size: 44rpx;color: #170A1E;font-family: SimHei;height: 50rpx;'}
              className="add-introduce-container-content-title"
              value={title}
              onInput={(e) => setTitle(e.detail.value)}
              placeholderClass="add-introduce-container-content-title-placeholder"
              placeholder="清晰名称能更好地让人注意哦~"
              maxlength={30}
            ></Input>
            <Textarea
              className="add-introduce-container-content-desc"
              value={description}
              onInput={(e) => {
                const value = e.detail.value;
                setDescription(value);
                setCount(value.length);
              }}
              placeholderClass="add-introduce-container-content-desc-placeholder"
              placeholder="为了让大家更好地了解该活动，请介绍一下活动亮点， 活动流程和注意事项等内容......"
              maxlength={1000}
            ></Textarea>
            <View className="add-introduce-container-content-pic">
              {imgUrl &&
                imgUrl.map((item, index) => (
                  <Picture
                    key={index}
                    src={item}
                    isShowDelete={true}
                    imgUrl={imgUrl}
                    setImgUrl={setImgUrl}
                  />
                ))}
              <View
                className="add-introduce-container-content-pic-add"
                onClick={() => setIsShowAlbum(true)}
              >
                +
              </View>
            </View>
          </View>
        </View>
        <View className="add-introduce-floor">
          <View className="add-introduce-floor-draft" onClick={() => setIsShowDraft(true)}>
            <Image src={draft} mode="widthFix" style={{ width: '60rpx' }}></Image>
            <View className="add-introduce-floor-draft-text">存草稿</View>
          </View>
          <View className="add-introduce-floor-btn" onClick={handleNextClick}>
            <Button {...btn} />
          </View>
        </View>
      </View>
      {isShowDraft && (
        <DraftWinodw
          windowTitle="是否保存草稿？"
          setIsShow={setIsShowDraft}
          type="event"
          title={title}
          introduce={description}
          showImg={imgUrl}
          labelform={{} as LabelForm}
        />
      )}
      {isShowAlbum && (
        <AlbumWindow
          isVisiable={isShowAlbum}
          setIsVisiable={setIsShowAlbum}
          isOverlay={true}
          imgUrl={imgUrl}
          setImgUrl={setImgUrl}
          type={'event'}
        />
      )}
    </>
  );
};

export default Index;
