import NoticeLogin from "@/components/NoticeLogin";
import PlaylistTitle from "@/components/PlaylistTitle";
import {
  reqDailySongs,
  reqRecommendDailyPlaylist,
  reqRecommendSimilarPlaylist,
  reqRecommendSimilarSinger,
  reqSongDetail,
} from "@/services";
import { useUserInfoStore } from "@/store/userInfo";
// import BottomPlayPanel from "@/components/BottomPlayPanel";
import { ScrollView, View, Text, Image } from "@tarojs/components";
import { useEffect } from "react";
import PlaylistCard from "@/components/PlaylistCard";
import { useState } from "react";
import SingerCard from "@/components/SingerCard";
import calendarLineSvg from "../../assets/svgs/calendar-line.svg";
import refreshLineSvg from "../../assets/svgs/refresh-line.svg";
import { useCallback } from "react";

const Index = () => {
  const { userInfo, likeListIds } = useUserInfoStore();
  const [playlist, setPlaylist] = useState([]);
  const [similarPlaylist, setSimilarPlaylist] = useState([]);
  const [songName, setSongName] = useState("");
  const [singerName, setSingerName] = useState("");
  const [similarSingers, setSimilarSingers] = useState([]);
  const [firstDailySong, setFirstDailySong] = useState(null);

  const fetchSimilarRecommend = useCallback(() => {
    if (!likeListIds.size) return;

    const songId = [...likeListIds][
      Math.floor(Math.random() * likeListIds.size)
    ];
    reqSongDetail({ ids: songId }).then((res) => {
      if (res.code === 200) {
        const ar = res.songs[0].ar;
        setSongName(res.songs[0].name);
        const artist =
          ar.length === 1 ? ar[0] : ar[Math.floor(Math.random() * ar.length)];
        setSingerName(artist.name);
        reqRecommendSimilarSinger({ id: artist.id }).then((res) => {
          if (res.code === 200) {
            setSimilarSingers(
              res.artists.map((x) => ({
                id: x.id,
                img1v1Url: x.img1v1Url,
                name: x.name,
              }))
            );
          }
        });
      }
    });
    reqRecommendSimilarPlaylist({ id: songId }).then((res) => {
      if (res.code === 200) {
        setSimilarPlaylist(
          res.playlists.map((x) => ({
            id: x.id,
            coverImgUrl: x.coverImgUrl,
            name: x.name,
            playCount: x.playCount,
          }))
        );
      }
    });
  }, [likeListIds]);

  useEffect(() => {
    fetchSimilarRecommend();
  }, [fetchSimilarRecommend]);

  useEffect(() => {
    fetchDailyPlaylist();
    fetchDailySongs();
  }, []);

  const fetchDailyPlaylist = () => {
    reqRecommendDailyPlaylist().then((res) => {
      if (res.code === 200) {
        setPlaylist(
          res.recommend.map((x) => ({
            id: x.id,
            coverImgUrl: x.picUrl,
            name: x.name,
            playCount: x.playcount,
          }))
        );
      }
    });
  };

  const fetchDailySongs = () => {
    reqDailySongs().then((res) => {
      if (res.code === 200) {
        const firstSong = res.data.dailySongs[0];
        setFirstDailySong({
          name: firstSong.name,
          singers: firstSong.ar?.map((item) => item.name)?.join("/") || "/",
          picUrl: firstSong.al.picUrl,
        });
      }
    });
  };

  const handleRefresh = () => {
    fetchDailyPlaylist();
    fetchDailySongs();
    fetchSimilarRecommend();
  };

  const renderDate = () => {
    const date = new Date();
    return `${(date.getMonth() + 1).toString().padStart(2, "0")}月${date
      .getDate()
      .toString()
      .padStart(2, "0")}日`;
  };

  return (
    <View className="h-full bg-bgPrimary">
      {!userInfo ? (
        <NoticeLogin
          topSubTitle="专属推荐"
          topTitle="推荐"
          notice="推荐功能需要登录"
        />
      ) : null}

      {userInfo ? (
        <ScrollView scrollY className="h-full">
          <View className="m-10 flex items-center justify-between">
            <View>
              <Text className="text-[64px] font-bold text-textPrimary mr-5">
                推荐
              </Text>
              <Text className="text-[24px]">专属推荐</Text>
            </View>
            <Image
              src={refreshLineSvg}
              className="w-[60px] h-[60px]"
              onClick={handleRefresh}
            />
          </View>

          <View className="relative overflow-hidden rounded-[20px] px-10 pb-10 mx-10 bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_0%,rgba(0,0,0,0.1)_20%,rgba(0,0,0,0.2)_40%,rgba(0,0,0,0.3)_60%,rgba(0,0,0,0.5)_100%)]">
            <View
              className="absolute left-0 top-0 w-full h-full animate-[daily-recommend-bg_10s_ease-in-out_infinite_alternate] bg-no-repeat bg-cover "
              style={{
                backgroundImage: firstDailySong
                  ? `url(${firstDailySong.picUrl})`
                  : undefined,
              }}
            />
            <View className="text-[80px] relative z-[1] font-bold text-white text-center leading-[180px]">
              今日推荐
            </View>
            <View className="text-[36px] relative z-[1] font-bold text-white line-clamp-2  text-ellipsis">
              {firstDailySong?.name}
            </View>
            <View className="text-[28px] relative z-[1] mt-5 text-white text-ellipsis overflow-hidden whitespace-nowrap">
              {firstDailySong?.singers}
            </View>

            <View className="text-right relative z-[1] text-white mt-5">
              <Image src={calendarLineSvg} className="w-8 h-8" />
              <Text> {renderDate()}</Text>
            </View>
          </View>

          <View className="pb-10 mt-10">
            <PlaylistTitle
              left="每日歌单推荐"
              showMoreBtn={false}
              className="mx-10"
            />
            <ScrollView
              className="flex h-[560px] whitespace-nowrap"
              scrollX
              enableFlex
            >
              {playlist.map((item, index) => (
                <PlaylistCard
                  key={item.id}
                  coverImgUrl={item.coverImgUrl}
                  name={item.name}
                  playCount={item.playCount}
                  className="pl-10"
                  isLastOne={index === playlist.length - 1}
                  id={item.id}
                />
              ))}
            </ScrollView>

            <PlaylistTitle
              left="相似歌单推荐"
              showMoreBtn={false}
              className="mx-10 mt-5"
            />
            <View className="mx-10">
              <View className="text-[#8d8d8d] text-[24px] h-full text-ellipsis overflow-hidden whitespace-nowrap">
                根据单曲《{songName}》推荐
              </View>
            </View>
            <ScrollView
              className="flex h-[560px] whitespace-nowrap mt-10"
              scrollX
              enableFlex
            >
              {similarPlaylist.map((item, index) => (
                <PlaylistCard
                  key={item.id}
                  coverImgUrl={item.coverImgUrl}
                  name={item.name}
                  playCount={item.playCount}
                  className="pl-10"
                  isLastOne={index === similarPlaylist.length - 1}
                  id={item.id}
                />
              ))}
            </ScrollView>

            <PlaylistTitle
              left="相似歌手推荐"
              showMoreBtn={false}
              className="mx-10 mt-5"
            />
            <View className="mx-10">
              <View className="text-[#8d8d8d] text-[24px] h-full text-ellipsis overflow-hidden whitespace-nowrap">
                根据【{singerName}】推荐
              </View>
            </View>
            <View className="flex justify-between flex-wrap px-10">
              {similarSingers.map((singer) => (
                <SingerCard
                  key={singer.id}
                  id={singer.id}
                  img1v1Url={singer.img1v1Url}
                  name={singer.name}
                />
              ))}
              {similarSingers.length % 3 === 1 ? (
                <>
                  <View className="w-[200px] h-[200px]"></View>
                  <View className="w-[200px] h-[200px]"></View>
                </>
              ) : null}
              {similarSingers.length % 3 === 2 ? (
                <View className="w-[200px] h-[200px]"></View>
              ) : null}
            </View>
          </View>
        </ScrollView>
      ) : null}
      {/* <BottomPlayPanel /> */}
    </View>
  );
};

export default Index;
