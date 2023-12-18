export default {
  pages: [
    "pages/found/index",
    "pages/recommend/index",
    "pages/me/index",
    "pages/search/index",
  ],
  requiredBackgroundModes: ["audio"],
  window: {
    backgroundTextStyle: "dark",
    navigationBarBackgroundColor: "#F8F8F8",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black",
  },
  tabBar: {
    color: "#494949",
    selectedColor: "#FA233B",
    backgroundColor: "#ffffff",
    borderStyle: "black",
    list: [
      {
        pagePath: "pages/recommend/index",
        text: "推荐",
        iconPath: "assets/images/recommend.png",
        selectedIconPath: "assets/images/recommendSelected.png",
      },
      {
        pagePath: "pages/found/index",
        text: "发现",
        iconPath: "assets/images/found.png",
        selectedIconPath: "assets/images/foundSelected.png",
      },
      {
        pagePath: "pages/me/index",
        text: "我",
        iconPath: "assets/images/me.png",
        selectedIconPath: "assets/images/meSelected.png",
      },
    ],
  },
};
