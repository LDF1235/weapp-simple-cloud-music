import { setStorage, removeStorage, getStorageSync } from "@tarojs/taro";
import { STORAGE_KEYWORD_KEY } from "./key";

export const setKeywordItem = (Keywords) => {
  setStorage({
    key: STORAGE_KEYWORD_KEY,
    data: JSON.stringify(Keywords),
  });
};

export const getKeywordItem = () => {
  let keywords = [];
  try {
    const localKeywords = getStorageSync(STORAGE_KEYWORD_KEY);

    if (localKeywords) {
      keywords = JSON.parse(localKeywords);
    }
  } catch (e) {}

  return { data: keywords };
};

export const removeKeywordItem = () => {
  removeStorage({ key: STORAGE_KEYWORD_KEY });
};
