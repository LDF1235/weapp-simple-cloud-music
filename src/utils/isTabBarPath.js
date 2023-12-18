import appConfig from "@/app.config";

export const isTabBarPath = (path) => {
  return appConfig.tabBar.list.some((x) => x.pagePath === path);
};
