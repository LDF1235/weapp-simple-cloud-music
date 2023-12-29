import ScrollBottomLoading from "@/components/ScrollBottomLoading";
import SingerCard from "@/components/SingerCard";
import { reqMoreSingerList } from "@/services";
import { useEffect, useRef, useState } from "react";
import { ScrollView, View } from "@tarojs/components";
import { safeAreaRect } from "@/module/safeAreaRect";
import PlayerPanel from "@/components/PlayerPanel";
import clsx from "clsx";
import { usePlayerStore } from "@/store/player";

const MoreSinger = () => {
  const [singerList, setSingerList] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const { showPlayer } = usePlayerStore();
  const isPrevRequestOkRef = useRef(true);
  const offsetRef = useRef(0);

  const getMoreSinger = async () => {
    const response = await reqMoreSingerList({
      offset: offsetRef.current,
      limit: 30,
    });

    if (response.code === 200) {
      setHasMore(response.more);
      setSingerList((pre) => [...pre, ...response.artists]);
    }
  };

  useEffect(() => {
    getMoreSinger();
  }, []);

  const listScrollToLower = () => {
    if (!hasMore || !isPrevRequestOkRef.current) return;

    isPrevRequestOkRef.current = false;

    getMoreSinger().then(() => {
      isPrevRequestOkRef.current = true;
    });
  };

  return (
    <View
      className="h-full bg-bgPrimary"
      style={{ paddingBottom: safeAreaRect.bottom }}
    >
      <View className={clsx("h-full", showPlayer ? "pb-[130px]" : "")}>
        <ScrollView
          enableFlex
          scrollY
          enhanced
          onScrollToLower={listScrollToLower}
          className="h-full"
        >
          <View className="px-10 flex justify-between flex-wrap box-border">
            {singerList.map((singer) => (
              <SingerCard key={singer.id} {...singer} className="pt-0 mt-5" />
            ))}
            {singerList.length % 3 === 1 ? (
              <>
                <View className="w-[200px] h-[200px]"></View>
                <View className="w-[200px] h-[200px]"></View>
              </>
            ) : null}
            {singerList.length % 3 === 2 ? (
              <View className="w-[200px] h-[200px]"></View>
            ) : null}
            {hasMore && <ScrollBottomLoading />}
          </View>
        </ScrollView>
      </View>
      <PlayerPanel />
    </View>
  );
};

export default MoreSinger;
