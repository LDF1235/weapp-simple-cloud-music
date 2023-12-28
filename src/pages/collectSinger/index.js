import ScrollBottomLoading from "@/components/ScrollBottomLoading";
import SingerCard from "@/components/SingerCard";
import { reqUserSingers } from "@/services";
import { useEffect, useRef, useState } from "react";
import { ScrollView, View } from "@tarojs/components";
import { safeAreaRect } from "@/module/safeAreaRect";

const Index = () => {
  const [singerList, setSingerList] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  const isPrevRequestOkRef = useRef(true);
  const offsetRef = useRef(0);

  const getSingers = async () => {
    const response = await reqUserSingers({
      offset: offsetRef.current,
      limit: 30,
    });

    if (response.code === 200) {
      offsetRef.current+=30;
      setHasMore(response.more);
      setSingerList((prev) =>
        prev.concat(
          response.data.map((x) => ({
            id: x.id,
            img1v1Url: x.img1v1Url,
            name: x.name,
          }))
        )
      );
    }
  };

  useEffect(() => {
    getSingers();
  }, []);

  const listScrollToLower = () => {
    if (!hasMore || !isPrevRequestOkRef.current) return;

    isPrevRequestOkRef.current = false;

    getSingers().then(() => {
      isPrevRequestOkRef.current = true;
    });
  };

  return (
    <View
      className="h-full bg-bgPrimary"
      style={{ paddingBottom: safeAreaRect.bottom }}
    >
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
  );
};

export default Index;
