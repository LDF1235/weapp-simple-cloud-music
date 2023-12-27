import { getStorageUserInfo } from "@/storage";
import { create } from "zustand";

const userInfo = getStorageUserInfo();

const userInfoStore = create((set) => ({
  userInfo:userInfo,
  setUserInfoState: (callback) => set((state) => callback(state)),
}));

export { userInfoStore };
