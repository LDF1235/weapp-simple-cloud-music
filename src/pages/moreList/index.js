import { useCallback, useEffect, useRef, useState } from "react";
import Taro, { useRouter } from "@tarojs/taro";
import ScrollBottomLoading from "@/components/ScrollBottomLoading";
import { reqMoreHighQualityPlaylist, reqMorePlaylist } from "@/services";
import { ScrollView, View } from "@tarojs/components";
import PlaylistCard from "@/components/PlaylistCard";

const MoreList = () => {
  const router = useRouter();

  const [playlist, setPlaylist] = useState([]);
  const [showScrollLoading, setShowScrollLoading] = useState(false);

  const maxRequestTimesRef = useRef(0);
  const moreListRequestTimesRef = useRef(0);
  const isLastRequestSuccess = useRef(false);

  const getMoreList = useCallback(
    async (param) => {
      isLastRequestSuccess.current = false;

      const { type, cat } = router.params;
      const { offset, before } = param;
      let response = null;

      if (type === "featured" || type === "official") {
        response = await reqMorePlaylist({ cat, limit: 20, offset });
      } else if (type === "highQuality") {
        response = await reqMoreHighQualityPlaylist({ cat, limit: 20, before });
      }

      if (response.code === 200) {
        isLastRequestSuccess.current = true;

        if (maxRequestTimesRef.current === 0) {
          Taro.hideLoading();
          setShowScrollLoading(true);
        }

        maxRequestTimesRef.current = Math.ceil(response.total / 20);
        moreListRequestTimesRef.current++;
        setPlaylist((pre) => [...pre, ...response.playlists]);

        if (moreListRequestTimesRef.current >= maxRequestTimesRef.current) {
          setShowScrollLoading(false);
        }
      }
    },
    [router]
  );

  useEffect(() => {
    Taro.showLoading({ title: "加载中" });
    getMoreList({ offset: 0, before: 0 });
  }, [router, getMoreList]);

  const listScrollToLower = () => {
    if (
      isLastRequestSuccess.current &&
      moreListRequestTimesRef.current < maxRequestTimesRef.current
    ) {
      const { type } = router.params;

      if (type === "featured" || type === "official") {
        const offset = moreListRequestTimesRef.current * 20;
        getMoreList({ offset });
      } else if (type === "highQuality") {
        getMoreList({
          before: playlist.length
            ? playlist[playlist.length - 1].updateTime
            : 0,
        });
      }
    }
  };

  return (
    <View className=" h-full bg-bgPrimary mc-page">
      <ScrollView
        enableFlex
        scrollY
        enhanced
        onScrollToLower={listScrollToLower}
        className="w-full px-10 pb-5 flex justify-between flex-wrap box-border h-full"
      >
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
        {showScrollLoading && <ScrollBottomLoading />}
      </ScrollView>
    </View>
  );
};

export default MoreList;
