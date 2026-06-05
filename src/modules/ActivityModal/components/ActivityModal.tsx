import './style.scss';
import { memo } from 'react';
import Taro from '@tarojs/taro';
import { navigateTo } from '@tarojs/taro';
import useActiveInfoStore from '@/store/activeInfoStore';
import useActivityStore from '@/store/ActivityStore';
import useUserStore from '@/store/userStore';
import { createActivity } from '@/common/api/Activity';
import Modal from '@/common/components/Modal';
import ActivityContent from './ActivityContent';
import ActivityFooter from './ActivityFooter';

const ActivityModal: React.FC<{
  isShowActivityWindow: boolean;
  WindowType: 'add' | 'active';
  setShowPostWindow: (show: boolean) => void;
}> = memo(({ ...props }) => {
  const handleModalClose = () => {
    props.setShowPostWindow(false);
  };

  const { title } = useActiveInfoStore((state) => state);

  if (props.WindowType === 'add') {
    return (
      <Modal
        visible={props.isShowActivityWindow}
        title={title}
        onClose={handleModalClose}
        onConfirm={() => {
          const { studentId } = useUserStore.getState
            ? useUserStore.getState()
            : useUserStore((state) => state);
          const { introduce, title, showImg, labelform } = useActiveInfoStore.getState
            ? useActiveInfoStore.getState()
            : useActiveInfoStore((state) => state);
          const activeInfo = {
            introduce,
            labelform,
            showImg,
            studentId,
            title,
          };

          (async () => {
            try {
              const res = await createActivity({
                ...activeInfo,
              });
              if (res.msg !== 'success') {
                Taro.showToast({
                  title: `${res.msg}`,
                  icon: 'none',
                  duration: 2000,
                });
              }
              if (res.msg === 'success') {
                navigateTo({ url: '/subpackage/addSuccess/index' });
              }
            } catch (err) {
              console.log(err);
            }
          })();
        }}
        confirmText="确定"
        cancelText="取消"
      >
        <ActivityContent
          activityData={useActiveInfoStore((state) => ({
            title: state.title,
            introduce: state.introduce,
            showImg: state.showImg,
            type: state.labelform.type,
            holderType: state.labelform.holderType,
            ifRegister: state.labelform.ifRegister,
          }))}
          canDeleteImages={true}
          isDraftMode={true}
        />
      </Modal>
    );
  } else if (props.WindowType === 'active') {
    const activeItem = useActivityStore((state) => state.selectedItem);

    return (
      <Modal
        visible={props.isShowActivityWindow}
        title={activeItem.title}
        onClose={handleModalClose}
        showConfirm={false}
        showCancel={false}
        customFooter={
          <ActivityFooter
            isCollect={activeItem.isCollect}
            favorNum={activeItem.collectNum}
            commentNum={activeItem.commentNum}
            setShowPostWindow={props.setShowPostWindow}
          />
        }
      >
        <ActivityContent
          activityData={activeItem}
          canDeleteImages={false}
          isDraftMode={false}
          setShowPostWindow={props.setShowPostWindow}
        />
      </Modal>
    );
  }

  return <> </>;
});

export default ActivityModal;
