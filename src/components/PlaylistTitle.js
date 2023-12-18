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
  const { leftContent, showMoreBtn, className } = props;

  const viewMoreList = () => {
    const { moreListParam, moreListPath } = props;

    if (moreListPath && !moreListParam) {
      Taro.navigateTo({ url: moreListPath });
    } else {
      const param = { ...moreListParam, topBarContent: leftContent };
      const str = stringify(param);
      Taro.navigateTo({ url: `${moreListPath}?${str}` });
    }
  };

  return (
    <View
      className={clsx(
        "flex justify-between items-center py-0 px-10 mb-5",
        className
      )}
    >
      <Text className="text-[40px] font-bold">{leftContent}</Text>
      {showMoreBtn && (
        <View
          className="flex items-center text-[28px] font-bold text-[rgb(102,102,102)]"
          onClick={viewMoreList}
        >
          <Text className="mr-5">更多</Text>
          <Text className="iconfont icon-youjiantou"></Text>
        </View>
      )}
    </View>
  );
};

export default PlaylistTitle;
