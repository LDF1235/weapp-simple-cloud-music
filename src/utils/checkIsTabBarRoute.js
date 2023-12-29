import appConfig from "@/app.config";

export const checkIsTabBarRoute = (path) => {
  return appConfig.tabBar.list.some((x) => x.pagePath === path);
};
