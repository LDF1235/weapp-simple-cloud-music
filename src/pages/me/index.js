import NoticeLogin from "@/components/NoticeLogin";
import { userInfoStore } from "@/store/userInfo";
import { View, Text } from "@tarojs/components";

const Me = () => {
  const { userInfo } = userInfoStore();

  return (
    <View className="h-full bg-bgPrimary">
      {userInfo ? null : (
        <NoticeLogin
          topSubTitle="曲库与设置"
          topTitle="我的"
          notice="账号信息需要登录"
        />
      )}

      {userInfo ? (
        <View className="p-10 flex justify-between items-center bg-[linear-gradient(#fff,#f4f4f4)]">
          <View>
            <Text className="text-[64px] font-bold text-textPrimary mr-5">
              我的
            </Text>
            <Text className="text-[24px]">曲库设置</Text>
          </View>
        </View>
      ) : null}
    </View>
  );
};

export default Me;
