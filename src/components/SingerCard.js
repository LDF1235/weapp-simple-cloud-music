import React from "react";
import Taro from "@tarojs/taro";

import LoadImg from "./LoadImg";
import clsx from "clsx";
import { ROUTE_SINGER } from "@/constants";
import { View } from "@tarojs/components";

const SingerCard = (props) => {
  const { id, img1v1Url, name, className } = props;

  const viewSingerInfo = (singerId) => {
    Taro.navigateTo({
      url: `${ROUTE_SINGER}?id=${singerId}`,
    });
  };

  return (
    <View
      onClick={() => {
        viewSingerInfo(id);
      }}
      className={clsx("py-5", className)}
    >
      <LoadImg src={img1v1Url} className="w-[200px] h-[200px] rounded-[50%]" />
      <View className="w-[200px] h-[52px] mt-3 text-center text-[24px] text-ellipsis whitespace-normal line-clamp-2">
        {name}
      </View>
    </View>
  );
};

export default SingerCard;
