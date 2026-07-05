import Button from '@/common/components/Button';
import { View, Image, Textarea } from '@tarojs/components';
import { useDidShow } from '@tarojs/taro';
import { useState } from 'react';
import './index.scss';
import withDoorGuard from '@/common/hoc';
import Picture from '@/common/components/Picture';
import draft from '@/common/svg/add/draft.svg';
import ConfirmModal from '@/modules/ConfirmModal';
import ImagePicker from '@/modules/ImagePicker';
import usePostStore from '@/store/PostStore';
import { createPost, loadPostDraft } from '@/common/api/PostRequest';
import Taro from '@tarojs/taro';
import { useSaveDraft } from '@/common/hooks/useSaveDraft';
import { LabelForm } from '@/common/types';
import { NavigationBarBack } from '@/common/components/NavigationBar';

const Index = () => {
  const { showImg: imgUrl } = usePostStore();
  const [isShowDraft, setIsShowDraft] = useState(false);
  const [isShowAlbum, setIsShowAlbum] = useState(false);
  const [pageImgUrl, setPageImgUrl] = useState<string[]>(imgUrl);
  const [title, setTitle] = useState('');
  const [introduce, setIntroduce] = useState('');
  const studentId = Taro.getStorageSync('sid');
  const [count, setCount] = useState(0);
  const [load, setLoad] = useState(false);
  const [isShowConfirmModal, setIsShowConfirmModal] = useState(false);
  const [draftData, setDraftData] = useState({
    title: '',
    introduce: '',
    showImg: [] as string[],
  });
  const [writing, setWriting] = useState(false);

  const { saveDraft } = useSaveDraft({
    endpoint: '/post/draft',
    onSaveSuccess: () => {
      setIsShowDraft(false);
      setDraftData({
        title,
        introduce,
        showImg: pageImgUrl,
      });
    },
    onSaveError: (error) => {
      console.error('草稿保存失败:', error);
    },
  });

  useDidShow(async () => {
    try {
      const res = await loadPostDraft();
      console.log(res);
      if (res.data === null || writing) return;
      if (res.msg === 'success') {
        const draftTitle = res.data.title || '';
        const draftIntroduce = res.data.introduce || '';
        let draftShowImg: string[] = [];

        if (Array.isArray(res.data.showImg)) {
          draftShowImg = res.data.showImg.filter((item) => item !== '');
        } else if (res.data.showImg !== '' && res.data.showImg !== null) {
          draftShowImg = [res.data.showImg];
        }

        setTitle(draftTitle);
        setIntroduce(draftIntroduce);
        setCount(draftIntroduce.length);
        setPageImgUrl(draftShowImg);
        setWriting(true);

        // 存储草稿数据
        setDraftData({
          title: draftTitle,
          introduce: draftIntroduce,
          showImg: draftShowImg,
        });
      }
    } catch (err) {
      console.log('Error loading post:', err);
    } finally {
      setLoad(true);
    }
  });

  const handleConfirm = async () => {
    if (pageImgUrl.length === 0) {
      Taro.showToast({
        title: '请上传图片',
        icon: 'none',
      });
    } else if (title.length === 0) {
      Taro.showToast({
        title: '请输入标题',
        icon: 'none',
      });
    } else if (introduce.length === 0) {
      Taro.showToast({
        title: '请输入活动介绍',
        icon: 'none',
      });
    } else {
      const postInfo = { introduce, showImg: pageImgUrl, studentId, title };
      console.log(postInfo);

      try {
        const res = await createPost({
          title: postInfo.title,
          introduce: postInfo.introduce,
          showImg: postInfo.showImg,
          studentId: postInfo.studentId,
        });
        console.log(res);
        Taro.navigateBack();
      } catch (err) {
        console.log(err);
      }
    }
  };

  const btn = {
    //url: '/pages/postHome/index',
    text: '发布',
    backgroundColor: '#7D73F0',
    textColor: '#FFFEFF',
    isBorder: false,
  };
  const btnDisabled = {
    text: '发布',
    backgroundColor: '#7D73F0',
    textColor: '#FFFEFF',
    isBorder: false,
  };

  const hasContentChanged = () => {
    if (title !== draftData.title) return true;
    if (introduce !== draftData.introduce) return true;
    if (pageImgUrl.length !== draftData.showImg.length) return true;

    for (let i = 0; i < pageImgUrl.length; i++) {
      if (pageImgUrl[i] !== draftData.showImg[i]) return true;
    }

    return false;
  };

  const handleBack = () => {
    if (hasContentChanged()) {
      setIsShowConfirmModal(true);
    } else {
      Taro.navigateBack();
    }
  };

  return (
    <>
      <NavigationBarBack
        backgroundColor="#F9F8FC"
        title="添加"
        url="/pages/mineHome/index"
        onBack={handleBack}
      />
      <View>
        {load && (
          <View className="addblog-introduce">
            <View className="addblog-introduce-container">
              <View className="addblog-introduce-container-title">{count}/1000</View>
              <View className="addblog-introduce-container-content">
                <Textarea
                  style={
                    'color: #170A1E;font-family: SimHei;min-height: 50rpx;max-height: 100rpx;resize: none;'
                  }
                  className="addblog-introduce-container-content-title"
                  value={title}
                  onInput={(e) => setTitle(e.detail.value)}
                  placeholderClass="addblog-introduce-container-content-title-placeholder"
                  placeholder="清晰名称能更好地让人注意哦~"
                  maxlength={30}
                ></Textarea>
                <Textarea
                  className="addblog-introduce-container-content-desc"
                  value={introduce}
                  onInput={(e) => {
                    setIntroduce(e.detail.value);
                    setCount(e.detail.value.length);
                  }}
                  placeholderClass="addblog-introduce-container-content-desc-placeholder"
                  placeholder="为了让大家更好地了解该活动，请介绍一下活动亮点， 活动流程和注意事项等内容......"
                  maxlength={1000}
                ></Textarea>
                <View className="addblog-introduce-container-content-pic">
                  {pageImgUrl &&
                    pageImgUrl.map((item, index) => (
                      <Picture
                        key={index}
                        src={item}
                        isShowDelete={true}
                        imgUrl={pageImgUrl}
                        setImgUrl={setPageImgUrl}
                      />
                    ))}
                  <View
                    className="addblog-introduce-container-content-pic-addblog"
                    onClick={() => setIsShowAlbum(true)}
                  >
                    +
                  </View>
                </View>
              </View>
            </View>
            <View className="addblog-introduce-floor">
              <View className="addblog-introduce-floor-draft" onClick={() => setIsShowDraft(true)}>
                <Image src={draft} mode="widthFix" style={{ width: '60rpx' }}></Image>
                <View className="addblog-introduce-floor-draft-text">存草稿</View>
              </View>
              <View className="addblog-introduce-floor-btn" onClick={() => handleConfirm()}>
                {pageImgUrl.length > 0 ? <Button {...btn} /> : <Button {...btnDisabled} />}
              </View>
            </View>
          </View>
        )}

        {/* 草稿保存modal */}
        <ConfirmModal
          title="是否保存草稿？"
          visible={isShowDraft}
          onClose={() => setIsShowDraft(false)}
          onConfirm={() =>
            saveDraft({
              title: title,
              introduce,
              showImg: pageImgUrl,
              studentId: studentId,
              labelform: {} as LabelForm,
            })
          }
          headerClassName="textmid"
        />

        <ConfirmModal
          title="您有未保存的内容，是否保存草稿？"
          visible={isShowConfirmModal}
          onClose={() => {
            Taro.navigateBack();
          }}
          onConfirm={() => {
            saveDraft({
              title: title,
              introduce,
              showImg: pageImgUrl,
              studentId: studentId,
              labelform: {} as LabelForm,
            });
            Taro.navigateBack();
          }}
        />

        <ImagePicker
          isVisiable={isShowAlbum}
          setIsVisiable={setIsShowAlbum}
          imgUrl={pageImgUrl}
          setImgUrl={setPageImgUrl}
          type={'event'}
        />
      </View>
    </>
  );
};

export default withDoorGuard(Index);
