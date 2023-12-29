import { View, Text, Button, ScrollView, Image } from "@tarojs/components";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Taro, { useRouter, showLoading, hideLoading } from "@tarojs/taro";
import SongCard from "@/components/SongCard";
import {
  reqPlaylistSongs,
  reqSongDetail,
  reqTogglePlaylistSubscribe,
} from "@/services";
import ScrollBottomLoading from "@/components/ScrollBottomLoading";
import LoadImg from "@/components/LoadImg";
import { getSongDetail } from "@/utils/getSongDetail";
import PlayerPanel from "@/components/PlayerPanel";
import { safeAreaRect } from "@/module/safeAreaRect";
import { usePlayerStore } from "@/store/player";
import clsx from "clsx";
import { playWholePlaylist } from "@/module/backgroundAudio";
import { useUserInfoStore } from "@/store/userInfo";
import playCircleLineSvg from "../../assets/svgs/play-circle-line.svg";
import chatHeartLinePrimarySvg from "../../assets/svgs/chat-heart-line-primary.svg";
import chatHeartLineWhiteSvg from "../../assets/svgs/chat-heart-line-white.svg";

const Playlist = () => {
  const {
    params: { id: playlistId },
  } = useRouter();
  const [creator, setCreator] = useState({});
  const [playlistInfo, setPlaylistInfo] = useState({});
  const [songs, setSongs] = useState([]);
  const [showLoadingCard, setShowLoadingCard] = useState(false);

  const allTrackIdsRef = useRef();
  const isLastRequestSucceedRef = useRef(false);
  const theRestOfRequestTimesRef = useRef(0);
  const moreSongsRequestTimesRef = useRef(0);
  const { showPlayer } = usePlayerStore();
  const { userInfo } = useUserInfoStore();

  const getPlaylistSongs = useCallback(async (id) => {
    showLoading({ title: "加载中..." });

    const response = await reqPlaylistSongs({ id });

    if (response.code === 200) {
      const {
        name,
        coverImgUrl,
        trackUpdateTime,
        trackCount,
        description,
        creator: { nickname, avatarUrl },
        subscribed,
      } = response.playlist;

      setPlaylistInfo({
        name,
        coverImgUrl,
        trackUpdateTime,
        trackCount,
        description,
        subscribed,
      });
      setCreator({ nickname, avatarUrl });

      const allTrackIds = response.playlist.trackIds.map((item) => item.id);
      const allTrackIdsLength = allTrackIds.length;
      const theRestCostRequestTimes = Math.ceil(
        (allTrackIdsLength > 20 ? allTrackIdsLength - 20 : 0) / 10
      );
      const idsStr = allTrackIds.slice(0, 20).join(",");

      allTrackIdsRef.current = allTrackIds;
      theRestOfRequestTimesRef.current = theRestCostRequestTimes;

      const songDetailRes = await reqSongDetail({ ids: idsStr });

      if (songDetailRes.code === 200) {
        isLastRequestSucceedRef.current = true;
        hideLoading();
        setSongs(songDetailRes.songs);
        setShowLoadingCard(allTrackIdsLength > 20);
      }
    }
  }, []);

  useEffect(() => {
    playlistId && getPlaylistSongs(playlistId);
  }, [getPlaylistSongs, playlistId]);

  const getNextSongsList = async (idsStr) => {
    isLastRequestSucceedRef.current = false;
    const response = await reqSongDetail({ ids: idsStr });

    if (response.code === 200) {
      isLastRequestSucceedRef.current = true;
      theRestOfRequestTimesRef.current -= 1;

      if (theRestOfRequestTimesRef.current <= 0) {
        setShowLoadingCard(false);
      }

      moreSongsRequestTimesRef.current += 1;
      setSongs((pre) => [...pre, ...response.songs]);
    }
  };

  const playlistScrollToLower = () => {
    const { current: theRestOfRequestTimes } = theRestOfRequestTimesRef;

    if (theRestOfRequestTimes > 0 && isLastRequestSucceedRef.current) {
      const { current: moreSongsRequestTimes } = moreSongsRequestTimesRef;
      const sliceStart = 20 + moreSongsRequestTimes * 10;
      const sliceEnd = 20 + (moreSongsRequestTimes + 1) * 10;
      let idsStr = "";

      if (theRestOfRequestTimes === 1) {
        idsStr = allTrackIdsRef.current.slice(sliceStart).join(",");
      } else {
        idsStr = allTrackIdsRef.current.slice(sliceStart, sliceEnd).join(",");
      }

      getNextSongsList(idsStr);
    } else {
      Taro.showToast({ title: "没有更多了...", icon: "none" });
    }
  };

  const updateTimeStr = useMemo(() => {
    const { trackUpdateTime } = playlistInfo;

    if (trackUpdateTime) {
      const date = new Date(trackUpdateTime);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${year}年${month.toString().padStart(2, "0")}月${day
        .toString()
        .padStart(2, "0")}日`;
    } else {
      return "";
    }
  }, [playlistInfo]);

  const playTheList = async () => {
    Taro.showToast({
      title: "已替换当前播放列表",
      icon: "none",
    });
    playWholePlaylist(allTrackIdsRef.current, getSongDetail(songs[0]));
  };

  const handleToggleSubscribe = async () => {
    const { subscribed } = playlistInfo;

    reqTogglePlaylistSubscribe({
      id: parseInt(playlistId),
      t: subscribed ? 2 : 1,
    }).then((res) => {
      if (res.code === 200) {
        setPlaylistInfo((prev) => ({ ...prev, subscribed: !subscribed }));
      }
    });
  };

  return (
    <View
      className="h-full bg-bgPrimary flex-col flex"
      style={{ paddingBottom: safeAreaRect.bottom }}
    >
      <View
        className="bg-center grow-0 shrink-0"
        style={{
          backgroundImage: `url(${
            playlistInfo.coverImgUrl
              ? `${playlistInfo.coverImgUrl}?param=450y450`
              : ""
          })`,
        }}
      >
        <View className="bg-[rgba(0,0,0,.3)] backdrop-blur-[40px]">
          <View className="flex justify-between h-[360px] p-10">
            <LoadImg
              src={playlistInfo.coverImgUrl}
              className="w-[280px] h-[280px] rounded-xl"
            />
            <View className="self-start flex h-full w-[370px] flex-col justify-between">
              <View>
                <View className="text-[36px] font-bold text-white  whitespace-normal text-ellipsis line-clamp-3">
                  {playlistInfo.name}
                </View>
                <View className="mt-4 flex items-center">
                  <Image
                    className="w-12 h-12 rounded-md mr-2"
                    src={creator.avatarUrl}
                  />
                  <View className="w-[280px] text-white text-[24px]">
                    {creator.nickname}
                  </View>
                </View>
              </View>
              <View className="text-[24px] text-white">
                更新于{updateTimeStr} • {playlistInfo.trackCount}首
              </View>
            </View>
          </View>
        </View>
      </View>

      <View className="px-10 grow-0 shrink-0">
        <View className="w-full mt-5 text-[24px] text-[#747474] whitespace-normal text-ellipsis line-clamp-2">
          {playlistInfo.description}
        </View>

        {userInfo ? (
          <View className="flex mt-5">
            <Button
              className="mc-primary-button  w-auto flex-1 flex items-center justify-center"
              onClick={playTheList}
            >
              <Image src={playCircleLineSvg} className="w-8 h-8" />
              <Text className="ml-2.5">播放歌单</Text>
            </Button>

            <Button
              className={clsx(
                playlistInfo.subscribed
                  ? "mc-default-button"
                  : "mc-primary-button",
                " ml-10 w-auto flex-1 flex items-center justify-center"
              )}
              onClick={handleToggleSubscribe}
            >
              <Image
                src={
                  playlistInfo.subscribed
                    ? chatHeartLinePrimarySvg
                    : chatHeartLineWhiteSvg
                }
                className="w-8 h-8"
              />
              <Text className="ml-2.5">
                {playlistInfo.subscribed ? "取消收藏" : "收藏歌单"}
              </Text>
            </Button>
          </View>
        ) : (
          <Button
            className="mc-primary-button mt-5  flex items-center justify-center"
            onClick={playTheList}
          >
            <Image src={playCircleLineSvg} className="w-8 h-8" />
            <Text className="ml-2.5">播放歌单</Text>
          </Button>
        )}
      </View>

      <View
        className={clsx(
          "flex-1 overflow-hidden mt-5",
          showPlayer ? "pb-[130px]" : ""
        )}
      >
        <ScrollView
          scrollY
          onScrollToLower={playlistScrollToLower}
          enhanced
          className="h-full"
          showScrollbar
        >
          {songs.map((item) => (
            <SongCard key={item.id} {...getSongDetail(item)} />
          ))}
          {showLoadingCard && <ScrollBottomLoading />}
        </ScrollView>
      </View>

      <PlayerPanel />
    </View>
  );
};

export default Playlist;
