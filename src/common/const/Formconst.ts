import type { FormItemType } from '../types/formTypes';

const activeOrganizerOption = ['学校', '学院', '社团', '个人'];

const activeTypeOption = ['文艺', '体育', '竞赛', '游戏', '学术'];

const activeTwoOption = ['是', '否'];

const activeSiteOption = [
  '佑铭体育场',
  '南湖综合楼',
  '七号楼',
  '八号楼',
  '博雅广场',
  '桂中路',
  '高职足球场',
  '其它',
];

const activeColor = new Map([
  ['文艺', '#F3D880'],
  ['体育', '#9DDB85'],
  ['竞赛', '#FA961D'],
  ['游戏', '#C1CBFB'],
  ['学术', '#E5ACD4'],
]);

const holdertype = new Map([
  ['学校', '校级活动'],
  ['学院', '院级活动'],
  ['社团', '社团活动'],
  ['个人', '学生承办'],
]);

const formList: FormItemType[] = [
  {
    //0
    text: '类型',
    type: 'SimpChoice',
    reminder: '请选择',
    required: true,
    options: activeTypeOption,
    disabled: true,
  },
  {
    //1
    text: '活动承办方',
    type: 'SimpChoice',
    reminder: '请选择',
    required: true,
    options: activeOrganizerOption,
    disabled: true,
  },
  {
    //2
    text: '活动承办单位',
    type: 'textInpput',
    reminder: '请输入',
    required: true,
    options: [],
    disabled: false,
  },
  {
    //3
    text: '活动开始时间',
    type: 'dateChoice',
    required: true,
    reminder: '请选择',
    options: [],
    disabled: true,
  },
  {
    //4
    text: '活动结束时间',
    type: 'dateChoice',
    required: true,
    reminder: '请选择',
    options: [],
    disabled: true,
  },
  {
    //5
    text: '活动地点',
    type: 'SimpChoice',
    reminder: '请选择',
    required: true,
    options: activeSiteOption,
    disabled: true,
  },
  {
    //6
    text: '活动地址',
    type: 'textInpput',
    reminder: '请输入',
    required: true,
    options: [],
    disabled: false,
  },
  {
    //7
    text: '是否需要报名',
    type: 'SimpChoice',
    reminder: '请选择',
    required: true,
    options: activeTwoOption,
    disabled: true,
  },
  {
    //8
    text: '活动申报表提交',
    type: 'SimpChoice',
    reminder: '请选择',
    required: false,
    options: [],
    disabled: true,
  },
  {
    //9
    text: '报名方式',
    type: 'SimpChoice',
    reminder: '请填写',
    required: false,
    options: [],
    disabled: false,
  },
];

export default formList;

export {
  activeOrganizerOption,
  activeTypeOption,
  activeTwoOption,
  activeSiteOption,
  activeColor,
  holdertype,
  formList,
};
