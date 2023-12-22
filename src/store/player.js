import { getLocalPlayMode } from "@/storage/storagePlayerSetting";
import { create } from "zustand";

const usePlayerStore = create((set) => ({
  showPlayer: false,
  isPlaying: false,
  playlistSongs: [],
  playMode: getLocalPlayMode(),
  currentSong: {
    id: 0,
    picUrl: "",
    name: "",
    singers: "",
    epname: "",
    durationTime: 0,
    lyric: "",
    url: "",
    currentTime: 0,
  },
  setPlayerState: (callback) => set((state) => callback(state)),
}));

export { usePlayerStore };
