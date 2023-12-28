import React from "react";
import { View, Text, Image } from "@tarojs/components";
import Taro from "@tarojs/taro";
import clsx from "clsx";
import arrowRightSLineSvg from "../assets/svgs/arrow-right-s-line.svg";

const stringify = (target) => {
  return Object.entries(target)
    .map((item) => `${item[0]}=${item[1]}`)
    .join("&");
};

const PlaylistTitle = (props) => {
  const { left, showMoreBtn, className, right = "更多", onViewMore } = props;

  const viewMoreList = () => {
    const { moreListParam, moreListPath } = props;

    if (moreListPath && !moreListParam) {
      Taro.navigateTo({ url: moreListPath });
    } else {
      const param = { ...moreListParam, topBarText: left };
      const str = stringify(param);
      Taro.navigateTo({ url: `${moreListPath}?${str}` });
    }
  };

  return (
    <View className={clsx("flex justify-between items-center mb-5", className)}>
      <Text className="text-[40px] font-bold">{left}</Text>
      {showMoreBtn && (
        <View
          className="flex items-center text-[28px] font-bold text-[rgb(102,102,102)]"
          onClick={onViewMore || viewMoreList}
        >
          <Text className="mr-5">{right}</Text>
          <Image src={arrowRightSLineSvg} className="h-8 w-8" />
        </View>
      )}
    </View>
  );
};

export default PlaylistTitle;
