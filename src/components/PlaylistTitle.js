import React from "react";
import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import clsx from "clsx";

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
          onClick={onViewMore||viewMoreList}
        >
          <Text className="mr-5">{right}</Text>
          <Text className="iconfont icon-youjiantou"></Text>
        </View>
      )}
    </View>
  );
};

export default PlaylistTitle;
