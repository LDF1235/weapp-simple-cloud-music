import React from "react";
import { Text, View } from "@tarojs/components";
import Taro, { pxTransform } from "@tarojs/taro";
import LoadImg from "./LoadImg";
import { ROUTE_PLAYLIST } from "@/constants";
import clsx from "clsx";
import { countFormatter } from "@/utils/countFormatter";

const PlaylistCard = (props) => {
  const {
    className,
    coverImgUrl,
    playCount,
    name,
    copywriter,
    isLastOne = false,
    id,
    width = 440,
    titleClassName,
  } = props;

  const playlistCardOnClick = () => {
    Taro.navigateTo({
      url: `${ROUTE_PLAYLIST}?id=${id}`,
    });
  };

  return (
    <View
      className={clsx(
        "flex flex-col",
        isLastOne ? "pr-10 box-border" : "pr-0 box-content",
        className
      )}
      onClick={playlistCardOnClick}
    >
      <LoadImg
        src={coverImgUrl}
        style={{
          width: pxTransform(width),
          height: pxTransform(width),
        }}
        className="rounded-[16px]"
      />
      <View
        className="flex items-center my-[6px] mx-0 text-[rgb(146,146,146)] text-[24px]"
        style={{ width: pxTransform(width) }}
      >
        <Text className="iconfont icon-bofangsanjiaoxing mr-2"></Text>
        <Text>{countFormatter(playCount)}</Text>
      </View>
      <View
        style={{
          width: pxTransform(width),
        }}
        className={clsx(
          "h-[72px] leading-9 text-[28px] font-bold text-ellipsis whitespace-normal line-clamp-2",
          titleClassName
        )}
      >
        {name}
      </View>
      {copywriter && (
        <View
          style={{ width: pxTransform(width) }}
          className="h-[52px] text-[24px] text-[#929292] text-ellipsis whitespace-normal line-clamp-2"
        >
          {copywriter}
        </View>
      )}
    </View>
  );
};

export default PlaylistCard;
