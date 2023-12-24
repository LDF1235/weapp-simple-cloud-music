import { useState } from "react";
import { PageContainer, Text, View, Image } from "@tarojs/components";
import SongPanel from "@/components/SongPanel";
import Taro from "@tarojs/taro";
import { pauseAudio, resumeAudio, switchSong } from "@/module/backgroundAudio";
import clsx from "clsx";
import { isTabBarPath } from "@/utils/isTabBarPath";
import { usePlayerStore } from "@/store/player";
import { safeAreaRect } from "@/module/safeAreaRect";

const BottomPlayPanel = () => {
  const [showSongPanel, setShowSongPanel] = useState(false);
  const { isPlaying, showPlayer, currentSong } = usePlayerStore();
  const [showComments, setShowComments] = useState(false);

  const playControlOnClick = () => {
    const pages = Taro.getCurrentPages();
    const { route } = pages[pages.length - 1];

    if (isTabBarPath(route)) {
      Taro.hideTabBar();
    }

    setShowSongPanel(true);
    setShowComments(false);
    Taro.setNavigationBarTitle({ title: "正在播放" });
  };

  const togglePlayingOnClick = (event) => {
    event.stopPropagation();
    isPlaying ? pauseAudio() : resumeAudio();
  };

  const playNextSong = (event) => {
    event.stopPropagation();
    switchSong("next");
  };

  const songPanelOnClose = () => {
    setShowSongPanel(false);
    onSongPanelClosed();
  };

  const onSongPanelClosed = () => {
    const pages = Taro.getCurrentPages();
    const currentPage = pages[pages.length - 1];

    if (isTabBarPath(currentPage.route)) {
      Taro.showTabBar();
    }

    if (currentPage) {
      Taro.setNavigationBarTitle({
        title: currentPage.config?.navigationBarTitleText,
      });
    }
  };

  return (
    <View className={clsx(showPlayer ? "" : "hidden")}>
      <View
        className="w-full flex fixed  px-2.5 h-[130px] items-center bg-[rgba(255,255,255,.7)] backdrop-blur-[20px] leading-none transition-all duration-[800ms]"
        onClick={playControlOnClick}
        style={{
          bottom: safeAreaRect.bottom,
        }}
      >
        <Image
          className="w-[100px] h-[100px] rounded-[10px]"
          src={currentSong.picUrl}
        />
        <View className="ml-2.5 h-[100px] flex flex-1 flex-col justify-between overflow-hidden">
          <View className="text-[32px] leading-normal font-bold text-[rgb(73,73,73)] text-ellipsis overflow-hidden whitespace-nowrap">
            {currentSong.name}
          </View>
          <View className="text-[24px] leading-normal text-[rgb(73,73,73)] w-full text-ellipsis overflow-hidden whitespace-nowrap">
            {currentSong.id
              ? `${currentSong.singers}-${currentSong.epname}`
              : ""}
          </View>
        </View>
        <View className="flex grow-0 shrink-0 items-center">
          <View className=" text-center" onClick={togglePlayingOnClick}>
            <Text
              className={clsx(
                "iconfont text-[80px]",
                isPlaying ? "icon-ai07" : "icon-bofang1"
              )}
            />
          </View>
          <View className=" text-center" onClick={playNextSong}>
            <Text className="iconfont icon-skip-next text-[70px]" />
          </View>
        </View>

        <View
          style={{
            width: currentSong.id
              ? `${(currentSong.currentTime / currentSong.durationTime) * 100}%`
              : 0,
          }}
          className="absolute left-0 top-0 h-[2px] bg-[linear-gradient(to_right,rgba(231,62,68,.01),rgba(231,62,68,1))]"
        />
      </View>
      <PageContainer
        show={showSongPanel}
        onAfterLeave={() => {
          setShowSongPanel(false);
          onSongPanelClosed();
        }}
      >
        {showSongPanel && (
          <SongPanel
            songPanelOnClose={songPanelOnClose}
            showComments={showComments}
            setShowComments={setShowComments}
          />
        )}
      </PageContainer>
    </View>
  );
};

export default BottomPlayPanel;
