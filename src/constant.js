export const REDIRECT_URI = 'https://admin.hsslive.cn/oauth/';

export const QQ_CLIENT_ID = '101934585';
export const QQ_OAUTH_URL =
  'https://graph.qq.com/oauth2.0/authorize?response_type=code&';

export const GITHUB_CLIENT_ID = '8c2c07b574ae70ecfa9d';
export const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize?';

export const QINIU_CDN_URL = 'https://resource.hsslive.cn/';
export const GITHUB_REPO = 'https://github.com/galaxy-s10/nuxt-blog-client';

export const ERROR_HTTP_CODE = {
  serverError: 10000, // 服务器错误
  banIp: 1000,
  adminDisableUser: 1001,
  notFound: 1002, // 返回了404的http状态码
  errStatusCode: 1003, // 返回了即不是200也不是404的http状态码
  shutdown: 1004, // 停机维护
};

// websocket消息类型
export const wsMsgType = {
  /** 用户连接 */
  connect: 'connect',
  /** 用户进入聊天 */
  userInRoom: 'userInRoom',
  /** 游客切换头像 */
  visitorSwitchAvatar: 'visitorSwitchAvatar',
  /** 用户退出聊天 */
  userOutRoom: 'userOutRoom',
  /** 用户发送消息 */
  userSendMsg: 'userSendMsg',
  /** 获取在线数据 */
  getOnlineData: 'getOnlineData',
  /** 用户存活 */
  live: 'live',
};

// websocket连接状态
export const wsConnectStatus = {
  /** 已连接 */
  connection: 'connection',
  /** 连接中 */
  connecting: 'connecting',
  /** 已连接 */
  connected: 'connected',
  /** 断开连接中 */
  disconnecting: 'disconnecting',
  /** 已断开连接 */
  disconnect: 'disconnect',
  /** 重新连接 */
  reconnect: 'reconnect',
  /** 客户端的已连接 */
  connect: 'connect',
};

// websocket用户类型
export const wsUserType = {
  visitor: 1, // 游客
  user: 2, // 用户
};

export const liveExp = 60 * 5; // 5分钟过期
