import { View, Image } from "@tarojs/components";

import loading from "@/assets/svgs/loading.svg";

const ScrollBottomLoading = () => {
  return (
    <View className="flex items-center justify-center w-full h-[120px] box-border">
      <Image src={loading} className="h-20 w-20 animate-spin" />
    </View>
  );
};

export default ScrollBottomLoading;
