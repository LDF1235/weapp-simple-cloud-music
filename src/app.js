import { Component } from "react";
import Taro from "@tarojs/taro";
import "./app.css";
import { safeAreaRect } from "./module/safeAreaRect";
import { useUserInfoStore } from "./store/userInfo";
import { reqUserLikeList } from "./services";

class App extends Component {
  componentDidMount() {}

  componentDidShow() {}

  onLaunch() {
    this.initSafeArea();
    this.fetchUserLikeSongIds();
  }

  initSafeArea() {
    const systemInfo = Taro.getSystemInfoSync();
    safeAreaRect.bottom = systemInfo.screenHeight - systemInfo.safeArea.bottom;
    safeAreaRect.width = systemInfo.safeArea.width;
  }

  fetchUserLikeSongIds() {
    const { userInfo } = useUserInfoStore.getState();

    if (!userInfo) return;

    const id = userInfo.account.id;
    reqUserLikeList({ uid: id }).then((res) => {
      if (res.code === 200) {
        useUserInfoStore.setState({
          likeListIds: new Set(res.ids),
        });
      }
    });
  }

  componentDidHide() {}

  // this.props.children 是将要会渲染的页面
  render() {
    return this.props.children;
  }
}

export default App;
