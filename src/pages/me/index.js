import NoticeLogin from "@/components/NoticeLogin";
import PlaylistTitle from "@/components/PlaylistTitle";
import {
  reqLogout,
  reqSongDetail,
  reqUserPlaylist,
  reqUserSingers,
} from "@/services";
import { useUserInfoStore } from "@/store/userInfo";
import { View, Text, Image, ScrollView, Button } from "@tarojs/components";
import { useEffect, useState } from "react";
import PlaylistCard from "@/components/PlaylistCard";
import SingerCard from "@/components/SingerCard";
import { ROUTE_COLLECT_PLAYLIST, ROUTE_COLLECT_SINGER } from "@/constants";
import Taro from "@tarojs/taro";
import { removeStorageCookies, removeStorageUserInfo } from "@/storage";
import PlayerPanel from "@/components/PlayerPanel";
import { usePlayerStore } from "@/store/player";
import playFillSvg from "../../assets/svgs/play-fill.svg";
import heartPulseFillSvg from "../../assets/svgs/heart-pulse-fill.svg";
import { pxTransform } from "@tarojs/taro";
import {
  playSong,
  playWholePlaylist,
  startHeartbeatMode,
} from "@/module/backgroundAudio";
import { getSongDetail } from "@/utils/getSongDetail";

const randomSizes = [
  {
    imgSize: 40,
    textFontSize: 30,
    animationDuration: 20,
  },
  {
    imgSize: 26,
    textFontSize: 20,
    animationDuration: 22,
  },
  {
    imgSize: 44,
    textFontSize: 33,
    animationDuration: 24,
  },
  {
    imgSize: 44,
    textFontSize: 36,
    animationDuration: 26,
  },
  {
    imgSize: 48,
    textFontSize: 39,
    animationDuration: 28,
  },
  {
    imgSize: 52,
    textFontSize: 42,
    animationDuration: 30,
  },
  {
    imgSize: 56,
    textFontSize: 45,
    animationDuration: 32,
  },
  {
    imgSize: 60,
    textFontSize: 48,
    animationDuration: 34,
  },
];

const Me = () => {
  const { userInfo, likeListIds } = useUserInfoStore();
  const [collectList, setCollectList] = useState([]);
  const [singers, setSingers] = useState([]);
  const { showPlayer, setPlayerState } = usePlayerStore();
  const [randomLikedSongs, setRandomLikedSongs] = useState([]);
  const [randomSongSizes, setRandomSongSizes] = useState([]);

  useEffect(() => {
    if (!likeListIds.size) return;

    const list = Array.from(likeListIds);
    const ids = list.length < 10 ? list : [];

    if (ids.length === 0) {
      for (let i = 0; i < 10; i++) {
        ids.push(list[Math.floor(Math.random() * list.length)]);
      }
    }

    reqSongDetail({ ids: ids.join(",") }).then((res) => {
      if (res.code === 200) {
        setRandomLikedSongs(
          res.songs.map((x) => ({
            id: x.id,
            name: x.name,
            picUrl: x.al.picUrl,
          }))
        );
        setRandomSongSizes(
          res.songs.map(
            () => randomSizes[Math.floor(Math.random() * randomSizes.length)]
          )
        );
      }
    });
  }, [likeListIds]);

  const findHeartbeatModePlaylist = (playlist) => {
    if (!playlist.length) return;

    const userId = userInfo.account.id;

    let id = playlist.find((x) => x.creator.userId === userId).id;

    if (!id) {
      playlist = playlist.filter((x) => x.creator.userId !== userId);

      if (!playlist.length) return;

      id = playlist[Math.floor(Math.random() * playlist.length)].id;
    }

    if (!id) return;

    setPlayerState(() => ({ heartbeatPlaylistId: id }));
  };

  useEffect(() => {
    if (userInfo) {
      const id = userInfo.account.id;

      reqUserPlaylist({ uid: id, limit: 30, offset: 0 }).then((res) => {
        findHeartbeatModePlaylist(res.playlist);
        setCollectList(
          res.playlist
            .filter((x) => x.creator.userId !== id)
            .map((x) => ({
              id: x.id,
              name: x.name,
              playCount: x.playCount,
              coverImgUrl: x.coverImgUrl,
            }))
        );
      });

      reqUserSingers({ limit: 25 }).then((res) => {
        setSingers(
          res.data.map((x) => ({
            id: x.id,
            img1v1Url: x.img1v1Url,
            name: x.name,
          }))
        );
      });
    }
  }, [userInfo]);

  const handleLogout = () => {
    Taro.showModal({
      content: "确认退出登录？",
      confirmColor: "#fa233b",
      success: function (res) {
        if (res.confirm) {
          reqLogout().then(() => {
            removeStorageCookies();
            removeStorageUserInfo();
            useUserInfoStore.setState({
              likeListIds: new Set(),
              userInfo: null,
            });
          });
        }
      },
    });
  };

  const handlePlayLikeList = () => {
    setPlayerState(() => ({
      isPersonalFm: false,
      isHeartbeatMode: false,
    }));
    const likeList = Array.from(likeListIds);
    reqSongDetail({ ids: likeList[0] }).then((res) => {
      playWholePlaylist(likeList.slice(1), getSongDetail(res.songs[0]));
    });
  };

  return (
    <View className="h-full bg-bgPrimary">
      <ScrollView className="h-full" scrollY>
        {userInfo ? null : (
          <NoticeLogin
            topSubTitle="曲库与设置"
            topTitle="我的"
            notice="账号信息需要登录"
          />
        )}

        {userInfo ? (
          <View className="pb-10">
            <View className="p-10 flex justify-between items-center bg-[linear-gradient(#fff,#f4f4f4)]">
              <View>
                <Text className="text-[64px] font-bold text-textPrimary mr-5">
                  我的
                </Text>
                <Text className="text-[24px]">曲库设置</Text>
              </View>
            </View>
            <View className=" p-5 mx-10 bg-white rounded-[20px] flex">
              <Image
                src={userInfo.profile.avatarUrl}
                className="w-[120px] h-[120px] rounded-[50%] border-solid border-gray-300 border-[1px]"
              />
              <View className="text-[32px] font-bold ml-4">
                {userInfo.profile.nickname}
              </View>
            </View>

            <View
              className="mt-10 mx-10 text-white aspect-square bg-center bg-no-repeat bg-cover rounded-[20px] overflow-hidden"
              style={{ backgroundImage: `url(${userInfo.profile.avatarUrl})` }}
            >
              <View className="h-full relative backdrop-blur-[40px] bg-[rgba(0,0,0,.1)] overflow-hidden">
                <View className="text-center my-10">
                  <Text className="text-[72px] font-bold">我喜欢的音乐</Text>
                  <Text className="text-[32px] ml-3">{likeListIds.size}首</Text>
                </View>

                {randomLikedSongs.map((x, i) => (
                  <View
                    style={{
                      animationDuration: randomSongSizes.length
                        ? `${randomSongSizes[i].animationDuration}s`
                        : undefined,
                    }}
                    key={x.id}
                    className="flex items-center animate-[my-like-list_ease-in-out_infinite_alternate]"
                  >
                    <Image
                      src={x.picUrl}
                      style={{
                        width: pxTransform(
                          randomSongSizes.length
                            ? randomSongSizes[i].imgSize
                            : 0
                        ),
                        height: pxTransform(
                          randomSongSizes.length
                            ? randomSongSizes[i].imgSize
                            : 0
                        ),
                      }}
                    />
                    <Text
                      style={{
                        fontSize: pxTransform(
                          randomSongSizes.length
                            ? randomSongSizes[i].textFontSize
                            : 0
                        ),
                      }}
                      className="ml-4"
                    >
                      {x.name}
                    </Text>
                  </View>
                ))}

                <View
                  onClick={handlePlayLikeList}
                  className="w-[100px] h-[100px] flex justify-center items-center absolute bottom-5 left-5  bg-[rgba(255,255,255,.6)] rounded-[50%]"
                >
                  <Image src={playFillSvg} className=" w-12 h-12" />
                </View>

                <View
                  onClick={startHeartbeatMode}
                  className="w-[100px] h-[100px] flex justify-center items-center absolute bottom-5 right-5  bg-[rgba(255,255,255,.6)] rounded-[50%]"
                >
                  <Image src={heartPulseFillSvg} className="w-12 h-12" />
                </View>
              </View>
            </View>

            <PlaylistTitle
              className="mt-10 mx-10"
              showMoreBtn
              right="全部"
              left="收藏的歌单"
              onViewMore={() => {
                Taro.navigateTo({
                  url: ROUTE_COLLECT_PLAYLIST,
                });
              }}
            />
            <ScrollView
              className="flex h-[560px] whitespace-nowrap"
              scrollX
              enableFlex
            >
              {collectList.map((item, index) => (
                <PlaylistCard
                  key={item.id}
                  coverImgUrl={item.coverImgUrl}
                  name={item.name}
                  playCount={item.playCount}
                  className="pl-10"
                  isLastOne={index === collectList.length - 1}
                  id={item.id}
                />
              ))}
            </ScrollView>
            <PlaylistTitle
              className="mt-10 mx-10"
              showMoreBtn
              right="全部"
              left="收藏的歌手"
              onViewMore={() => {
                Taro.navigateTo({
                  url: ROUTE_COLLECT_SINGER,
                });
              }}
            />
            <View className="flex justify-between flex-wrap px-10">
              {singers.map((singer) => (
                <SingerCard
                  key={singer.id}
                  id={singer.id}
                  img1v1Url={singer.img1v1Url}
                  name={singer.name}
                />
              ))}
              {singers.length % 3 === 1 ? (
                <>
                  <View className="w-[200px] h-[200px]"></View>
                  <View className="w-[200px] h-[200px]"></View>
                </>
              ) : null}
              {singers.length % 3 === 2 ? (
                <View className="w-[200px] h-[200px]"></View>
              ) : null}
            </View>
            <Button
              className="mc-default-button mx-10 w-auto"
              onClick={handleLogout}
            >
              退出登录
            </Button>
          </View>
        ) : null}
        {showPlayer && <View className="h-[130px]" />}
      </ScrollView>
      <PlayerPanel />
    </View>
  );
};

export default Me;
