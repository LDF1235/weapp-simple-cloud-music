import { safeAreaRect } from "@/module/safeAreaRect";
import { Button, ScrollView, View, Image, Text } from "@tarojs/components";
import { useEffect, useState } from "react";
import playCircleLineSvg from "../../assets/svgs/play-circle-line.svg";
import { reqDailySongs } from "@/services";
import SongCard from "@/components/SongCard";
import Taro from "@tarojs/taro";
import PlayerPanel from "@/components/PlayerPanel";
import { usePlayerStore } from "@/store/player";
import { playWholePlaylist } from "@/module/backgroundAudio";

const Index = () => {
  const [songs, setSongs] = useState([]);
  const { showPlayer } = usePlayerStore();

  useEffect(() => {
    Taro.showLoading();
    reqDailySongs().then((res) => {
      Taro.hideLoading();
      if (res.code === 200) {
        setSongs(
          res.data.dailySongs.map((x) => ({
            id: x.id,
            name: x.name,
            durationTime: x.dt,
            picUrl: x.al.picUrl,
            singers: x.ar?.map((item) => item.name)?.join("/") || "/",
            epname: x.al.name,
          }))
        );
      }
    });
  }, []);

  const handlePlayWholeList = () => {
    Taro.showToast({
      title: "已替换当前播放列表",
      icon: "none",
    });
    playWholePlaylist(
      songs.map((x) => x.id).slice(1),
      songs[0]
    );
  };

  return (
    <View
      className="h-full bg-bgPrimary flex flex-col"
      style={{ paddingBottom: safeAreaRect.bottom }}
    >
      <View className="text-primary text-center text-[92px] font-bold my-[80px] grow-0 shrink-0">
        今日推荐歌曲
      </View>
      <View className="text-center text-[24px] grow-0 shrink-0">
        根据你的音乐口味生成{songs.length}首·每天6:00更新
      </View>

      <Button
        onClick={handlePlayWholeList}
        className="mc-primary-button grow-0 shrink-0 w-auto mx-10 mt-10 flex items-center justify-center"
      >
        <Image src={playCircleLineSvg} className="w-8 h-8" />
        <Text className="ml-2.5">播放歌单</Text>
      </Button>

      <View className="flex-1 overflow-hidden mt-4">
        <ScrollView scrollY className="h-full" showScrollbar>
          {songs.map((item) => (
            <SongCard
              key={item.id}
              id={item.id}
              picUrl={item.picUrl}
              name={item.name}
              epname={item.epname}
              durationTime={item.durationTime}
              singers={item.singers}
            />
          ))}
        </ScrollView>
      </View>

      {showPlayer && <View className="h-[130px] grow-0 shrink-0" />}
      <PlayerPanel />
    </View>
  );
};

export default Index;
