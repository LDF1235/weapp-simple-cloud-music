import { View, Image, Button, Input } from "@tarojs/components";
import { useState, useRef } from "react";
import Taro from "@tarojs/taro";
import simpleCloudMusicLogo from "@/assets/images/simpleCloudMusicLogo.jpg";
import cloudMusicLogo from "@/assets/images/cloudMusicLogo.jpg";
import { safeAreaRect } from "@/module/safeAreaRect";
import {
  reqCheckQrCode,
  reqLoginByEmail,
  reqLoginByPhone,
  reqQrCode,
  reqQrCodeKey,
  reqSendAuthCode,
  reqUserLikeList,
} from "@/services";
import md5 from "md5";
import { setStorageUserInfo } from "@/storage";
import { useUserInfoStore } from "@/store/userInfo";
import { ROUTE_ME } from "@/constants";
import linkSvg from "../../assets/svgs/link.svg";
import PlayerPanel from "@/components/PlayerPanel";
import { usePlayerStore } from "@/store/player";

const enumLoginWay = {
  phone: 0,
  qrCode: 1,
  email: 2,
};
const enumPhoneLoginWay = {
  authCode: 0,
  password: 1,
};

const Login = () => {
  const [loginWay, setLoginWay] = useState(enumLoginWay.phone);
  const [phoneLoginWay, setPhoneLoginWay] = useState(
    enumPhoneLoginWay.authCode
  );
  const [email, setEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneAuthCode, setPhoneAuthCode] = useState("");
  const [phonePassword, setPhonePassword] = useState("");
  const [authCodeSeconds, setAuthCodeSeconds] = useState(0);
  const [qrCode, setQrCode] = useState("");
  const [showQrCodeReset, setShowQrCodeReset] = useState(false);
  const authCodeSecondTimerRef = useRef();
  const authCodeSecondsRef = useRef();
  const { showPlayer } = usePlayerStore();
  authCodeSecondsRef.current = authCodeSeconds;

  const isPhoneAuthCode = phoneLoginWay === enumPhoneLoginWay.authCode;

  const togglePhoneVerifyWay = () => {
    setPhoneLoginWay((pre) =>
      pre === enumPhoneLoginWay.authCode
        ? enumPhoneLoginWay.password
        : enumPhoneLoginWay.authCode
    );
  };

  const generateQrCode = async () => {
    const keyRes = await reqQrCodeKey();

    if (keyRes.code !== 200) {
      setShowQrCodeReset(true);
      return;
    }

    const qrCodeRes = await reqQrCode({
      key: keyRes.data.unikey,
      qrimg: "123",
    });

    if (qrCodeRes.code !== 200) {
      setShowQrCodeReset(true);
      return;
    }

    setQrCode(qrCodeRes.data.qrimg);

    return keyRes.data.unikey;
  };

  const startCheckQrCodeLoop = (key) => {
    async function timer() {
      const res = await reqCheckQrCode({ key });

      if (res.code === 800) {
        setShowQrCodeReset(true);
        return;
      }

      if (res.code === 803) {
        afterLoginSuccess(res);
        return;
      }

      setTimeout(timer, 1000);
    }

    timer();
  };

  const switchLoginWay = (nextLoginWay) => {
    if (loginWay === nextLoginWay) {
      setLoginWay(enumLoginWay.qrCode);
      Taro.setNavigationBarTitle({
        title: "二维码登录",
      });
      generateQrCode().then((key) => {
        if (key) startCheckQrCodeLoop(key);
      });
      return;
    }

    Taro.setNavigationBarTitle({
      title: nextLoginWay === enumLoginWay.email ? "邮箱登录" : "手机号登录",
    });
    setLoginWay(nextLoginWay);
  };

  const handleSendAuthCode = async () => {
    if (!/^\d{11}$/.test(phone)) {
      Taro.showToast({ title: "请输入手机号", icon: null });
      return;
    }

    Taro.showLoading();
    const res = await reqSendAuthCode({
      phone,
      timestamp: new Date().getTime(),
    });
    Taro.hideLoading();

    if (res.code === 200) {
      Taro.showToast({ title: "验证码已发送", icon: null });
      startAuthCodeTimer();
    }
  };

  const startAuthCodeTimer = () => {
    setAuthCodeSeconds(60);

    function timer() {
      if (authCodeSecondsRef.current <= 0) {
        authCodeSecondTimerRef.current = null;
        return;
      }

      authCodeSecondTimerRef.current = setTimeout(() => {
        setAuthCodeSeconds((prev) => {
          const next = prev - 1;
          return next <= 0 ? 0 : next;
        });
        timer();
      }, 1000);
    }

    timer();
  };

  const loginSubmit = async () => {
    if (loginWay === enumLoginWay.phone) {
      if (!/^\d{11}$/.test(phone)) {
        Taro.showToast({ icon: null, title: "请输入手机号" });
        return;
      }

      if (phoneLoginWay === enumPhoneLoginWay.authCode) {
        if (!phoneAuthCode.trim()) {
          Taro.showToast({ icon: null, title: "请输入验证码" });
          return;
        }

        const res = await reqLoginByPhone({
          phone,
          password: "whosyourdaddy",
          captcha: phoneAuthCode,
        });
        afterLoginSuccess(res);

        return;
      }

      if (phoneLoginWay === enumPhoneLoginWay.password) {
        if (!phonePassword.trim()) {
          Taro.showToast({ icon: null, title: "请输入密码" });
          return;
        }

        const res = await reqLoginByPhone({
          phone,
          password: "whosyourdaddy",
          md5_password: md5(phonePassword),
        });
        afterLoginSuccess(res);
      }

      return;
    }

    if (loginWay === enumLoginWay.email) {
      if (
        !/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(
          email
        )
      ) {
        Taro.showToast({ icon: null, title: "请输入邮箱" });
        return;
      }

      if (!emailPassword.trim()) {
        Taro.showToast({ icon: null, title: "请输入密码" });
        return;
      }

      const res = await reqLoginByEmail({
        email,
        password: "whosyourdaddy",
        md5_password: md5(emailPassword),
      });
      afterLoginSuccess(res);
    }
  };

  const afterLoginSuccess = (loginRes) => {
    Taro.showToast({ title: "登录成功", icon: null });
    const userInfo = {
      account: loginRes.account,
      profile: loginRes.profile,
      bindings: loginRes.bindings,
    };
    setStorageUserInfo(userInfo);
    useUserInfoStore.setState({ userInfo });
    Taro.switchTab({ url: ROUTE_ME });
    reqUserLikeList({ uid: loginRes.account.id }).then((res) => {
      if (res.code === 200) {
        useUserInfoStore.setState({
          likeListIds: new Set(res.ids),
        });
      }
    });
  };

  return (
    <View
      className="h-full bg-bgPrimary flex flex-col"
      style={{ paddingBottom: safeAreaRect.bottom }}
    >
      <View className="pt-10 px-10 grow-0 shrink-0">
        <View className="mb-10 text-[24px] text-[#666] text-center">
          请使用网易云音乐账号登录
        </View>
        <View className="flex items-center justify-center">
          <Image className="w-[140px] h-[140px]" src={cloudMusicLogo}></Image>
          <Image src={linkSvg} className="mx-[30px] w-8 h-8" />
          <Image
            className="w-[140px] h-[140px]"
            src={simpleCloudMusicLogo}
          ></Image>
        </View>

        {loginWay === enumLoginWay.qrCode && (
          <>
            <View className="w-[400px] h-[400px] mt-10 mb-10 mx-auto flex items-center justify-center">
              {qrCode ? (
                <Image src={qrCode} className="w-full" mode="widthFix" />
              ) : showQrCodeReset ? (
                <Button
                  className="mc-primary-button"
                  onClick={() => {
                    setShowQrCodeReset(false);
                    generateQrCode().then((key) => {
                      if (key) startCheckQrCodeLoop(key);
                    });
                  }}
                >
                  重新生成二维码
                </Button>
              ) : (
                "二维码加载中..."
              )}
            </View>
            <View className="text-[24px] mt-10 mx-[34px] text-center">
              使用网易云音乐 APP 扫码登录
            </View>
          </>
        )}

        {loginWay === enumLoginWay.phone && (
          <View className="mt-[60px] px-7">
            <View className="mb-5 text-[#666] text-[28px]">手机号</View>
            <Input
              className=" border-0 border-b-[1px] border-solid border-b-[rgb(214,214,214)] mb-10"
              placeholder="请输入手机号"
              value={phone}
              onInput={(e) => {
                setPhone(e.detail.value);
              }}
            />
            <View className=" mb-1.5 text-[#666] text-[28px]]">
              {enumPhoneLoginWay.authCode ? "验证码" : "密码"}
            </View>
            <View className="flex items-end h-[60px]">
              <Input
                value={isPhoneAuthCode ? phoneAuthCode : phonePassword}
                placeholder={`请输入${isPhoneAuthCode ? "验证码" : "密码"}`}
                className="flex-1 border-0 border-b-[1px] border-solid border-b-[rgb(214,214,214)]"
                password={!isPhoneAuthCode}
                onInput={(e) => {
                  const val = e.detail.value;

                  if (isPhoneAuthCode) {
                    setPhoneAuthCode(val);
                  } else {
                    setPhonePassword(val);
                  }
                }}
              />
              {isPhoneAuthCode && (
                <Button
                  onClick={handleSendAuthCode}
                  className="w-[140px] h-[52px] grow-0 shrink-0 ml-2.5 leading-[52px] px-2.5 bg-transparent rounded-[10px] text-[24px] after:border-[rgb(182,182,182)]"
                >
                  {authCodeSeconds
                    ? `${authCodeSeconds}s 后重发`
                    : "获取验证码"}
                </Button>
              )}
            </View>
            {loginWay === enumLoginWay.phone && (
              <View
                className="mt-20 text-primary text-center text-[32px]"
                onClick={togglePhoneVerifyWay}
              >
                {isPhoneAuthCode ? "密码验证" : "短信验证"}
              </View>
            )}
            <Button className="mc-primary-button mt-10" onClick={loginSubmit}>
              登录
            </Button>
          </View>
        )}

        {loginWay === enumLoginWay.email && (
          <View className="mt-[60px] px-7">
            <View className="mb-5 text-[#666] text-[28px]">邮箱</View>
            <Input
              className=" border-0 border-b-[1px] border-solid border-b-[rgb(214,214,214)] mb-10"
              placeholder="邮箱"
              value={email}
              onInput={(e) => {
                setEmail(e.detail.value);
              }}
            />
            <View className=" mb-1.5 text-[#666] text-[28px]]">密码</View>
            <View className="flex items-end h-[60px]">
              <Input
                value={emailPassword}
                placeholder="密码"
                className="flex-1 border-0 border-b-[1px] border-solid border-b-[rgb(214,214,214)]"
                password
                onInput={(e) => {
                  setEmailPassword(e.detail.value);
                }}
              />
            </View>
            <Button className="mc-primary-button mt-10" onClick={loginSubmit}>
              登录
            </Button>
          </View>
        )}
      </View>

      <View className="flex mt-auto grow-0 shrink-0 justify-center items-center h-[50px] text-primary">
        <View
          onClick={() => {
            switchLoginWay(enumLoginWay.phone);
          }}
          className="text-[32px] text-primary"
        >
          {loginWay === enumLoginWay.phone ? "二维码登录" : "手机号登录"}
        </View>
        <View className="w-[1px] h-[70%] mx-5 translate-y-[5px] bg-primary" />
        <View
          onClick={() => {
            switchLoginWay(enumLoginWay.email);
          }}
          className="text-[32px] text-primary"
        >
          {loginWay === enumLoginWay.email ? "二维码登录" : "邮箱登录"}
        </View>
      </View>

      {showPlayer && <View className="h-[140px]" />}
      <PlayerPanel />
    </View>
  );
};

export default Login;
