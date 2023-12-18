import { View, Image, Button, Text } from "@tarojs/components";
import React from "react";
import Taro from "@tarojs/taro";

import LoginBg from "../assets/images/login.jpg";
import { ROUTE_LOGIN } from "@/constants";

const NoticeLogin = (props) => {
  const { topTitle, topSubTitle, notice } = props;

  const loginBtnOnClick = () => {
    Taro.redirectTo({
      url: ROUTE_LOGIN,
    });
  };

  return (
    <View>
      <View className="p-10 flex justify-between items-center bg-[linear-gradient(#fff,#f4f4f4)]">
        <View>
          <Text className="text-[64px] font-bold text-[#1f1f1f] mr-5">
            {topTitle}
          </Text>
          <Text className="text-[24px]">{topSubTitle}</Text>
        </View>
      </View>
      <View className="flex flex-col flex-1 px-[74px]">
        <Image className="w-[80%]" src={LoginBg} />
        <View className="my-10 mx-0 text-center text-[36px]">{notice}</View>
        <Button className="mc-primary-button" onClick={loginBtnOnClick}>
          立即登录
        </Button>
        <Button className="mc-default-button mt-20">关于</Button>
      </View>
    </View>
  );
};

export default NoticeLogin;
