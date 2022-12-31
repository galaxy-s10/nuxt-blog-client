/** @typedef {import("axios").AxiosInstance} AxiosInstance */

// 推荐阅读：https://juejin.cn/post/7026907618438283271

// “AxiosInstance”是一种类型，无法在 JavaScript 文件中导入。请在 JSDoc 类型批注中使用“import("axios").AxiosInstance”。ts(18042)
// import { AxiosInstance } from 'axios';

// eslint-disable-next-line
import { Axios } from 'axios';

/**
 * 这个Axios是一个class类，js文件可以导入这个类
 * 优点是有Axios这个类的类型提示
 * 缺点是request其实是axios.create的返回值，返回值类型是AxiosInstance，Axios不等于AxiosInstance，没有AxiosInstance的类型提示
 * @param  {Axios} request
 */

export const readmeApi1 = (request) => {
  // 编辑器提示Axios的类型提示
  // request.post('');
  // 编辑器提示报错：此表达式不可调用。类型 "Axios" 没有调用签名。
  // request({ method: 'post' });
};

/**
 * @param  {import("axios").AxiosInstance} request
 */
export const readmeApi2 = (request) => {
  // 编辑器提示AxiosInstance的类型提示
  // request({ method: 'post' });
};

/**
 * 直接用顶部typedef定义的AxiosInstance
 * @param  {AxiosInstance} request
 */
export const readmeApi3 = (request) => {
  // 编辑器提示AxiosInstance的类型提示
  // request({ method: 'post' });
};
