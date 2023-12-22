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

// 更多歌单
export const reqMorePlaylist = (data) => {
  return request({
    url: "/top/playlist",
    data,
    method: "GET",
  });
};

// 更多精品歌单
export const reqMoreHighQualityPlaylist = (data) => {
  return request({
    url: "/top/playlist/highquality",
    data,
    method: "GET",
  });
};

// 更多歌手
export const reqMoreSingerList = (param) => {
  return request({
    url: "/top/artists",
    method: "GET",
    data: param,
  });
};

// 歌单详情
export const reqPlaylistSongs = (data) => {
  return request({
    url: "/playlist/detail",
    data,
    method: "GET",
  });
};

// 歌手详情
export const reqSingerInfo = (params) => {
  return request({
    url: "/artist/detail",
    data: params,
  });
};

// 歌手热门歌曲50首
export const reqSingerHotSongs = (params) => {
  return request({
    url: "/artist/top/song",
    data: params,
  });
};

// 歌手更多歌曲
export const reqMoreSingerSongs = (params) => {
  return request({
    url: "/artist/songs",
    data: params,
  });
};

// 歌曲url
export const reqSongUrl = (params) => {
  return request({
    url: "/song/url",
    method: "GET",
    data: params,
  });
};

// 歌词
export const reqLyric = (param) => {
  return request({
    url: "/lyric",
    method: "GET",
    data: param,
  });
};

// 歌曲热门评论
export const reqSongHotComments = (param) => {
  return request({
    url: "/comment/hot",
    data: param,
    method: "GET",
  });
};
