import { Component } from "react";
import Taro from "@tarojs/taro";
import "./app.css";
import { safeAreaRect } from "./module/safeAreaRect";
import { refreshLikeListIds } from "./store/userInfo";

class App extends Component {
  componentDidMount() {}

  componentDidShow() {}

  onLaunch() {
    this.initSafeArea();
    refreshLikeListIds();
  }

  initSafeArea() {
    const systemInfo = Taro.getSystemInfoSync();
    safeAreaRect.bottom = systemInfo.screenHeight - systemInfo.safeArea.bottom;
    safeAreaRect.width = systemInfo.safeArea.width;
  }

  componentDidHide() {}

  // this.props.children 是将要会渲染的页面
  render() {
    return this.props.children;
  }
}

export default App;
