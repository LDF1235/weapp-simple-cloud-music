import { setStorage, removeStorage, getStorageSync } from "@tarojs/taro";
import { STORAGE_USER_INFO } from "./key";

export const setStorageUserInfo = (userInfo) => {
  setStorage({
    key: STORAGE_USER_INFO,
    data: JSON.stringify(userInfo),
  });
};

export const getStorageUserInfo = () => {
  let userInfo = null;
  try {
    userInfo = getStorageSync(STORAGE_USER_INFO);
  } catch (e) {}

  return userInfo;
};

export const removeStorageUserInfo = () => {
  removeStorage({ key: STORAGE_USER_INFO });
};
