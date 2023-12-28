import { useEffect, useRef, useState } from "react";
import { useRouter } from "@tarojs/taro";
import ScrollBottomLoading from "@/components/ScrollBottomLoading";
import { reqMorePlaylist } from "@/services";
import { ScrollView, View } from "@tarojs/components";
import PlaylistCard from "@/components/PlaylistCard";
import { safeAreaRect } from "@/module/safeAreaRect";

const MoreList = () => {
  const router = useRouter();

  const [playlist, setPlaylist] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const isPrevRequestOkRef = useRef(true);
  const offsetRef = useRef(0);
  const { cat } = router.params;

  const fetchPlaylist = async () => {
    const res = await reqMorePlaylist({
      cat,
      limit: 20,
      offset: offsetRef.current,
    });

    if (res.code === 200) {
      setHasMore(res.more);
      setPlaylist((pre) => [...pre, ...res.playlists]);
      offsetRef.current += 20;
    }
  };

  useEffect(() => {
    fetchPlaylist();
  }, []);

  const listScrollToLower = () => {
    if (!isPrevRequestOkRef.current || !hasMore) return;

    isPrevRequestOkRef.current = false;
    fetchPlaylist().then(() => {
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

export default MoreList;
