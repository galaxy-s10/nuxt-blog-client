/**
 * @description 判断是否是浏览器环境
 * @param {*} boolean
 * @return {*}
 */
export const isBrowser = () =>
  typeof window !== 'undefined' &&
  typeof window.document !== 'undefined' &&
  typeof window.document.createElement !== 'undefined';

/**
 * 使用json进行深克隆
 */
export const deepCloneByJson = (obj) => JSON.parse(JSON.stringify(obj));

/**
 * 随机获取[n-m]之间的随机整数
 */
export const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
export const randomString = (length) => {
  const str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let res = '';
  for (let i = 0; i < length; i += 1) {
    res += str.charAt(getRandomInt(0, str.length - 1));
  }
  return res;
};

const stylePools = [];
const styleIndex = 0;

export const generaterStyle = (data) => {
  const styleEle = document.createElement('style');
  const id = `generaterStyle-${styleIndex + 1}`;
  let styleContent = ':root {';
  Object.keys(data).forEach((key) => {
    const styleVal = data[key];
    styleContent += `${key}:${styleVal};`;
  });
  styleContent += '}';
  styleEle.textContent = styleContent;
  styleEle.id = id;
  stylePools.push(id);
  document.head.appendChild(styleEle);
};
