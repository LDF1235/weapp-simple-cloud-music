import NoticeLogin from "@/components/NoticeLogin";
// import BottomPlayPanel from "@/components/BottomPlayPanel";
import { View } from "@tarojs/components";

const Index = () => {
  return (
    <View className="min-h-full bg-bgPrimary">
      <NoticeLogin
        topSubTitle="专属推荐"
        topTitle="推荐"
        notice="推荐功能需要登录"
      />
      {/* <BottomPlayPanel /> */}
    </View>
  );
};

export default Index;
