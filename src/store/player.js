import { getStoragePlayMode } from "@/storage";
import { create } from "zustand";

const usePlayerStore = create((set) => ({
  showPlayer: false,
  isPlaying: false,
  isPersonalFm: false,
  isHeartbeatMode: false,
  heartbeatPlaylistId:0,
  fmSongs: [],
  currentFmSong: {
    name: "",
    picUrl: "",
    singers: "",
  },
  playlistSongs: [],
  playMode: getStoragePlayMode(),
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
