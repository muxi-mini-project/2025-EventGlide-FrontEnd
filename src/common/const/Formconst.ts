import formType from "../types/FormType";

const activeOrganizerOption = ["学校", "学院", "社团", "个人"];

const activeTypeOption = ["文艺", "体育", "竞赛", "游戏", "学术"];

const activeTwoOption = ["是", "否"];

const activeSiteOption = [
  "佑铭体育馆",
  "佑铭体育场",
  "南湖综合楼",
  "桂中路",
  "博雅广场",
  "高职足球场",
  "八号楼",
  "其他",
];

const activeColor = new Map([
  ["学校", "#AF8BF5"],
  ["学院", "#B9F58C"],
  ["社团", "#F6DD8C"],
  ["个人", "#F68C8C"],
]);

const formList: formType[] = [
  {
    //0
    text: "类型",
    type: "SimpChoice",
    reminder: "请选择",
    required: true,
    options: activeTypeOption,
    disabled: true,
  },
  {
    //1
    text: "活动承办方",
    type: "SimpChoice",
    reminder: "请选择",
    required: true,
    options: activeOrganizerOption,
    disabled: true,
  },
  {
    //2
    text: "活动开始时间",
    type: "dateChoice",
    required: true,
    reminder: "请选择",
    options: [],
    disabled: true,
  },
  {
    //3
    text: "活动结束时间",
    type: "dateChoice",
    required: true,
    reminder: "请选择",
    options: [],
    disabled: true,
  },
  {
    //4
    text: "活动地点",
    type: "textInpput",
    required: true,
    reminder: "请填写",
    options: [],
    disabled: false,
  },
  {
    //5
    text: "是否需要报名",
    type: "SimpChoice",
    reminder: "请选择",
    required: true,
    options: activeTwoOption,
    disabled: true,
  },
  {
    //6
    text: "活动申报表提交",
    type: "SimpChoice",
    reminder: "请选择",
    required: false,
    options: [],
    disabled: true,
  },
  {
    //7
    text: "报名方式",
    type: "SimpChoice",
    reminder: "请填写",
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
};
