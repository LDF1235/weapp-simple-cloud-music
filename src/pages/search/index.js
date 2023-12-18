import { showLoading, hideLoading } from "@tarojs/taro";
import { useMemo, useState } from "react";
import { Button, Input, ScrollView, Text, View } from "@tarojs/components";
import SingerCard from "@/components/SingerCard";
import SongCard from "@/components/SongCard";
import { searchResultTabs } from "@/constants";
import { getKeywordItem, setKeywordItem } from "@/storage/storageKeyword";
import { reqSearch, reqSongDetail } from "@/services";
import { getSongDetail } from "@/utils/getSongDetail";
// import BottomPlayPanel from "@/components/BottomPlayPanel";
import PlaylistCard from "@/components/PlaylistCard";
import clsx from "clsx";

const enumSearchTypes = {
  song: 1,
  singer: 100,
  playlist: 1000,
};

const initLocalKeywords = () => {
  return getKeywordItem().data;
};

const Search = () => {
  const [isInputFocus, setIsInputFocus] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState(undefined);
  const [activeTab, setActiveTab] = useState(searchResultTabs[0]);
  const [localKeywords, setLocalKeywords] = useState(initLocalKeywords);
  const [isSearchSucceed, setIsSearchSucceed] = useState(false);
  const [resultSongs, setResultSongs] = useState([]);
  const [resultSingers, setResultSingers] = useState([]);
  const [resultPlaylists, setResultPlaylists] = useState([]);

  const crossWireOnClick = () => {
    setIsInputFocus(true);
    setSearchKeyword(undefined);
  };

  const getAllTypeResult = async (keyword) => {
    const basicParams = { limit: 6, keywords: keyword };
    showLoading();
    setIsSearchSucceed(false);

    const responses = await Promise.all([
      reqSearch({ ...basicParams, type: enumSearchTypes.song }),
      reqSearch({ ...basicParams, type: enumSearchTypes.singer }),
      reqSearch({ ...basicParams, type: enumSearchTypes.playlist }),
    ]);

    if (responses.every((item) => item.code === 200)) {
      const [songRes, singerRes, playlistRes] = responses;
      const songIdStr = songRes.result.songs.map((item) => item.id).join(",");
      setResultSingers(singerRes.result.artists);
      setResultPlaylists(playlistRes.result.playlists);

      const response = await reqSongDetail({ ids: songIdStr });

      if (response.code === 200) {
        hideLoading();
        setIsSearchSucceed(true);
        setResultSongs(response.songs);
      }
    }
  };

  const getSearchResult = async (type, keyword) => {
    if (!keyword?.trim()) return;

    if (type === "all") {
      getAllTypeResult(keyword);
    } else {
      const basicParams = { limit: 30, keywords: keyword };
      switch (type) {
        case "song": {
          showLoading();
          const songRes = await reqSearch({
            ...basicParams,
            type: enumSearchTypes.song,
          });

          if (songRes.code === 200) {
            const songIdStr = songRes.result.songs
              .map((item) => item.id)
              .join(",");
            const detailRes = await reqSongDetail({ ids: songIdStr });

            if (detailRes.code === 200) {
              hideLoading();
              setResultSongs(detailRes.songs);
            }
          }
          break;
        }
        case "singer": {
          showLoading();
          const response = await reqSearch({
            ...basicParams,
            type: enumSearchTypes.singer,
          });

          if (response.code === 200) {
            hideLoading();
            setResultSingers(response.result.artists);
          }
          break;
        }
        case "playlist": {
          showLoading();
          const response = await reqSearch({
            ...basicParams,
            type: enumSearchTypes.playlist,
          });

          if (response.code === 200) {
            hideLoading();
            setResultPlaylists(response.result.playlists);
          }
          break;
        }
        default: {
          break;
        }
      }
    }
  };

  const isSearchButtonDisabled = !searchKeyword?.trim();

  const keywordOnClick = (keyword, keywordIndex) => {
    return () => {
      setSearchKeyword(keyword);
      getSearchResult(activeTab.value, keyword);
      if (keywordIndex !== 0) {
        setLocalKeywords((pre) => {
          const newLocalKeywords = [...pre];
          const firstOne = newLocalKeywords[0];
          newLocalKeywords[keywordIndex] = firstOne;
          newLocalKeywords[0] = keyword;
          return newLocalKeywords;
        });
      }
    };
  };

  const showResultTitle = useMemo(() => {
    return isSearchSucceed && activeTab.value === "all";
  }, [isSearchSucceed, activeTab]);

  const showClearCrossWire = useMemo(() => {
    return searchKeyword?.trim() && isInputFocus;
  }, [isInputFocus, searchKeyword]);

  const showSingerResult = useMemo(() => {
    const { value } = activeTab;
    return value === "all" || value === "singer";
  }, [activeTab]);

  const showSongResult = useMemo(() => {
    const { value } = activeTab;
    return value === "all" || value === "song";
  }, [activeTab]);

  const showPlaylistResult = useMemo(() => {
    const { value } = activeTab;
    return value === "all" || value === "playlist";
  }, [activeTab]);

  const searchBtnOnClick = () => {
    const newKeyword = searchKeyword?.trim();
    const isAlreadyExist = localKeywords.includes(newKeyword);
    if (newKeyword) {
      getSearchResult(activeTab.value, newKeyword);

      if (!isAlreadyExist) {
        setLocalKeywords((x) => {
          const newKeywords = [newKeyword, ...x];
          setKeywordItem(newKeywords);
          return newKeywords;
        });
      }
    }
  };

  const tabOnClick = (item) => {
    return () => {
      setActiveTab(item);
      getSearchResult(item.value, searchKeyword);
    };
  };

  return (
    <View className="h-full bg-bgPrimary mc-page overflow-auto">
      <ScrollView enableFlex scrollY className="h-full">
        <View
          className={clsx("px-10", activeTab.value === "all" ? "" : "mb-10")}
        >
          <View className="flex justify-center items-center pt-5">
            <View className="relative flex-1">
              <Input
                className={clsx(
                  "flex-1 flex items-center h-[60px] pl-2.5 rounded-lg bg-white text-[28px] border-[1px] border-solid",
                  isInputFocus ? "border-primary" : "border-transparent"
                )}
                value={searchKeyword}
                onFocus={() => {
                  setIsInputFocus(true);
                }}
                focus={isInputFocus}
                onInput={(e) => {
                  setSearchKeyword(e.detail.value);
                }}
                type="text"
                placeholder="请输入关键字"
              />
              {showClearCrossWire && (
                <View
                  className={clsx(
                    "w-10 h-10 absolute top-1/2 right-[14px] -translate-y-1/2",
                    ' before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-45 before:absolute before:left-1/2 before:top-1/2 before:content-[""] before:w-[2px] before:h-7 before:bg-black',
                    'after:-translate-x-1/2 after:-translate-y-1/2 after:-rotate-45 after:absolute after:left-1/2 after:top-1/2 after:content-[""] after:w-[2px] after:h-7 after:bg-black'
                  )}
                  onClick={crossWireOnClick}
                />
              )}
            </View>
            <Button
              disabled={isSearchButtonDisabled}
              className={clsx(
                "ml-5 w-[96px] h-[60px] px-4 leading-[60px] text-[28px] after:border-transparent",
                isSearchButtonDisabled
                  ? "text-[#666] bg-[#e0e0e0]"
                  : "text-white bg-primary"
              )}
              onClick={searchBtnOnClick}
            >
              搜索
            </Button>
          </View>

          <View className="flex flex-wrap py-5 mt-5">
            {localKeywords.map((item, index) => (
              <View
                className="py-2 px-4 mr-4 mb-4 bg-white text-[24px] rounded-lg"
                key={item}
                onClick={keywordOnClick(item, index)}
              >
                {item}
              </View>
            ))}
            {localKeywords.length > 0 && (
              <View
                className="py-2 px-4 mr-4 mb-4 bg-white text-[24px] rounded-lg"
                onClick={() => {
                  setKeywordItem([]);
                  setLocalKeywords([]);
                }}
              >
                <Text className="iconfont icon-Trash" />
              </View>
            )}
          </View>

          <View className="flex w-full h-[74px]">
            {searchResultTabs.map((item) => (
              <View
                className={clsx(
                  "flex-1 text-[32px] leading-[74px] font-bold text-center",
                  activeTab.label === item.label ? "text-primary" : "text-black"
                )}
                key={item.label}
                onClick={tabOnClick(item)}
              >
                {item.label}
              </View>
            ))}
          </View>
          <View className="w-full h-1 relative flex">
            <View
              className=" w-[calc((100vw_-_40px)/4)] h-full absolute flex-1 bg-primary transition-[left] duration-300 ease-[cubic-bezier(0.18,0.89,0.26,1.19)]"
              style={{
                left: `calc(${activeTab.index} * (100vw - 40px) / 4 )`,
              }}
            />
          </View>
        </View>
        {showResultTitle && (
          <View className="mt-10 mb-5 pl-10 text-[32px] font-bold">单曲</View>
        )}
        {showSongResult &&
          resultSongs.map((item) => (
            <SongCard
              isInPlaylist={false}
              key={item.id}
              {...getSongDetail(item)}
            />
          ))}
        {showResultTitle && (
          <View className="mt-10 mb-5 pl-10 text-[32px] font-bold">歌手</View>
        )}
        {showSingerResult && (
          <View className="flex justify-between flex-wrap px-10">
            {resultSingers.map((singer) => (
              <SingerCard
                key={singer.id}
                id={singer.id}
                img1v1Url={singer.img1v1Url}
                name={singer.name}
              />
            ))}
          </View>
        )}
        {showResultTitle && (
          <View className="mt-10 mb-5 pl-10 text-[32px] font-bold">歌单</View>
        )}
        {showPlaylistResult && (
          <View className="flex flex-wrap justify-between px-10">
            {resultPlaylists.map((item) => (
              <PlaylistCard
                className="text-[24px] mb-5"
                {...item}
                key={item.id}
                copywriter={null}
                width={300}
                titleClassName="text-[24px] h-[64px] leading-[32px]"
              />
            ))}
          </View>
        )}
        {/* <BottomPlayPanel /> */}
      </ScrollView>
    </View>
  );
};

export default Search;
