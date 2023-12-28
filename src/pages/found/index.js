import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, ScrollView, View, Text } from "@tarojs/components";
import Taro, { showLoading, hideLoading } from "@tarojs/taro";
import PlaylistCard from "@/components/PlaylistCard";
import PlaylistTitle from "@/components/PlaylistTitle";
import SingerCard from "@/components/SingerCard";
// import BottomPlayPanel from "@/components/BottomPlayPanel";
import {
  reqHotSubCategories,
  reqCategories,
  reqPlaylist,
  reqRankPlayList,
  reqHighQualityCategories,
  reqHighQualityPlaylist,
  reqHotSinger,
} from "@/services";

import {
  ROUTE_FEATURED_PLAYLIST,
  ROUTE_HIGH_QUALITY_PLAYLIST,
  ROUTE_MORE_SINGER,
  ROUTE_OFFICIAL_PLAYLIST,
  ROUTE_SEARCH,
} from "@/constants";
import clsx from "clsx";

const Index = () => {
  const [categories, setCategories] = useState([]);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [activeSubCategoryIndex, setActiveSubCategoryIndex] = useState(0);
  const [activeHighQualityTagIndex, setActiveHighQualityTagIndex] = useState(0);
  const [featurePlayList, setFeaturePlayList] = useState([]);
  const [officialPlayList, setOfficialPlayList] = useState([]);
  const [rankPlayList, setRankPlayList] = useState([]);
  const [highQualityTags, setHighQualityTags] = useState([]);
  const [highQualityPlayList, setHighQualityPlayList] = useState([]);
  const [singerList, setSingerList] = useState([]);

  const getCategories = useCallback(async () => {
    const [categoriesRes, hotSubCategoriesRes] = await Promise.all([
      reqCategories(),
      reqHotSubCategories(),
    ]);
    const allCategories = [];

    if (categoriesRes.code === 200 && hotSubCategoriesRes.code === 200) {
      const hotSubCategories = [{ name: "默认", value: "全部" }];
      const theRestHotSubCategories = hotSubCategoriesRes.tags.map(
        ({ name }) => ({ name, value: name })
      );
      hotSubCategories.push(...theRestHotSubCategories);
      allCategories.push({
        name: "热门",
        subCategories: hotSubCategories,
      });

      const { sub, categories: tempCategories } = categoriesRes;
      sub.forEach((item) => {
        const categoryName = tempCategories[item.category];
        const { name: subCategoryName } = item;
        const targetCategory = allCategories.find(
          (cat) => cat.name === categoryName
        );

        if (targetCategory) {
          targetCategory.subCategories.push({
            name: item.name,
            value: item.name,
          });
        } else {
          allCategories.push({
            name: categoryName,
            subCategories: [
              {
                name: subCategoryName,
                value: subCategoryName,
              },
            ],
          });
        }
      });
      setCategories(allCategories);
    }
  }, []);

  const getFeaturePlayList = useCallback(async (params) => {
    showLoading({ title: "正在加载", mask: true });
    const response = await reqPlaylist(params);

    if (response.code === 200) {
      hideLoading();
      setFeaturePlayList(response.playlists);
    }
  }, []);

  const getHighQualityPlayList = useCallback(async (params) => {
    showLoading({ title: "正在加载", mask: true });
    const response = await reqHighQualityPlaylist(params);
    if (response.code === 200) {
      hideLoading();
      setHighQualityPlayList(response.playlists);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const responses = await Promise.all([
        reqPlaylist({ limit: 6, cat: "官方" }),
        reqRankPlayList(),
        reqHighQualityCategories(),
        reqHotSinger({ limit: 9 }),
      ]);
      if (responses.every((item) => item.code === 200)) {
        const [
          officialPlayListRes,
          rankPlayListRes,
          highQualityTagRes,
          singerListRes,
        ] = responses;
        setOfficialPlayList(officialPlayListRes.playlists);
        setRankPlayList(rankPlayListRes.list);
        const tags = [{ name: "默认", value: "全部" }];
        tags.push(
          ...highQualityTagRes.tags.map(({ name }) => ({ name, value: name }))
        );
        setHighQualityTags(tags);
        setSingerList(singerListRes.artists);
      }
    };
    fetchData();
    getCategories();
    getFeaturePlayList({ limit: 6, cat: "全部" });
    getHighQualityPlayList({ limit: 6, cat: "全部" });
  }, [getFeaturePlayList, getCategories, getHighQualityPlayList]);

  const categoryOnClick = (index) => {
    return () => {
      setActiveCategoryIndex(index);
      setActiveSubCategoryIndex(0);
      const cat = categories[index].subCategories[0].value;
      getFeaturePlayList({ limit: 6, cat });
    };
  };

  const displaySubCategories = useMemo(() => {
    return categories[activeCategoryIndex]?.subCategories;
  }, [categories, activeCategoryIndex]);

  const highQualityTagOnClick = (value, index) => {
    return () => {
      setActiveHighQualityTagIndex(index);
      getHighQualityPlayList({ limit: 6, cat: value });
    };
  };

  const subCategoryOnClick = (value, index) => {
    return () => {
      setActiveSubCategoryIndex(index);
      getFeaturePlayList({ limit: 6, cat: value });
    };
  };

  const activeSubCategory =
    categories[activeCategoryIndex]?.subCategories[activeSubCategoryIndex];
  const activeHighQualityTag = highQualityTags[activeHighQualityTagIndex];

  return (
    <View className="min-h-full bg-bgPrimary">
      <View className="p-10 flex justify-between items-center bg-[linear-gradient(#fff,#f4f4f4)]">
        <View>
          <Text className="text-[64px] font-bold text-textPrimary mr-5">
            发现
          </Text>
          <Text className="text-[24px]">歌单广场</Text>
        </View>
        <Text
          className=" iconfont icon-Fangdajing text-[60px] "
          onClick={() => {
            Taro.navigateTo({ url: ROUTE_SEARCH });
          }}
        ></Text>
      </View>
      <View>
        <PlaylistTitle
          showMoreBtn
          left={`${activeSubCategory?.name || "默认"} - 精选歌单`}
          onViewMore={() => {
            Taro.navigateTo({
              url: `${ROUTE_FEATURED_PLAYLIST}?cat=${activeSubCategory?.value}`,
            });
          }}
          className="px-10"
        />
        <ScrollView
          className="flex mb-4 h-11 whitespace-nowrap"
          scrollX
          enableFlex
        >
          {categories.map(({ name: categoryName }, index) => (
            <View
              className={clsx(
                "flex items-center py-1 px-[27px] mr-3 text-[24px] rounded-lg",
                index === 0 ? "ml-10" : "",
                activeCategoryIndex === index
                  ? "bg-primary text-white"
                  : "bg-white text-textPrimary"
              )}
              key={categoryName}
              onClick={categoryOnClick(index)}
            >
              {categoryName}
            </View>
          ))}
        </ScrollView>

        <ScrollView className="flex h-11 whitespace-nowrap" scrollX enableFlex>
          {displaySubCategories?.map(
            ({ name: subCategoryName, value }, index) => (
              <View
                key={subCategoryName}
                onClick={subCategoryOnClick(value, index)}
                className={clsx(
                  "flex items-center py-1 px-[22px] text-[24px] rounded-lg",
                  index === 0 ? "ml-10" : "ml-[34px]",
                  activeSubCategoryIndex === index
                    ? "bg-primary text-white"
                    : "bg-white text-textPrimary"
                )}
              >
                {subCategoryName}
              </View>
            )
          )}
        </ScrollView>

        <ScrollView
          scrollX
          enableFlex
          className="h-[560px] flex whitespace-nowrap mt-[60px]"
        >
          {featurePlayList.map((item, index) => (
            <PlaylistCard
              key={item.id}
              coverImgUrl={item.coverImgUrl}
              playCount={item.playCount}
              name={item.name}
              className="ml-10"
              id={item.id}
              isLastOne={index === featurePlayList.length - 1}
            />
          ))}
        </ScrollView>
      </View>

      <View className="mt-[60px]">
        <PlaylistTitle
          showMoreBtn
          left="官方歌单"
          onViewMore={() => {
            Taro.navigateTo({ url: `${ROUTE_OFFICIAL_PLAYLIST}?cat=官方` });
          }}
          className="px-10"
        />
        <ScrollView
          className="flex h-[560px] whitespace-nowrap"
          scrollX
          enableFlex
        >
          {officialPlayList.map((item, index) => (
            <PlaylistCard
              key={item.id}
              coverImgUrl={item.coverImgUrl}
              playCount={item.playCount}
              name={item.name}
              id={item.id}
              className="pl-10"
              isLastOne={index === officialPlayList.length - 1}
            />
          ))}
        </ScrollView>
      </View>

      <View className="mt-[60px]">
        <PlaylistTitle left="排行榜" showMoreBtn={false} className="px-10" />
        <ScrollView
          className="flex h-[560px] whitespace-nowrap"
          scrollX
          enableFlex
        >
          {rankPlayList.map((item, index) => (
            <PlaylistCard
              key={item.id}
              coverImgUrl={item.coverImgUrl}
              name={item.name}
              playCount={item.playCount}
              className="pl-10"
              isLastOne={index === rankPlayList.length - 1}
              id={item.id}
            />
          ))}
        </ScrollView>
      </View>

      <View className="mt-10">
        <PlaylistTitle
          left="热门歌手"
          showMoreBtn
          className="px-10"
          onViewMore={() => {
            Taro.navigateTo({ url: ROUTE_MORE_SINGER });
          }}
        />
        <View className="flex justify-between flex-wrap px-10">
          {singerList.map((singer) => (
            <SingerCard
              key={singer.id}
              id={singer.id}
              img1v1Url={singer.img1v1Url}
              name={singer.name}
            />
          ))}
        </View>
      </View>

      <View className="mt-[60px]">
        <PlaylistTitle
          showMoreBtn
          left={`${activeHighQualityTag?.name || "默认"} - 精品歌单`}
          onViewMore={() => {
            Taro.navigateTo({
              url: `${ROUTE_HIGH_QUALITY_PLAYLIST}?cat=${activeHighQualityTag?.value}`,
            });
          }}
          className="px-10"
        />
        <ScrollView className="flex h-11 whitespace-nowrap" scrollX enableFlex>
          {highQualityTags.map(({ name, value }, index) => (
            <View
              key={name}
              onClick={highQualityTagOnClick(value, index)}
              className={clsx(
                "flex items-center py-1 px-[22px] text-[24px] rounded-lg",
                index === 0 ? "ml-10" : "ml-[34px]",
                activeHighQualityTagIndex === index
                  ? "bg-primary text-white"
                  : "bg-white text-textPrimary"
              )}
            >
              {name}
            </View>
          ))}
        </ScrollView>
        <ScrollView
          scrollX
          enableFlex
          className="flex h-[630px] mt-[50px] whitespace-nowrap"
        >
          {highQualityPlayList.map((item, index) => (
            <PlaylistCard
              key={item.id}
              coverImgUrl={item.coverImgUrl}
              playCount={item.playCount}
              name={item.name}
              className="ml-10"
              copywriter={item.copywriter}
              isLastOne={index === highQualityPlayList.length - 1}
              id={item.id}
            />
          ))}
        </ScrollView>
      </View>
      <View className="mt-[80px] pb-[240px] px-10">
        <Button className="mc-default-button">关于</Button>
      </View>

      {/* <BottomPlayPanel /> */}
    </View>
  );
};

export default Index;
