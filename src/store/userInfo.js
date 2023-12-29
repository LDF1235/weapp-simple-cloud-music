import { reqUserLikeList } from "@/services";
import { getStorageUserInfo } from "@/storage";
import { create } from "zustand";

const userInfo = getStorageUserInfo();

const useUserInfoStore = create((set) => ({
  userInfo: userInfo,
  likeListIds: new Set(),
  setUserInfoState: (callback) => set((state) => callback(state)),
}));

export { useUserInfoStore };

export const refreshLikeListIds = () => {
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
};
