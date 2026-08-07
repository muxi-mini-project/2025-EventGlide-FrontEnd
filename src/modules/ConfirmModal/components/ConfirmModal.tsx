import Modal from '@/common/components/Modal';
import './style.scss';
import { ConfirmModalProps } from '@/common/types';
import { memo } from 'react';

const ConfirmModal: React.FC<ConfirmModalProps> = memo(({ ...props }) => {
  const { title, visible, onClose, onConfirm, onReject, headerClassName } = props;
  return (
    <Modal
      title={title}
      visible={visible}
      onClose={onClose}
      onConfirm={onConfirm}
      onCancel={onReject}
      headerClassName={`${headerClassName || ''} confirmModal-header`}
      showContent={false}
      confirmText="是"
      cancelText="否"
    ></Modal>
  );
});

export default ConfirmModal;
