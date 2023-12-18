import { setStorage, getStorageSync } from "@tarojs/taro";
import { STORAGE_PLAYLIST_KEY, STORAGE_PLAY_MODE_KEY } from "./key";

const playModeReg = /^[0|1|2]$/;

export const setLocalPlaylistIds = (idStr) => {
  setStorage({
    key: STORAGE_PLAYLIST_KEY,
    data: idStr,
  });
};

export const setLocalPlayMode = (modeIndex) => {
  setStorage({
    key: STORAGE_PLAY_MODE_KEY,
    data: modeIndex.toString(),
  });
};

export const getLocalPlaylistIds = () => {
  let playlist = null;
  try {
    const localPlaylist = getStorageSync(STORAGE_PLAYLIST_KEY);

    if (localPlaylist) {
      playlist = localPlaylist;
    }
  } catch (error) {}

  return playlist;
};

export const getLocalPlayMode = () => {
  let playMode = 0;
  try {
    const localPlayMode = getStorageSync(STORAGE_PLAY_MODE_KEY);

    if (playModeReg.test(localPlayMode)) {
      playMode = Number(localPlayMode);
    }
  } catch (error) {}

  return playMode;
};
