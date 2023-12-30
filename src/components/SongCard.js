import React from "react";
import { Image, View } from "@tarojs/components";
import LoadImg from "./LoadImg";
import clsx from "clsx";
import { usePlayerStore } from "@/store/player";
import { playSong } from "@/module/backgroundAudio";
import heartFillPrimarySvg from "../assets/svgs/heart-fill-primary.svg";
import { useUserInfoStore } from "@/store/userInfo";
import { useState } from "react";

const barDelays = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];

const SongCard = (props) => {
  const { id, picUrl, name, epname, durationTime, singers, className } = props;
  const singersAndEpname = `${singers || "-"}-${epname}`;
  const [activeBarDelays] = useState(() =>
    Array.from(
      { length: 4 },
      () => barDelays[Math.floor(Math.random() * barDelays.length)]
    )
  );
  const { currentSong, isPlaying } = usePlayerStore();
  const { likeListIds } = useUserInfoStore();

  const songCardOnClick = () => {
    if (currentSong.id === id) return;

    const songDetail = { id, picUrl, name, epname, singers, durationTime };
    playSong(songDetail);
  };

  return (
    <View
      onClick={songCardOnClick}
      className={clsx(
        "flex items-center w-full h-[120px] border-b-[1px] border-solid border-[rgba(197,197,197,.3)] box-border",
        className
      )}
    >
      <Image
        src={heartFillPrimarySvg}
        className={clsx(
          "w-10 h-10 px-2",
          likeListIds.has(id) ? "" : "invisible"
        )}
      />
      <View className="w-[92px] h-[92px] relative">
        {currentSong.id === id && (
          <View className="absolute left-0 top-0 w-full h-full p-3">
            <View className="overflow-hidden w-full h-full flex justify-between">
              <View
                style={{
                  animationDelay: `${activeBarDelays[0]}s`,
                  animationPlayState: isPlaying ? "running" : "paused",
                }}
                className="animate-[personal-fm_1s_ease-in-out_infinite_alternate] h-full translate-y-full w-3 bg-white border-t-[1px] border-solid border-primary"
              />
              <View
                style={{
                  animationDelay: `${activeBarDelays[1]}s`,
                  animationPlayState: isPlaying ? "running" : "paused",
                }}
                className="animate-[personal-fm_1s_ease-in-out_infinite_alternate] h-full translate-y-full w-3 bg-white border-t-[1px] border-solid border-primary"
              />
              <View
                style={{
                  animationDelay: `${activeBarDelays[2]}s`,
                  animationPlayState: isPlaying ? "running" : "paused",
                }}
                className="animate-[personal-fm_1s_ease-in-out_infinite_alternate] h-full translate-y-full w-3 bg-white border-t-[1px] border-solid border-primary"
              />
              <View
                style={{
                  animationDelay: `${activeBarDelays[3]}s`,
                  animationPlayState: isPlaying ? "running" : "paused",
                }}
                className="animate-[personal-fm_1s_ease-in-out_infinite_alternate] h-full translate-y-full w-3 bg-white border-t-[1px] border-solid border-primary"
              />
            </View>
          </View>
        )}

        <LoadImg src={picUrl} className=" w-full h-full rounded-lg" />
      </View>
      <View className="flex-1 h-full ml-3 overflow-hidden flex flex-col justify-center pr-10">
        <View
          className={clsx(
            "text-[36px] leading-normal w-full text-textPrimary whitespace-nowrap overflow-hidden text-ellipsis",
            props.titleClassName
          )}
        >
          {name}
        </View>
        <View
          className={clsx(
            "text-[28px] leading-normal w-full text-[rgb(185,185,185)] whitespace-nowrap overflow-hidden text-ellipsis",
            props.subTitleClassName
          )}
        >
          {singersAndEpname}
        </View>
      </View>
    </View>
  );
};

export default SongCard;
