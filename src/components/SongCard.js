import React from "react";
import { View } from "@tarojs/components";

import LoadImg from "./LoadImg";
import clsx from "clsx";

const SongCard = (props) => {
  const {
    id,
    picUrl,
    name,
    epname,
    durationTime,
    singers,
    className,
    titleClassName,
    subTitleClassName,
  } = props;
  const singersAndEpname = `${singers || "-"}-${epname}`;

  return (
    <View
      className={clsx(
        "flex items-center w-full h-[120px] pl-10 border-b-[1px] border-solid border-[rgba(197,197,197,.3)] box-border",
        className
      )}
    >
      <LoadImg
        src={picUrl}
        className="!w-[92px] !h-[92px] grow-0 shrink-0 rounded-lg mr-3"
      />
      <View className="flex-1 h-full overflow-hidden flex flex-col justify-center">
        <View
          className={clsx(
            "text-[36px] w-full text-textPrimary whitespace-nowrap overflow-hidden text-ellipsis"
          )}
        >
          {name}
        </View>
        <View
          className={clsx(
            "text-[28px] mt-3 w-full text-[rgb(185,185,185)] whitespace-nowrap overflow-hidden text-ellipsis"
          )}
        >
          {singersAndEpname}
        </View>
      </View>
    </View>
  );
};

export default SongCard;
