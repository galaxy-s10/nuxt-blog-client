import { wsConnectStatusEnum } from '@/constant';

export const state = () => ({
  isJoin: false, // 是否已加入聊天
  wsId: null,
  wsInstance: null,
  wsAvatarList: [], // 头像列表
  wsChatList: [], // 聊天列表
  onlineVisitorNum: 0, // 在线游客数
  onlineUserNum: 0, // 在线用户数
  historyHightOnlineNum: 0, // 历史最高同时在线数（游客+用户）
  wsStatus: wsConnectStatusEnum.disconnect, // 当前连接状态
  currUser: {
    id: '',
    avatar: '',
  }, // 当前用户信息
});

export const mutations = {
  // eslint-disable-next-line no-shadow
  setIsJoin(state, res) {
    state.isJoin = res;
  },
  // eslint-disable-next-line no-shadow
  setWsId(state, res) {
    state.wsId = res;
  },
  // eslint-disable-next-line no-shadow
  setWsAvatarList(state, res) {
    state.wsAvatarList = res;
  },
  // eslint-disable-next-line no-shadow
  setWsChatList(state, res) {
    state.wsChatList = res;
  },
  // eslint-disable-next-line no-shadow
  setWsStatus(state, res) {
    state.wsStatus = res;
  },
  // eslint-disable-next-line no-shadow
  setCurrUser(state, res) {
    state.currUser = res;
  },
  // eslint-disable-next-line no-shadow
  setOnlineVisitorNum(state, res) {
    state.onlineVisitorNum = res;
  },
  // eslint-disable-next-line no-shadow
  setOnlineUserNum(state, res) {
    state.onlineUserNum = res;
  },
  // eslint-disable-next-line no-shadow
  setHistoryHightOnlineNum(state, res) {
    state.historyHightOnlineNum = res;
  },
};

export const actions = {
  // eslint-disable-next-line no-shadow
  setWsInstanceAction({ commit }, data) {
    console.log('setWsInstanceAction', data);
    commit('setWsInstance', 'data');
  },
};
