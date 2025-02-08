export default {
  pages: [
    "pages/login/index",
    "pages/indexHome/index",
    "pages/addIntroduce/index",
    "pages/addHome/index",
    "pages/blogHome/index",
    "pages/blogInfo/index",
    "pages/mineHome/index",
    "pages/mineInfo/index",
    "pages/actScreen/index",
    "pages/addLabel/index",
    "pages/addSuccess/index",
    "pages/isChecking/index",
    "pages/addPeopleIndex/index",
    "pages/addPeoplePage/index",
    "pages/album/index",
    "pages/takePic/index"],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#F9F8FC",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black",
    backgroundColor: "#F9F8FC",
  },
  tabBar: {
    color: "#C8C8C8",
    selectedColor: "#BE7CE0",
    backgroundColor: "#fff",
    borderStyle: "white",
    list: [
      {
        pagePath: "pages/indexHome/index",
        text: "首页",
        iconPath: "common/assets/tabBar/img/home.png",
        selectedIconPath: "common/assets/tabBar/img-active/home-active.png"
      },
      {
        pagePath: "pages/addHome/index",
        text: "添加",
        iconPath: "common/assets/tabBar/img/add.png",
        selectedIconPath: "common/assets/tabBar/img-active/add-active.png"
      },
      {
        pagePath: "pages/blogHome/index",
        text: "发现",
        iconPath: "common/assets/tabBar/img/blog.png",
        selectedIconPath: "common/assets/tabBar/img-active/blog-active.png"
      },
      {
        pagePath: "pages/mineHome/index",
        text: "我的",
        iconPath: "common/assets/tabBar/img/mine.png",
        selectedIconPath: "common/assets/tabBar/img-active/mine-active.png"
      }
    ]
  }
};
