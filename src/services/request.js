import Taro, { request as taroRequest } from "@tarojs/taro";

export const request = (config) => {
  return new Promise((resolve) => {
    taroRequest({
      ...config,
      url: `http://192.168.2.173:3000${config.url}`,
      success: (res) => {
        resolve(res.data);
      },
      fail: (res) => {
        const { errMsg } = res;
        Taro.showToast({
          title: errMsg || "网络异常",
          icon: "error",
        });
        resolve({
          code: -1,
          data: {},
        });
      },
    }).catch((err) => {
      console.log(err);
    });
  });
};
