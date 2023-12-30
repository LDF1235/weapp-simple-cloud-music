import { Button, View, Text, ScrollView, Image } from "@tarojs/components";
import playCircleLineSvg from "../../assets/svgs/play-circle-line.svg";
import { safeAreaRect } from "@/module/safeAreaRect";
import { usePlayerStore } from "@/store/player";
import clsx from "clsx";
import PlayerPanel from "@/components/PlayerPanel";
import SongCard from "@/components/SongCard";
import { useState } from "react";
import { getSongDetail } from "@/utils/getSongDetail";
import ScrollBottomLoading from "@/components/ScrollBottomLoading";
import { useEffect } from "react";
import { reqSongDetail } from "@/services";
import { useUserInfoStore } from "@/store/userInfo";
import { useRef } from "react";
import { enumPlayMode } from "@/constants";
import shuffleFillSvg from "../../assets/svgs/shuffle-fill.svg";
import { setStoragePlayMode } from "@/storage";
import { playWholePlaylist } from "@/module/backgroundAudio";

const Index = () => {
  const [songs, setSongs] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const { showPlayer, setPlayerState } = usePlayerStore();
  const { likeListIds } = useUserInfoStore();
  const indexCursorRef = useRef(0);
  const likeListIdsRef = useRef(Array.from(likeListIds));
  const prevRequestOkRef = useRef(true);

  const fetchSong = async () => {
    const indexCursor = indexCursorRef.current;
    const likeListIds = likeListIdsRef.current;

    if (indexCursor > likeListIds.length) return;

    const ids = likeListIdsRef.current
      .slice(indexCursor, indexCursor + 30)
      .join(",");
    const res = await reqSongDetail({ ids });

    if (res.code === 200) {
      indexCursorRef.current += 30;

      if (indexCursorRef.current > likeListIds.length) {
        setHasMore(false);
      }

      setSongs((prev) => prev.concat(res.songs.map((x) => getSongDetail(x))));
    }
  };

  useEffect(() => {
    fetchSong();
  }, []);

  const handlePlaylistScrollToLower = () => {
    if (!prevRequestOkRef.current || !hasMore) return;

    prevRequestOkRef.current = false;
    fetchSong().then(() => {
      prevRequestOkRef.current = true;
    });
  };

  const handlePlayList = (mode) => {
    setPlayerState(() => ({
      isPersonalFm: false,
      isHeartbeatMode: false,
      playMode: mode,
    }));
    setStoragePlayMode(mode);
    playWholePlaylist(likeListIdsRef.current.slice(1), songs[0]);
  };

  return (
    <View
      className="h-full bg-bgPrimary overflow-hidden flex flex-col"
      style={{ paddingBottom: safeAreaRect.bottom }}
    >
      <View className="text-[92px] my-10 grow-0 shrink-0 font-bold text-primary text-center">
        我喜欢的音乐
      </View>

      <View className="grow-0 shrink-0 text-center text-[24px]">
        共 {likeListIds.size} 首{" "}
      </View>

      <View className="flex mx-10 grow-0 shrink-0 mt-5">
        <Button
          className="mc-primary-button  w-auto flex-1 flex items-center justify-center"
          onClick={() => {
            handlePlayList(enumPlayMode.order);
          }}
        >
          <Image src={playCircleLineSvg} className="w-8 h-8" />
          <Text className="ml-2.5">顺序播放</Text>
        </Button>

        <Button
          className="mc-primary-button  w-auto flex-1 flex items-center justify-center ml-[40px]"
          onClick={() => {
            handlePlayList(enumPlayMode.shuffle);
          }}
        >
          <Image src={shuffleFillSvg} className="w-8 h-8" />
          <Text className="ml-2.5">随机播放</Text>
        </Button>
      </View>

      <View
        className={clsx(
          "flex-1 overflow-hidden mt-5",
          showPlayer && "pb-[130px]"
        )}
      >
        <ScrollView
          className="h-full"
          scrollY
          onScrollToLower={handlePlaylistScrollToLower}
        >
          {songs.map((item) => (
            <SongCard key={item.id} {...item} />
          ))}
          {hasMore && <ScrollBottomLoading />}
        </ScrollView>
      </View>
      <PlayerPanel />
    </View>
  );
};

export default Index;
