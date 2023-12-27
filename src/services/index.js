import { request } from "./request";

// 歌单分类
export const reqCategories = () => {
  return request({
    url: "/playlist/catlist",
  });
};

// 热门歌单子分类
export const reqHotSubCategories = () => {
  return request({
    url: "/playlist/hot",
  });
};

// 播放列表
export const reqPlaylist = (data) => {
  return request({
    url: "/top/playlist",
    data,
  });
};

// 排行榜列表
export const reqRankPlayList = () => {
  return request({
    url: "/toplist",
  });
};

// 精品分类
export const reqHighQualityCategories = () => {
  return request({
    url: "/playlist/highquality/tags",
  });
};

// 精品歌单
export const reqHighQualityPlaylist = (data) => {
  return request({
    url: "/top/playlist/highquality",
    data,
  });
};

// 热门歌手
export const reqHotSinger = (data) => {
  return request({
    url: "/top/artists",
    data,
  });
};

// 搜索
export function reqSearch(data) {
  return request({
    url: "/search",
    data,
  });
}

// 歌曲详情
export const reqSongDetail = (data) => {
  return request({
    url: "/song/detail",
    data,
  });
};

// 更多歌单
export const reqMorePlaylist = (data) => {
  return request({
    url: "/top/playlist",
    data,
  });
};

// 更多精品歌单
export const reqMoreHighQualityPlaylist = (data) => {
  return request({
    url: "/top/playlist/highquality",
    data,
  });
};

// 更多歌手
export const reqMoreSingerList = (data) => {
  return request({
    url: "/top/artists",
    data,
  });
};

// 歌单详情
export const reqPlaylistSongs = (data) => {
  return request({
    url: "/playlist/detail",
    data,
  });
};

// 歌手详情
export const reqSingerInfo = (data) => {
  return request({
    url: "/artist/detail",
    data,
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
export const reqMoreSingerSongs = (data) => {
  return request({
    url: "/artist/songs",
    data,
  });
};

// 歌曲url
export const reqSongUrl = (params) => {
  return request({
    url: "/song/url",
    data: params,
  });
};

// 歌词
export const reqLyric = (data) => {
  return request({
    url: "/lyric",
    data,
  });
};

// 歌曲热门评论
export const reqSongHotComments = (data) => {
  return request({
    url: "/comment/hot",
    data,
  });
};

// 发送验证码
export const reqSendAuthCode = (data) => {
  return request({
    url: "/captcha/sent",
    data,
  });
};

// 邮箱登录
export const reqLoginByEmail = (data) => {
  return request({
    url: "/login",
    method: "POST",
    data,
  });
};

// 手机号登录
export const reqLoginByPhone = (data) => {
  return request({
    url: "/login/cellphone",
    method: "POST",
    data,
  });
};

// 生成登录二维码的key
export const reqQrCodeKey = () => {
  return request({
    url: "/login/qr/key",
    data: {
      timestamp: new Date().getTime(),
    },
  });
};

// 生成登录二维码
export const reqQrCode = (data) => {
  return request({
    url: "/login/qr/create",
    data: {
      ...data,
      timestamp: new Date().getTime(),
    },
  });
};

// 查询二维码登录状态
export const reqCheckQrCode = (data) => {
  return request({
    url: "/login/qr/check",
    data,
  });
};

// 退出登录
export const reqLogout = () => {
  return request({
    url: "/logout",
    method: "POST",
  });
};
