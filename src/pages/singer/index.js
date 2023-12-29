import { useEffect, useState } from "react";
import Taro, { useRouter } from "@tarojs/taro";
import { Button, Image, ScrollView, Text, View } from "@tarojs/components";
import PlaylistTitle from "@/components/PlaylistTitle";
import SongCard from "@/components/SongCard";
import { reqSingerHotSongs, reqSingerInfo } from "@/services";
import LoadImg from "@/components/LoadImg";
import { getSongDetail } from "@/utils/getSongDetail";
import { ROUTE_SINGER_SONG } from "@/constants";
import { safeAreaRect } from "@/module/safeAreaRect";
import { playWholePlaylist } from "@/module/backgroundAudio";
import playCircleLineSvg from "../../assets/svgs/play-circle-line.svg";

const { showLoading, hideLoading } = Taro;

const SingerInfo = () => {
  const router = useRouter();

  const [singerInfo, setSingerInfo] = useState({});
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const fetchSingerInfo = async () => {
      showLoading({ title: "加载中" });
      const { id } = router.params;
      const [singerInfoRes, hotSongsRes] = await Promise.all([
        reqSingerInfo({ id }),
        reqSingerHotSongs({ id }),
      ]);

      if (singerInfoRes.code === 200 && hotSongsRes.code === 200) {
        hideLoading();
        setSingerInfo(singerInfoRes.data.artist);
        setSongs(hotSongsRes.songs);
      }
    };

    fetchSingerInfo();
  }, [router]);

  const playAllSong = () => {
    playWholePlaylist(
      songs.map((x) => x.id),
      getSongDetail(songs[0])
    );
  };

  return (
    <View
      className="h-full bg-bgPrimary flex flex-col"
      style={{ paddingBottom: safeAreaRect.bottom }}
    >
      <View className="p-10 flex grow-0 shrink-0">
        <LoadImg
          src={singerInfo.cover ? `${singerInfo.cover}?param=330y330` : ""}
          className="w-[300px] h-[300px] rounded-[50%] grow-0 shrink-0"
        />
        <View className="ml-5 flex flex-1 overflow-hidden flex-col justify-between">
          <View className="text-5xl font-bold">{singerInfo.name}</View>
          <View className="whitespace-normal w-full text-ellipsis line-clamp-2 text-2xl">
            {singerInfo.musicSize}首歌 • {singerInfo.albumSize}张专辑 •{" "}
            {singerInfo.mvSize}个MV{" "}
          </View>
          <View className="w-full text-ellipsis whitespace-normal line-clamp-5 text-2xl text-[#747474]">
            {singerInfo.briefDesc}
          </View>
        </View>
      </View>

      <View className="px-10 mt-5 grow-0 shrink-0">
        <Button
          className="mc-primary-button flex items-center justify-center"
          onClick={playAllSong}
        >
          <Image src={playCircleLineSvg} className="w-8 h-8" />
          <Text className="ml-2.5">播放全部</Text>
        </Button>
      </View>

      <PlaylistTitle
        left="热门 50 首"
        className="mt-10 mx-10 grow-0 shrink-0"
        showMoreBtn
        moreListPath={ROUTE_SINGER_SONG}
        moreListParam={{ id: singerInfo.id }}
      />

      <View className="flex-1 overflow-hidden">
        <ScrollView enableFlex scrollY showScrollbar className="h-full">
          {songs.map((item) => (
            <SongCard key={item.id} {...getSongDetail(item)} />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default SingerInfo;
