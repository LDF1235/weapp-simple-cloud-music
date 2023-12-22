import { useEffect, useMemo, useState } from "react";
import { usePlayerStore } from "@/store/player";
import { ScrollView, View } from "@tarojs/components";

const toMillisecond = (str) => {
  const [minute, second, millisecond] = str.match(
    /\d{2}(?=:)|\d{2}(?=\.)|\d{2}/g
  );
  return (
    parseInt(minute) * 60 * 1000 +
    parseInt(second) * 1000 +
    parseInt(millisecond)
  );
};

const LyricSection = (props) => {
  const { lyric } = props;
  const lyricArr = useMemo(
    () =>
      lyric?.trim()
        ? lyric
            ?.split("\n")
            .filter(Boolean)
            .map((item) => item.split("]"))
            .map((item) => [toMillisecond(item[0].slice(1)), item[1]])
        : [],
    [lyric]
  );
  const {
    currentSong: { currentTime },
  } = usePlayerStore();

  const [isDragging, setIsDragging] = useState(false);
  const [idIndex, setIdIndex] = useState(0);

  useEffect(() => {
    if (!isDragging) {
      const lyricItemIndex = lyricArr.findIndex((item, index, arr) => {
        if (item[0] <= currentTime) {
          const nextEle = arr[index + 1];
          return nextEle ? nextEle[0] > currentTime : true;
        }

        return false;
      });
      if (lyricItemIndex !== -1) {
        setIdIndex(lyricItemIndex);
      }
    }
  }, [currentTime, isDragging, lyricArr]);

  const id = `timeId${lyricArr[idIndex]?.[0]}`;

  return (
    <ScrollView
      enableFlex
      scrollY
      enhanced
      scrollIntoView={id}
      onDragStart={() => {
        setIsDragging(true);
      }}
      onDragEnd={() => {
        setIsDragging(false);
      }}
      scrollWithAnimation
      className="h-[54vh] pb-10 relative"
    >
      {Array.isArray(lyricArr) && lyricArr.length > 0 ? (
        <>
          {lyricArr.map((item, index) => (
            <View
              className="p-10 text-[40px] leading-[1.15] text-white font-bold"
              key={item[0]}
              id={`timeId${item[0]}`}
              style={{
                filter: `blur(${
                  Math.abs(index - idIndex) <= 6 &&
                  Math.abs(index - idIndex) >= 0
                    ? `${index - idIndex}px`
                    : "0px"
                })`,
              }}
            >
              {item[1] || "..."}
            </View>
          ))}
          <View className="h-[54vh] p-10 text-[40px] leading-[1.15] text-white font-bold">
            ...
          </View>
        </>
      ) : (
        <View className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-white text-[40px] w-full text-center">
          当前歌曲暂无歌词
        </View>
      )}
    </ScrollView>
  );
};

export default LyricSection;
