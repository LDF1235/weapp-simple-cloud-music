import { Component } from "react";
import Taro from "@tarojs/taro";
import "./assets/iconfont/iconfont.css";
import "./app.css";
import { safeAreaRect } from "./module/safeAreaRect";

class App extends Component {
  componentDidMount() {}

  componentDidShow() {}

  onLaunch() {
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
