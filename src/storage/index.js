import { enumPlayMode } from "@/constants";
import { setStorage, removeStorage, getStorageSync } from "@tarojs/taro";

// storage key
const STORAGE_KEYWORD = "keyword";
const STORAGE_PLAY_MODE = "playMode";
const STORAGE_USER_INFO = "userInfo";
const STORAGE_COOKIE = "cookie";

const getStorage = (key, defaultVal) => {
  try {
    const val = getStorageSync(key);
    return val === "" ? defaultVal : val;
  } catch (error) {
    return defaultVal;
  }
};

const remoteStorage = (key) => {
  remoteStorage(key);
};

// 搜索关键字
export const getStorageKeyword = () => getStorage(STORAGE_KEYWORD, []);
export const setStorageKeyword = (keywords) => {
  setStorage({
    key: STORAGE_KEYWORD,
    data: keywords,
  });
};
export const removeStorageKeyword = () => {
  removeStorage({ key: STORAGE_KEYWORD });
};

// 播放模式
export const setStoragePlayMode = (mode) => {
  setStorage({
    key: STORAGE_PLAY_MODE,
    data: mode,
  });
};
export const getStoragePlayMode = () =>
  getStorage(STORAGE_PLAY_MODE, enumPlayMode.order);
export const remoteStoragePlayMode = () => {
  removeStorage({ key: STORAGE_PLAY_MODE });
};

// 用户信息
export const setStorageUserInfo = (userInfo) => {
  setStorage({
    key: STORAGE_USER_INFO,
    data: userInfo,
  });
};
export const getStorageUserInfo = () => getStorage(STORAGE_USER_INFO, null);
export const remoteStorageUserInfo = () => {
  removeStorage({ key: STORAGE_USER_INFO });
};

// cookie
export const setStorageCookie = (data) => {
  setStorage({
    key: STORAGE_COOKIE,
    data,
  });
};
export const getStorageCookies = () => getStorage(STORAGE_COOKIE, []);
export const remoteStorageCookies = () => {
  removeStorage({ key: STORAGE_COOKIE });
};
