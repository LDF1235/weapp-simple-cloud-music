const bigNumFormatter = (param) => {
  const { count, unitLength, unitText } = param;
  const str = String(count);
  const length = str.length;
  const floatNumIndex = length - unitLength;
  let floatNum = str[floatNumIndex];

  if (+str[floatNumIndex + 1] >= 5) {
    floatNum = String(Number(floatNum) + 1);
  }

  const intNum = str.slice(0, length - unitLength);
  return `${intNum}${floatNum === "0" ? "" : `.${floatNum}`} ${unitText}`;
};

export const countFormatter = (count) => {
  const str = String(count);
  const length = str.length;

  if (count < 10000) {
    return count;
  }

  if (count < 10 ** 8) {
    return bigNumFormatter({ count, unitLength: 4, unitText: "万" });
  }

  if (length < 13) {
    return bigNumFormatter({ count, unitLength: 8, unitText: "亿" });
  }

  return bigNumFormatter({ count, unitLength: 12, unitText: "万亿" });
};
