import { useEffect, useRef, useState } from "react";
import { useRouter } from "@tarojs/taro";
import ScrollBottomLoading from "@/components/ScrollBottomLoading";
import { reqMoreHighQualityPlaylist } from "@/services";
import { ScrollView, View } from "@tarojs/components";
import PlaylistCard from "@/components/PlaylistCard";
import { safeAreaRect } from "@/module/safeAreaRect";

const Index = () => {
  const router = useRouter();
  const [playlist, setPlaylist] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const isPrevRequestOkRef = useRef(true);

  const getMoreList = async (before) => {
    const { cat } = router.params;
    const res = await reqMoreHighQualityPlaylist({ cat, limit: 20, before });

    if (res.code === 200) {
      setHasMore(res.more);
      setPlaylist((pre) => [...pre, ...res.playlists]);
    }
  };

  useEffect(() => {
    getMoreList(0);
  }, []);

  const listScrollToLower = () => {
    if (!isPrevRequestOkRef.current || !hasMore) return;

    isPrevRequestOkRef.current = false;
    getMoreList(playlist[playlist.length - 1].updateTime).then(() => {
      isPrevRequestOkRef.current = true;
    });
  };

  return (
    <View
      className=" h-full bg-bgPrimary"
      style={{ paddingBottom: safeAreaRect.bottom }}
    >
      <ScrollView
        enableFlex
        scrollY
        enhanced
        onScrollToLower={listScrollToLower}
        className="h-full"
      >
        <View className="flex px-10 flex-wrap  justify-between">
          {playlist.map((item) => (
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
