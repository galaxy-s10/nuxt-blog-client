export const REDIRECT_URI = 'https://admin.hsslive.cn/oauth/';

export const QQ_CLIENT_ID = '101934585';
export const QQ_OAUTH_URL =
  'https://graph.qq.com/oauth2.0/authorize?response_type=code&';

export const GITHUB_CLIENT_ID = '8c2c07b574ae70ecfa9d';
export const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize?';

export const QINIU_CDN_URL = 'https://resource.hsslive.cn/';
export const GITHUB_REPO = 'https://github.com/galaxy-s10/nuxt-blog-client';

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
  /** 获取在线游客数 */
  getOnlineVisitorNum: 'getOnlineVisitorNum',
  /** 获取在线用户数 */
  getOnlineUserNum: 'getOnlineUserNum',
  /** 获取历史最高同时在线数（游客+用户） */
  getHistoryHightOnlineNum: 'getHistoryHightOnlineNum',
};

// websocket用户类型
export const wsUserType = {
  visitor: 1, // 游客
  user: 2, // 用户
};

// websocket连接状态
export const wsConnectStatusEnum = {
  /** 连接中 */
  connecting: 'connecting',
  /** 已连接 */
  connect: 'connect',
  /** 断开连接 */
  disconnect: 'disconnect',
  /** 连接错误 */
  connect_error: 'connect_error',
  /** 重新连接 */
  reconnect: 'reconnect',
};
