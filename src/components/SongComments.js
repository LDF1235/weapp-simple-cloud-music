import LoadImg from "@/components/LoadImg";
import { View, Text, Image, ScrollView } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useCallback, useEffect, useRef, useState } from "react";
import recommendPng from "@/assets/images/recommend.png";
import { reqSongHotComments } from "@/services";
import { countFormatter } from "@/utils/countFormatter";
import { format } from "date-fns";
import authPng from "@/assets/images/auth.png";
import vip1 from "@/assets/images/vip1.png";
import vip2 from "@/assets/images/vip2.png";
import vip3 from "@/assets/images/vip3.png";
import vip4 from "@/assets/images/vip4.png";
import vip5 from "@/assets/images/vip5.png";
import vip6 from "@/assets/images/vip6.png";
import vip7 from "@/assets/images/vip7.png";
import ScrollBottomLoading from "./ScrollBottomLoading";
import { usePlayerStore } from "@/store/player";
import clsx from "clsx";
import { safeAreaRect } from "@/module/safeAreaRect";

const vipPngArr = [vip1, vip2, vip3, vip4, vip5, vip6, vip7];

const SongComments = () => {
  const { currentSong } = usePlayerStore();
  const [comments, setComments] = useState([]);
  const [showBottomLoading, setShowBottomLoading] = useState(false);
  const isFirstRequestRef = useRef(true);
  const isPrevRequestSucceedRef = useRef(true);
  const hasMoreRef = useRef(true);
  const requestTimesRef = useRef(0);

  const fetchSongHotComments = useCallback(async (param) => {
    if (!isPrevRequestSucceedRef.current) return;

    if (isFirstRequestRef.current) {
      Taro.showLoading({ title: "加载中..." });
    } else {
      setShowBottomLoading(true);
    }

    isPrevRequestSucceedRef.current = false;
    const response = await reqSongHotComments(param);

    if (response.code === 200) {
      isPrevRequestSucceedRef.current = true;
      requestTimesRef.current++;

      if (isFirstRequestRef.current) {
        Taro.hideLoading();
        isFirstRequestRef.current = false;
      }
      const { hotComments, hasMore } = response;

      !hasMore && setShowBottomLoading(false);
      hasMoreRef.current = hasMore;

      if (!hasMore && !isFirstRequestRef.current) {
        Taro.showToast({ title: "没有更多了...", icon: "none" });
      }

      setComments((pre) => [...pre, ...hotComments]);
    }
  }, []);

  useEffect(() => {
    if (currentSong.id) {
      fetchSongHotComments({
        id: currentSong.id,
        type: 0,
        limit: 20,
        offset: 0,
      });
    }
  }, [currentSong.id, fetchSongHotComments]);

  const commentScrollToLower = () => {
    if (showBottomLoading) {
      const { id } = currentSong || {};

      if (id && hasMoreRef.current) {
        fetchSongHotComments({
          id,
          type: 0,
          limit: 20,
          offset: requestTimesRef.current * 20,
        });
      }
    }
  };

  return (
    <View
      style={{ paddingBottom: safeAreaRect.bottom }}
      className={clsx(" h-screen overflow-hidden")}
    >
      <ScrollView
        enableFlex
        scrollY
        onScrollToLower={commentScrollToLower}
        showScrollbar
        enhanced
        className="h-full"
      >
        {comments.map((item) => (
          <View className="px-5" key={item.commentId}>
            <View className="py-10 border-b-[1px] border-solid border-[#e5e5e5]">
              <View className="flex justify-between items-center text-[rgb(136,136,136)] text-[24px]">
                <View className="flex items-center">
                  <LoadImg
                    src={item.user.avatarUrl}
                    className="w-[60px] h-[60px] rounded-[50%]"
                  />
                  <View className="flex flex-col justify-between ml-5">
                    <View className="grow-0 flex items-center">
                      <View className="align-top mr-2.5">
                        {item.user.nickname}
                      </View>
                      {item.user?.authStatus === 1 && (
                        <Image className="w-5 h-5 ml-1" src={authPng} />
                      )}
                      {!!item.user?.vipRights && (
                        <Image
                          className="w-[60px] h-5 ml-1"
                          src={vipPngArr[item.user?.vipRights?.redVipLevel - 1]}
                        />
                      )}
                    </View>
                    <View>{format(item.time, "yyyy-MM-dd HH:mm:ss")}</View>
                  </View>
                </View>
                <View className="flex items-center">
                  <Image className="w-6 h-6" src={recommendPng} />
                  <Text className="ml-2.5">
                    {countFormatter(item.likedCount)}
                  </Text>
                </View>
              </View>

              <View className="mt-5 text-[32px] text-[#333]">
                {item.content}
              </View>

              {Array.isArray(item.beReplied) && item.beReplied.length > 0
                ? item.beReplied.map((beReplied) => (
                    <View
                      className="mt-2 rounded-lg p-2 text-[24px] bg-[rgb(235,235,235)]"
                      key={beReplied.beRepliedCommentId}
                    >
                      {`@ ${beReplied.user.nickname}：${beReplied.content}`}
                    </View>
                  ))
                : null}
            </View>
          </View>
        ))}
        {showBottomLoading && <ScrollBottomLoading />}
      </ScrollView>
    </View>
  );
};

export default SongComments;
