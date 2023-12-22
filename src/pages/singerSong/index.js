import ScrollBottomLoading from "@/components/ScrollBottomLoading";
import SongCard from "@/components/SongCard";
import { safeAreaRect } from "@/module/safeAreaRect";
import { reqMoreSingerSongs } from "@/services";
import { getSongDetail } from "@/utils/getSongDetail";
import { ScrollView, View } from "@tarojs/components";
import Taro, { useRouter } from "@tarojs/taro";
import clsx from "clsx";
import { useCallback, useEffect, useRef, useState } from "react";

const MoreSingerSong = () => {
  const {
    params: { id },
  } = useRouter();
  const [songs, setSongs] = useState([]);
  const [activeTab, setActiveTab] = useState("hot");
  const [isHasMore, setIsHasMore] = useState(true);
  const requestCountRef = useRef(0);
  const isFirstRequest = useRef(true);

  const fetchSong = useCallback(async (params) => {
    if (isFirstRequest.current) {
      Taro.showLoading();
    }

    const response = await reqMoreSingerSongs(params);

    if (response.code === 200) {
      Taro.hideLoading();
      isFirstRequest.current = false;
      const { songs, more } = response;
      !more && setIsHasMore(more);
      requestCountRef.current++;
      setSongs((pre) => [...pre, ...songs]);
    }
  }, []);

  useEffect(() => {
    fetchSong({
      limit: 20,
      offset: 0,
      id: Number(id),
      order: "hot",
    });
  }, [id, fetchSong]);

  const songScrollToLower = () => {
    isHasMore &&
      fetchSong({
        limit: 20,
        offset: requestCountRef.current * 20,
        id: Number(id),
        order: activeTab,
      });
  };

  const tabOnChange = (order) => {
    return () => {
      setIsHasMore(true);
      setActiveTab(order);
      setSongs([]);
      requestCountRef.current = 0;
      fetchSong({
        limit: 20,
        offset: 0,
        id: Number(id),
        order,
      });
    };
  };

  return (
    <View
      className="h-full bg-bgPrimary flex flex-col"
      style={{ paddingBottom: safeAreaRect.bottom }}
    >
      <View className="pt-10 px-10 flex grow-0 shrink-0">
        <View
          className={clsx(
            activeTab === "hot"
              ? "text-primary border-primary"
              : "text-black border-transparent",
            "flex-1 pb-5 font-bold text-[32px] text-center border-b-4 border-solid"
          )}
          onClick={tabOnChange("hot")}
        >
          最热
        </View>
        <View
          className={clsx(
            activeTab === "time"
              ? "text-primary border-primary"
              : "text-black border-transparent",
            "flex-1 pb-5 font-bold text-[32px] text-center border-b-4 border-solid"
          )}
          onClick={tabOnChange("time")}
        >
          最近
        </View>
      </View>

      <View className="flex-1 overflow-hidden">
        <ScrollView
          enableFlex
          scrollY
          showScrollbar
          enhanced
          onScrollToLower={songScrollToLower}
          className="h-full"
        >
          {songs.map((item) => (
            <SongCard
              {...getSongDetail(item)}
              key={item.id}
              isInPlaylist={false}
            />
          ))}
          {isHasMore && <ScrollBottomLoading />}
        </ScrollView>
      </View>
    </View>
  );
};

export default MoreSingerSong;
