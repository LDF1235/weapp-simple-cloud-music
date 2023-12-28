import { getStorageUserInfo } from "@/storage";
import { create } from "zustand";

const userInfo = getStorageUserInfo();

const useUserInfoStore = create((set) => ({
  userInfo: userInfo,
  likeListIds: new Set(),
  setUserInfoState: (callback) => set((state) => callback(state)),
}));

export { useUserInfoStore };
