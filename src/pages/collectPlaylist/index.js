import { safeAreaRect } from "@/module/safeAreaRect";
import { View, ScrollView } from "@tarojs/components";
import PlaylistCard from "@/components/PlaylistCard";
import ScrollBottomLoading from "@/components/ScrollBottomLoading";
import { useState } from "react";
import { useEffect } from "react";
import { reqUserPlaylist } from "@/services";
import { useUserInfoStore } from "@/store/userInfo";
import { useRef } from "react";

const Index = () => {
  const [list, setList] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const { userInfo } = useUserInfoStore();

  const isPrevRequestOkRef = useRef(false);
  const offsetRef = useRef(0);

  const fetchPlaylist = async () => {
    const res = await reqUserPlaylist({
      uid: userInfo.account.id,
      limit: 30,
      offset: offsetRef.current,
    });

    if (res.code === 200) {
      setHasMore(res.more);
      offsetRef.current += 30;
      setList((prev) => [
        ...prev,
        ...res.playlist
          .filter((x) => x.creator.userId !== userInfo.account.id)
          .map((x) => ({
            id: x.id,
            name: x.name,
            playCount: x.playCount,
            coverImgUrl: x.coverImgUrl,
          })),
      ]);
    }
  };

  const handleScrollToLower = () => {
    if (!isPrevRequestOkRef.current || !hasMore) return;

    isPrevRequestOkRef.current = false;
    fetchPlaylist().then(() => {
      isPrevRequestOkRef.current = true;
    });
  };

  useEffect(() => {
    fetchPlaylist();
  }, []);

  return (
    <View
      className=" h-full bg-bgPrimary"
      style={{ paddingBottom: safeAreaRect.bottom }}
    >
      <ScrollView
        enableFlex
        scrollY
        enhanced
        onScrollToLower={handleScrollToLower}
        className="h-full"
      >
        <View className="flex px-10 flex-wrap  justify-between">
          {list.map((item) => (
            <PlaylistCard
              {...item}
              key={item.id}
              className="text-[24px] mb-0 mt-5"
              width={300}
              titleClassName="text-[24px] h-[64px] leading-[32px]"
              copywriter={null}
            />
          ))}
          {hasMore && <ScrollBottomLoading />}
        </View>
      </ScrollView>
    </View>
  );
};

export default Index;
