import React, { useState } from "react";
import { Image, View } from "@tarojs/components";
import clsx from "clsx";

const LoadImg = (props) => {
  const { src, className, style } = props;

  const [showLoading, setShowLoading] = useState(true);

  return (
    <View
      className={clsx(
        " transition-[background] duration-200 ease-linear",
        showLoading ? "bg-[#eee]" : "bg-transparent",
        className
      )}
      style={style}
    >
      {src && (
        <Image
          src={src}
          onLoad={() => {
            setShowLoading(false);
          }}
          onError={() => {
            setShowLoading(true);
          }}
          className={clsx(
            " transition-opacity duration-200 ease-linear",
            showLoading ? "opacity-0" : "opacity-100",
            className
          )}
          style={style}
        />
      )}
    </View>
  );
};

export default LoadImg;
