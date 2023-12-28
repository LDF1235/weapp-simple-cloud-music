import NoticeLogin from "@/components/NoticeLogin";
import PlaylistTitle from "@/components/PlaylistTitle";
import { reqLogout, reqUserPlaylist, reqUserSingers } from "@/services";
import { useUserInfoStore } from "@/store/userInfo";
import { View, Text, Image, ScrollView, Button } from "@tarojs/components";
import { useEffect, useState } from "react";
import PlaylistCard from "@/components/PlaylistCard";
import SingerCard from "@/components/SingerCard";
import { ROUTE_COLLECT_PLAYLIST, ROUTE_COLLECT_SINGER } from "@/constants";
import Taro from "@tarojs/taro";
import { remoteStorageCookies, remoteStorageUserInfo } from "@/storage";

const Me = () => {
  const { userInfo } = useUserInfoStore();
  const [collectList, setCollectList] = useState([]);
  const [singers, setSingers] = useState([]);

  useEffect(() => {
    if (userInfo) {
      const id = userInfo.account.id;

      reqUserPlaylist({ uid: id, limit: 30, offset: 0 }).then((res) => {
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
            remoteStorageCookies();
            remoteStorageUserInfo();
            useUserInfoStore.setState({
              likeListIds: new Set(),
              userInfo: null,
            });
          });
        }
      },
    });
  };

  return (
    <View className="h-full bg-bgPrimary">
      {userInfo ? null : (
        <NoticeLogin
          topSubTitle="曲库与设置"
          topTitle="我的"
          notice="账号信息需要登录"
        />
      )}

      {userInfo ? (
        <ScrollView className="h-full" scrollY>
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
              className="mt-10 mx-10 aspect-square bg-center bg-no-repeat bg-cover rounded-[20px] overflow-hidden"
              style={{ backgroundImage: `url(${userInfo.profile.avatarUrl})` }}
            >
              <View className="h-full backdrop-blur-[40px] bg-[rgba(0,0,0,.1)]"></View>
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
        </ScrollView>
      ) : null}
    </View>
  );
};

export default Me;
