import { getStorageCookies, setStorageCookie } from "@/storage";
import Taro, { request as taroRequest } from "@tarojs/taro";

const findCookie = () => {
  const storageCookies = getStorageCookies();

  if (!Array.isArray(storageCookies) || !storageCookies.length) return;

  let cookie = "";

  for (const item of storageCookies) {
    const obj = item
      .split(";")
      .filter(Boolean)
      .reduce((prev, cur) => {
        const [key, val] = cur.trim().split("=");

        if (key && val) {
          prev[key] = val;
        }

        return prev;
      }, {});

    if (obj["MUSIC_U"]) {
      cookie = `MUSIC_U=${obj["MUSIC_U"]}`;
      break;
    }
  }

  return cookie;
};

export const request = (config) => {
  const cookie = findCookie();

  if (config && cookie) {
    config.data = {
      ...config.data,
      cookie,
    };
  }

  return new Promise((resolve) => {
    taroRequest({
      ...config,
      url: `http://localhost:3000${config.url}`,
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

            return obj.Path === "/" && obj["Max-Age"];
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
