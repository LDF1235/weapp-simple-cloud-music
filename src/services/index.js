import { request } from "./request";

// 歌单分类
export const reqCategories = () => {
  return request({
    url: "/playlist/catlist",
    method: "GET",
  });
};

// 热门歌单子分类
export const reqHotSubCategories = () => {
  return request({
    url: "/playlist/hot",
    method: "GET",
  });
};

// 播放列表
export const reqPlaylist = (data) => {
  return request({
    url: "/top/playlist",
    method: "GET",
    data,
  });
};

// 排行榜列表
export const reqRankPlayList = () => {
  return request({
    url: "/toplist",
    method: "GET",
  });
};

// 精品分类
export const reqHighQualityCategories = () => {
  return request({
    url: "/playlist/highquality/tags",
    method: "GET",
  });
};

// 精品歌单
export const reqHighQualityPlaylist = (data) => {
  return request({
    url: "/top/playlist/highquality",
    data,
    method: "GET",
  });
};

// 热门歌手
export const reqHotSinger = (data) => {
  return request({
    url: "/top/artists",
    data,
    method: "GET",
  });
};

// 搜索
export function reqSearch(params) {
  return request({
    url: "/search",
    data: params,
  });
}

// 歌曲详情
export const reqSongDetail = (data) => {
  return request({
    url: "/song/detail",
    data,
    method: "GET",
  });
};
