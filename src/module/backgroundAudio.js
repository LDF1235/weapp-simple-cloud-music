import { enumPlayMode } from "@/constants";
import { reqLyric, reqPersonalFm, reqSongDetail, reqSongUrl } from "@/services";
import { usePlayerStore } from "@/store/player";
import { getSongDetail } from "@/utils/getSongDetail";
import Taro from "@tarojs/taro";

export const audioInstance = Taro.getBackgroundAudioManager();

audioInstance.onPause(() => {
  usePlayerStore.setState({
    isPlaying: false,
  });
});

audioInstance.onStop(() => {
  usePlayerStore.setState({ isPlaying: false });
});

audioInstance.onPlay(() => {
  usePlayerStore.setState({ isPlaying: true });
});

audioInstance.onTimeUpdate(() => {
  usePlayerStore.setState((state) => ({
    currentSong: {
      ...state.currentSong,
      currentTime: audioInstance.currentTime * 1000,
    },
  }));
});

audioInstance.onEnded(() => {
  switchSong("next");
});

export const pauseAudio = () => {
  audioInstance.pause();
};

export const resumeAudio = () => {
  audioInstance.play();
};

const appendSongToPlaylist = (songDetail) => {
  usePlayerStore.setState((state) => {
    const { playlistSongs } = state;
    let nextPlaylistSongs = playlistSongs;
    const hasSong = nextPlaylistSongs.some((x) => x.id === songDetail.id);

    if (!hasSong) {
      nextPlaylistSongs = [...nextPlaylistSongs];
      if (state.playMode === enumPlayMode.order) {
        const currentSongIndex = nextPlaylistSongs.findIndex(
          (x) => x.id === songDetail.id
        );
        nextPlaylistSongs.splice(currentSongIndex + 1, 0, songDetail);
      } else if (
        state.playMode === enumPlayMode.repeatOne ||
        state.playMode === enumPlayMode.shuffle
      ) {
        nextPlaylistSongs.push(songDetail);
      }
    }

    return {
      playlistSongs: nextPlaylistSongs,
    };
  });
};

export const playSong = async (songDetail, isPersonalFm = false) => {
  if (!isPersonalFm) appendSongToPlaylist(songDetail);

  const [urlRes, lyricRes] = await Promise.all([
    reqSongUrl({ id: songDetail.id }),
    reqLyric({ id: songDetail.id }),
  ]);

  if (urlRes.code === 200) {
    const { url } = urlRes.data[0];

    if (!url) {
      Taro.showToast({ icon: null, title: "获取歌曲url失败" });
      return;
    }

    const { name, epname, singers, picUrl, id, durationTime } = songDetail;
    audioInstance.src = url;
    audioInstance.title = name;
    audioInstance.epname = epname;
    audioInstance.singer = singers;
    audioInstance.coverImgUrl = picUrl;
    const lyric = lyricRes.code === 200 ? lyricRes.lrc.lyric : "";

    usePlayerStore.setState((state) => {
      return {
        isPlaying: true,
        showPlayer: true,
        currentSong: {
          ...state.currentSong,
          id,
          picUrl,
          name,
          singers,
          epname,
          durationTime,
          url,
          lyric,
        },
      };
    });
  }
};

export const playNextPersonalFmSong = () => {
  const { fmSongs } = usePlayerStore.getState();

  if (fmSongs.length === 0) {
    usePlayerStore.setState({ isPersonalFm: true });
    reqPersonalFm().then((res) => {
      if (res.code === 200) {
        const nextFmSongs = res.data.map((x) => ({
          id: x.id,
          name: x.name,
          durationTime: x.duration,
          picUrl: x.album.picUrl,
          singers: x.artists?.map((item) => item.name)?.join("/") || "/",
          epname: x.album.name,
        }));
        playSong(nextFmSongs[0], true);
        usePlayerStore.setState({
          isPlaying: true,
          isPersonalFm: true,
          fmSongs: nextFmSongs.slice(1),
          currentFmSong: {
            name: nextFmSongs[0].name,
            picUrl: nextFmSongs[0].picUrl,
            singers: nextFmSongs[0].singers,
          },
        });
      }
    });
  } else {
    const nextFmSongs = fmSongs.slice(1);
    playSong(fmSongs[0]);
    usePlayerStore.setState({
      isPersonalFm: true,
      fmSongs: nextFmSongs,
      currentFmSong: {
        name: fmSongs[0].name,
        picUrl: fmSongs[0].picUrl,
        singers: fmSongs[0].singers,
      },
    });
  }
};

export const switchSong = (action) => {
  const { playMode, playlistSongs, currentSong, isPersonalFm } =
    usePlayerStore.getState();

  if (isPersonalFm) {
    playNextPersonalFmSong();
    return;
  }

  if (playMode === enumPlayMode.repeatOne) {
    audioInstance.title = currentSong.name;
    audioInstance.epname = currentSong.epname;
    audioInstance.singer = currentSong.singers;
    audioInstance.coverImgUrl = currentSong.picUrl;
    audioInstance.src = currentSong.url;
    audioInstance.play();
    return;
  }

  if (action !== "prev" && action !== "next") return;

  const songCount = playlistSongs.length;
  const currentSongIndex = playlistSongs.findIndex(
    (x) => x.id === currentSong.id
  );
  let targetSongIndex = 0;

  if (playMode === enumPlayMode.order) {
    targetSongIndex = currentSongIndex + (action === "next" ? 1 : -1);
    targetSongIndex = targetSongIndex >= songCount ? 0 : targetSongIndex;
    targetSongIndex = targetSongIndex < 0 ? songCount - 1 : targetSongIndex;
    playSong(playlistSongs[targetSongIndex]);
    return;
  }

  if (playMode === enumPlayMode.shuffle) {
    targetSongIndex = Math.floor(Math.random() * songCount);
    playSong(playlistSongs[targetSongIndex]);
    return;
  }
};

export const playWholePlaylist = (songIds, firstSongDetail) => {
  playSong(firstSongDetail);
  fetchPlaylistSongDetails(songIds);
};

const fetchPlaylistSongDetails = async (songIds) => {
  let songDetails = [];

  while (songIds.length) {
    const res = await reqSongDetail({ ids: songIds.slice(0, 150).join(",") });

    if (res.code === 200) {
      songDetails.push(...res.songs.map(getSongDetail));
    }

    songIds = songIds.slice(150);
  }

  usePlayerStore.setState({ playlistSongs: songDetails });
};
