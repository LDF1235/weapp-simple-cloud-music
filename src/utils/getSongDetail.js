export const getSongDetail = (song) => {
  const { id, name, dt } = song;
  const picUrl = song.al?.picUrl;
  const singers = song.ar?.map((item) => item.name)?.join("/") || "/";
  const epname = song.al?.name;

  return {
    id,
    name,
    durationTime: dt,
    picUrl,
    singers,
    epname,
  };
};
