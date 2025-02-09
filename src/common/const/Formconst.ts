import formType from "../types/FormType";


const activeOrganizerOption = [
    "学校", "学院", "社团", "个人", "外校"
];

const activeTypeOption = [
    "文艺", "体育", "竞赛", "游戏", "学术"
];

const activeTwoOption = ["是", "否"];

const activeSiteOption = [
    "佑铭体育馆", "佑铭体育场", "南湖综合楼", "桂中路", "博雅广场",
    "高职足球场", "八号楼", "其他"
]

const formList: formType[] = [
    {
        text: "类型",
        type: "SimpChoice",
        reminder: "请选择",
        required: true,
        options: activeTypeOption,
        disabled: true,
    },
    {
        text: "活动承办方",
        type: "SimpChoice",
        reminder: "请选择",
        required: true,
        options: activeOrganizerOption,
        disabled: true
    },
    {
        text: "活动时间",
        type: "dateChoice",
        required: true,
        reminder: "请选择",
        options: [],
        disabled: true
    },
    {
        text: "活动地点",
        type: "textInpput",
        required: true,
        reminder: "请填写",
        options: [],
        disabled: false
    },
    {
        text: "是否需要报名",
        type: "SimpChoice",
        reminder: "请选择",
        required: true,
        options: activeTwoOption,
        disabled: true
    },
    {
        text: "是否外校可见",
        type: "SimpChoice",
        reminder: "请选择",
        required: true,
        options: activeTwoOption,
        disabled: true
    },
    {
        text: "活动申报表提交",
        type: "SimpChoice",
        reminder: "请选择",
        required: false,
        options: [],
        disabled: true
    },
    {
        text: "报名方式",
        type: "SimpChoice",
        reminder: "请选择",
        required: false,
        options: [],
        disabled: true
    }
]

export default formList;

export { activeOrganizerOption, activeTypeOption, activeTwoOption, activeSiteOption };