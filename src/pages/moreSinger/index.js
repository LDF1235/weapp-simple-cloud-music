import ScrollBottomLoading from "@/components/ScrollBottomLoading";
import SingerCard from "@/components/SingerCard";
import { reqMoreSingerList } from "@/services";
import Taro, { pxTransform } from "@tarojs/taro";
import { useCallback, useEffect, useRef, useState } from "react";
import { ScrollView, View } from "@tarojs/components";
import clsx from "clsx";

const MoreSinger = () => {
  const [singerList, setSingerList] = useState([]);
  const [showScrollLoading, setShowScrollLoading] = useState(false);

  const hasMoreRef = useRef(true);
  const isLastRequestSuccessRef = useRef(true);

  const getMoreSinger = useCallback(async (params = { offset: 0 }) => {
    isLastRequestSuccessRef.current = false;
    const response = await reqMoreSingerList({ ...params, limit: 30 });

    if (response.code === 200) {
      const { more } = response;
      Taro.hideLoading();
      isLastRequestSuccessRef.current = true;
      setSingerList((pre) => [...pre, ...response.artists]);
      setShowScrollLoading(true);
      hasMoreRef.current = response.more;

      if (!more) setShowScrollLoading(false);
    }
  }, []);

  useEffect(() => {
    Taro.showLoading({ title: "加载中..." });
    getMoreSinger();
  }, [getMoreSinger]);

  const listScrollToLower = () => {
    if (hasMoreRef.current && isLastRequestSuccessRef.current) {
      getMoreSinger({ offset: singerList.length });
    }
  };

  return (
    <View className="h-full bg-bgPrimary mc-page">
      <ScrollView
        enableFlex
        scrollY
        enhanced
        onScrollToLower={listScrollToLower}
        className="h-full"
      >
        <View className="px-10 flex justify-between flex-wrap box-border">
          {singerList.map((singer) => (
            <SingerCard
              key={singer.id}
              {...singer}
              style={{
                paddingTop: 0,
                marginTop: pxTransform(20),
              }}
            />
          ))}
          {showScrollLoading && <ScrollBottomLoading />}
        </View>
      </ScrollView>
    </View>
  );
};

export default MoreSinger;
