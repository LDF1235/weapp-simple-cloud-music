import { useEffect, useRef, useState } from "react";

import chatQuoteLine from "@/assets/svgs/chatQuoteLine.svg";
import chatQuoteFill from "@/assets/svgs/chatQuoteFill.svg";
import playListFill from "@/assets/svgs/playListFill.svg";
import playListLine from "@/assets/svgs/playListLine.svg";
import repeatOneFill from "@/assets/svgs/repeatOneFill.svg";
import shuffleFill from "@/assets/svgs/shuffleFill.svg";
import orderPlayLine from "@/assets/svgs/orderPlayLine.svg";
import messageFill from "@/assets/svgs/messageFill.svg";
import messageLine from "@/assets/svgs/messageLine.svg";
import playFillWhiteSvg from "../assets/svgs/play-fill-white.svg";
import skipForwardFillWhiteSvg from "../assets/svgs/skip-forward-fill-white.svg";
import pauseLineWhiteSvg from "../assets/svgs/pause-line-white.svg";

import Taro from "@tarojs/taro";
import { format } from "date-fns";
import VirtualList from "@tarojs/components/virtual-list";
import { setStoragePlayMode } from "@/storage";
import LoadImg from "./LoadImg";
import SongCard from "./SongCard";
import LyricSection from "./LyricSection";
import { Image, View, Text } from "@tarojs/components";
import clsx from "clsx";
import { safeAreaRect } from "@/module/safeAreaRect";
import {
  audioInstance,
  pauseAudio,
  resumeAudio,
  switchSong,
} from "@/module/backgroundAudio";
import { usePlayerStore } from "@/store/player";

const enumDisplayAreaType = {
  coverImg: 0,
  lyric: 1,
  playlist: 2,
};

const playModeImgs = [repeatOneFill, orderPlayLine, shuffleFill];
const playModeTips = ["单曲循环", "顺序播放", "随机播放"];

const VirtualListItem = (param) => {
  const { index, data } = param;
  const song = data[index];

  return (
    <SongCard
      className="p-0"
      titleClassName="text-white"
      subTitleClassName="text-white"
      key={song.id}
      {...song}
    />
  );
};

const SongPlayer = (props) => {
  const { songPanelOnClose, setShowComments, showComments } = props;
  const { currentSong, isPlaying, playlistSongs, playMode } = usePlayerStore();
  const [displayAreaType, setDisplayAreaType] = useState(
    enumDisplayAreaType.coverImg
  );
  const [progressPointOffset, setProgressPointOffset] = useState(0);
  const [isDragProgressPoint, setIsDragProgressPoint] = useState(false);
  const [currentPlaylistWrapperHeight, setCurrentPlaylistWrapperHeight] =
    useState(0);
  const [progressBarWidth, setProgressBarWidth] = useState(0);
  const progressBarOffsetLeftRef = useRef(null);

  const playTimeOffset =
    (currentSong.durationTime
      ? currentSong.currentTime / currentSong.durationTime
      : 0) * progressBarWidth;

  useEffect(() => {
    const query = Taro.createSelectorQuery();
    query.select("#progressWholeBar").boundingClientRect();
    query.select("#displayArea").boundingClientRect();
    query.exec((res) => {
      if (Array.isArray(res) && res.length > 0) {
        const { width: progressWholeBarWidth } = res[0] || {};
        if (progressWholeBarWidth && safeAreaRect.width) {
          setProgressBarWidth(progressWholeBarWidth);
          progressBarOffsetLeftRef.current =
            (safeAreaRect.width - progressWholeBarWidth) / 2;
        }

        const { height: currentPlaylistHeight } = res[1] || {};
        if (currentPlaylistHeight) {
          setCurrentPlaylistWrapperHeight(currentPlaylistHeight - 20);
        }
      }
    });
  }, []);

  const pullDownBarOnClick = () => {
    songPanelOnClose();
  };

  const togglePlayingOnClick = () => {
    isPlaying ? pauseAudio() : resumeAudio();
    usePlayerStore.setState((state) => ({ isPlaying: !state.isPlaying }));
  };

  const toggleShowLyric = async () => {
    setDisplayAreaType((pre) =>
      pre === enumDisplayAreaType.lyric
        ? enumDisplayAreaType.coverImg
        : enumDisplayAreaType.lyric
    );
  };

  const toggleShowSongList = () => {
    setDisplayAreaType((pre) =>
      pre === enumDisplayAreaType.playlist
        ? enumDisplayAreaType.coverImg
        : enumDisplayAreaType.playlist
    );
  };

  const toggleShowComments = () => {
    setShowComments((pre) => !pre);
  };

  const togglePlayMode = () => {
    const modeCount = playModeImgs.length;
    const newPlayMode = playMode + 1 > modeCount - 1 ? 0 : playMode + 1;
    Taro.showToast({ title: playModeTips[newPlayMode], icon: "none" });
    usePlayerStore.setState({ playMode: newPlayMode });
    setStoragePlayMode(newPlayMode);
  };

  const progressPointOnTouchMove = (event) => {
    event.stopPropagation();
    setIsDragProgressPoint(true);

    const pageX = event.touches[0].pageX;
    let newOffset;
    const { current: progressBarOffsetLeft } = progressBarOffsetLeftRef;

    if (progressBarOffsetLeft) {
      newOffset = pageX - progressBarOffsetLeft;
      const maxOffset = progressBarWidth;
      newOffset = newOffset > maxOffset ? maxOffset : newOffset;
      newOffset = newOffset < 0 ? 0 : newOffset;
    }

    if (typeof newOffset === "number") {
      setProgressPointOffset(newOffset);
    }
  };

  const progressPointOnTouchEnd = (event) => {
    event.stopPropagation();

    const pageX = event.changedTouches[0].pageX;
    let newOffset;
    const { current: progressBarOffsetLeft } = progressBarOffsetLeftRef;

    if (progressBarOffsetLeft) {
      newOffset = pageX - progressBarOffsetLeft;
      const maxOffset = progressBarWidth;
      newOffset = newOffset > maxOffset ? maxOffset : newOffset;
      newOffset = newOffset < 0 ? 0 : newOffset;
    }

    if (typeof newOffset === "number") {
      const dragCurrentTime =
        (newOffset / progressBarWidth) * currentSong.durationTime;
      audioInstance.seek(dragCurrentTime / 1000);
      usePlayerStore.setState({ currentTime: dragCurrentTime });
      setProgressPointOffset(newOffset);
      setIsDragProgressPoint(false);
    }
  };

  const progressBarOnTouchStart = (event) => {
    if (safeAreaRect.width) {
      const pageX = event.changedTouches[0].pageX;
      const offset = pageX - (safeAreaRect.width - progressBarWidth) / 2;
      const dragCurrentTime =
        (offset / progressBarWidth) * currentSong.durationTime;
      audioInstance.seek(dragCurrentTime / 1000);
      usePlayerStore.setState({ currentTime: dragCurrentTime });
      setProgressPointOffset(offset);
    }
  };

  const dragCurrentTime =
    (progressPointOffset / progressBarWidth) * currentSong.durationTime;

  const renderDisplayArea = () => {
    switch (displayAreaType) {
      case enumDisplayAreaType.lyric: {
        return <LyricSection lyric={currentSong.lyric} />;
      }
      case enumDisplayAreaType.playlist: {
        return (
          <VirtualList
            height={currentPlaylistWrapperHeight}
            width="100%"
            itemData={playlistSongs}
            itemCount={playlistSongs.length}
            itemSize={60}
            item={VirtualListItem}
          />
        );
      }
      case enumDisplayAreaType.coverImg: {
        return (
          <View className="w-[70%] aspect-square">
            <LoadImg
              className={clsx(
                isPlaying ? "scale-[1.05]" : "scale-100",
                "rounded-[20px] transition-transform origin-center duration-300 ease-linear w-full h-full"
              )}
              src={currentSong.picUrl}
            />
          </View>
        );
      }
      default: {
        return <></>;
      }
    }
  };

  return (
    <View
      style={{
        backgroundImage: `url(${currentSong.picUrl}?param=800y800)`,
      }}
      className={clsx(
        "h-screen bg-center transition-[left] duration-200 ease-linear"
      )}
    >
      <View className="h-full  bg-[rgba(0,0,0,.4)] backdrop-blur-[40px]">
        <View
          className="h-full flex flex-col overflow-hidden"
          style={{ paddingBottom: safeAreaRect.bottom }}
        >
          <View
            className="h-20 flex items-center justify-center grow-0 shrink-0"
            onClick={pullDownBarOnClick}
          >
            <View className="w-[80px] h-3 rounded-md bg-[rgba(255,255,255,.8)]" />
          </View>

          <View
            className="px-10 flex-1 flex justify-center items-center"
            id="displayArea"
          >
            {renderDisplayArea()}
          </View>

          <View className="px-10 grow-0 shrink-0 text-[40px] font-bold text-white text-ellipsis overflow-hidden whitespace-nowrap">
            {currentSong?.name}
          </View>
          <View className="px-10 grow-0 shrink-0 mt-3 text-[28px] font-bold text-[rgba(255,255,255,.7)]">
            {currentSong.id
              ? `${currentSong.singers}-${currentSong.epname}`
              : ""}
          </View>

          <View className="py-5 px-10 grow-0 shrink-0">
            <View className="h-10 flex items-center">
              <View
                className="relative w-full h-2 bg-[rgba(255,255,255,.4)] rounded"
                id="progressWholeBar"
                onTouchStart={progressBarOnTouchStart}
              >
                <View className="absolute w-full left-0 top-1/2 h-full -translate-y-1/2 overflow-hidden rounded">
                  <View
                    className="absolute w-full z-[99] top-1/2 h-2 bg-white rounded"
                    style={{
                      transform: `translateX(calc(-100% + ${
                        isDragProgressPoint
                          ? progressPointOffset
                          : playTimeOffset
                      }px)) translateY(-50%)`,
                    }}
                  />
                </View>
                <View
                  className="relative z-[999] top-1/2 w-[29px] h-[29px] rounded-[50%] bg-white"
                  style={{
                    transform: `translateX(calc(-50% + ${
                      isDragProgressPoint ? progressPointOffset : playTimeOffset
                    }px)) translateY(-50%)`,
                  }}
                  onTouchStart={(event) => {
                    event.stopPropagation();
                  }}
                  onTouchMove={progressPointOnTouchMove}
                  onTouchEnd={progressPointOnTouchEnd}
                />
              </View>
            </View>
          </View>

          <View className="px-10 flex justify-between grow-0 shrink-0">
            <View className="text-[24px] text-[rgba(255,255,255,.6)]">
              {format(
                isDragProgressPoint ? dragCurrentTime : currentSong.currentTime,
                "mm:ss"
              )}
            </View>
            <View className="px-1 text-[24px] text-[rgb(99,99,99)] bg-white rounded">
              128K
            </View>
            <View className="text-[24px] text-[rgba(255,255,255,.6)]">
              {format(currentSong?.durationTime, "mm:ss")}
            </View>
          </View>

          <View className="flex h-[60px] my-5 grow-0 shrink-0">
            <View
              className="flex-1 flex justify-center items-center"
              onClick={toggleShowLyric}
            >
              <Image
                className="w-10 h-10"
                src={
                  displayAreaType === enumDisplayAreaType.lyric
                    ? chatQuoteFill
                    : chatQuoteLine
                }
              />
            </View>
            <View
              className="flex-1 flex justify-center items-center"
              onClick={toggleShowSongList}
            >
              <Image
                className="w-10 h-10"
                src={
                  displayAreaType === enumDisplayAreaType.playlist
                    ? playListFill
                    : playListLine
                }
              />
            </View>
            <View
              className="flex-1 flex justify-center items-center"
              onClick={togglePlayMode}
            >
              <Image className="w-10 h-10" src={playModeImgs[playMode]} />
            </View>
            <View
              className="flex-1 flex justify-center items-center"
              onClick={toggleShowComments}
            >
              <Image
                className="w-10 h-10"
                src={showComments ? messageFill : messageLine}
              />
            </View>
          </View>

          <View className="flex grow-0 shrink-0">
            <View
              className="flex-1 flex justify-center items-center text-center h-[160px]"
              onClick={() => {
                switchSong("prev");
              }}
            >
              <Image
                src={skipForwardFillWhiteSvg}
                className="w-[80px] h-[80px]"
              />
            </View>
            <View
              className="flex-1 flex justify-center items-center text-center h-[160px]"
              onClick={togglePlayingOnClick}
            >
              <Image
                src={isPlaying ? pauseLineWhiteSvg : playFillWhiteSvg}
                className="w-[120px] h-[120px]"
              />
            </View>
            <View
              className="flex-1 flex justify-center items-center text-center h-[160px]"
              onClick={() => {
                switchSong("next");
              }}
            >
              <Image
                src={skipForwardFillWhiteSvg}
                className="w-[80px] h-[80px]"
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SongPlayer;
