import NoticeLogin from "@/components/NoticeLogin";
import { View } from "@tarojs/components";
// import BottomPlayPanel from '@/components/BottomPlayPanel';

const Me = () => {
  return (
    <View className="min-h-full bg-bgPrimary">
      <NoticeLogin
        topSubTitle="曲库与设置"
        topTitle="我的"
        notice="账号信息需要登录"
      />
      {/* <BottomPlayPanel /> */}
    </View>
  );
};

export default Me;
