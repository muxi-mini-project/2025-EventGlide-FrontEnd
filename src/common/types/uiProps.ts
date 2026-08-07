// UI组件属性相关类型

/** ----核心组件Props---- */
export interface ModalProps {
  /** 是否显示模态框 */
  visible: boolean;
  /** 关闭回调 */
  onClose: () => void;
  /** 标题 */
  title?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  /** 点击取消按钮时触发；未传入时仅执行 onClose */
  onCancel?: () => void;
  /** 是否显示取消按钮 */
  showCancel?: boolean;
  /** 是否显示确认按钮 */
  showConfirm?: boolean;
  /** 子元素 */
  children?: React.ReactNode;
  /** 是否显示标题栏 */
  showHeader?: boolean;
  /** 是否显示内容栏 */
  showContent?: boolean;
  /** 自定义样式 */
  className?: string;
  customStyle?: React.CSSProperties;
  /** 标题栏自定义样式 */
  headerClassName?: string;
  /** 自定义底部样式 */
  customFooter?: React.ReactNode;
}

export interface DrawerProps {
  /** 是否显示抽屉 */
  visible: boolean;
  /** 关闭回调 */
  onClose: () => void;
  placement?: 'left' | 'right' | 'top' | 'bottom';
  title?: string | React.ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 自定义样式 */
  customStyle?: React.CSSProperties;
  /** 子元素 */
  children?: React.ReactNode;
  /** 是否显示标题栏 */
  showHeader?: boolean;
  /** 是否显示关闭按钮 */
  showClose?: boolean;
  /** 自定义关闭组件 */
  customCloseComponent?: React.ReactNode;
  /** 蒙版是否打开 */
  mask?: boolean;
  /** 抽屉宽度（仅在placement为left/right时有效） */
  width?: string;
  /** 抽屉高度（仅在placement为top/bottom时有效） */
  height?: string;
}

export interface ButtonProps {
  /** 如果有跳转，跳转的url */
  url?: string;
  text: string;
  backgroundColor: string;
  textColor: string;
  /** 是否显示边框 */
  isBorder: boolean;
  /** 表单提交类型，当为submit时触发表单提交 */
  formType?: 'submit' | 'reset';
}

export interface CustomInputProps {
  /** 输入框类型 */
  type?: 'text' | 'number' | 'password' | 'textarea';
  /** 输入框的值 */
  value?: string;
  /** 输入框为空时占位符 */
  placeholder?: string;
  /** 是否禁用输入框 */
  disabled?: boolean;
  /** 最大输入长度 */
  maxLength?: number;
  /** 最大高度 */
  maxHeight?: number;
  /** 是否是密码类型 */
  password?: boolean;
  /** 是否聚焦 */
  focus?: boolean;
  /** 键盘弹起时，是否自动上推页面 */
  adjustPosition?: boolean;
  /** 点击完成时，是否保持键盘不收起 */
  holdKeyboard?: boolean;
  /** 是否自动聚焦 */
  autoFocus?: boolean;
  /** 是否可清空 */
  clearable?: boolean;
  /** 是否显示字数统计 */
  showWordLimit?: boolean;
  /** 标题 */
  title?: string;
  /** 左侧图标 */
  leftIcon?: string;
  /** 右侧图标 */
  rightIcon?: string;
  /** 输入框样式 */
  inputStyle?: React.CSSProperties;
  /** 自定义样式 */
  customStyle?: React.CSSProperties;
  /** 自定义输入框包装器样式 */
  wrapperStyle?: React.CSSProperties;
  /** 自定义输入框包装器类名 */
  wrapperClassName?: string;
  /** 自定义类名 */
  className?: string;
  /** 输入时触发的事件 */
  onInput?: (value: string) => void;
  /** 聚焦时触发的事件 */
  onFocus?: (e: any) => void;
  /** 失焦时触发的事件 */
  onBlur?: (e: any) => void;
  /** 点击完成时触发的事件 */
  onConfirm?: (value: string) => void;
  /** 清空内容时触发的事件 */
  onClear?: () => void;
  /** 是否自动增高 */
  autoHeight?: boolean;
  /** 指定光标与键盘的距离 */
  cursorSpacing?: number;
  /** 是否显示键盘上方带有"完成"按钮那一栏 */
  showConfirmBar?: boolean;
  /** 光标起始位置 */
  selectionStart?: number;
  /** 光标结束位置 */
  selectionEnd?: number;
}

/** --- 二次封装组件props --- */

export interface ImagePickerProps {
  /** 是否弹出 */
  isVisiable: boolean;
  setIsVisiable: (value: boolean) => void;
  setImgUrl: (value: string[]) => void;
  imgUrl: string[];
  type: string;
  count?: number;
  isRequest?: boolean;
}

export interface ConfirmModalProps
  extends Pick<ModalProps, 'visible' | 'onClose' | 'onConfirm' | 'title'> {
  headerClassName?: string;
  /** 点击拒绝按钮时触发；关闭图标和遮罩不会触发 */
  onReject?: () => void;
}

export interface AddPeopleProps {
  id: number;
  name: string;
  number: string;
  isEditormode: boolean;
  setSelectedId: (selectId: number) => void;
  setIsVisible: (isVisible: boolean) => void;
}

export interface PictureCutProps {
  isvisible: boolean;
  imgUrl: string[];
  setImgUrl: (value: string[]) => void;
  setIsVisible: (value: boolean) => void;
  studentId: string;
}

export interface ReplyInputProps {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
  params: {
    parentId: string;
    subject: string;
    receiver?: string;
  };
  replyId?: string;
  page: string;
  comment?: boolean;
}

export interface ScrollTopProps {
  setScrollTop: (scrollTop: number) => void;
  isVisible: boolean;
  bottom?: number;
}
