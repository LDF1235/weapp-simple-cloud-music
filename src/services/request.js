import { getStorageCookies, setStorageCookie } from "@/storage";
import Taro, { request as taroRequest } from "@tarojs/taro";

export const request = (config) => {
  const storageCookies = getStorageCookies();
  let cookieArr = [];

  if (Array.isArray(storageCookies) && storageCookies.length) {
    for (const cookie of storageCookies) {
      cookieArr.push(cookie.split(";").filter(Boolean)[0]);
    }
  }

  if (cookieArr.length) {
    config.header = {
      ...config.header,
      Cookie: cookieArr.join("; "),
    };
  }

  return new Promise((resolve) => {
    taroRequest({
      ...config,
      url: `http://192.168.2.173:3000${config.url}`,
      timeout: 60000,
      success: (res) => {
        resolve(res.data);

        if (Array.isArray(res.cookies) && res.cookies.length) {
          const targetCookies = res.cookies.filter((cookie) => {
            const obj = cookie
              .split(";")
              .filter(Boolean)
              .reduce((prev, cur) => {
                const [key, val] = cur.trim().split("=");

                if (key && val) {
                  prev[key] = val;
                }
                return prev;
              }, {});

            return obj.Path === "/" && obj.Max - Age;
          });

          setStorageCookie(targetCookies);
        }
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
