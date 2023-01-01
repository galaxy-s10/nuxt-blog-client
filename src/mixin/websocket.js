import { getRandomOne } from 'billd-utils';
import { io } from 'socket.io-client';
import { mapMutations, mapState } from 'vuex';

import { wsInstance2, WsInstanceClass } from './ws';

import { wsConnectStatusEnum, wsMsgType, wsUserType } from '@/constant';

export const websocketMixin = {
  data() {
    return {
      wsInstance: null,
      wsUrl:
        process.env.NODE_ENV === 'production'
          ? 'wss://www.hsslive.cn' // wss需要配置域名，不能配置ip地址+端口号
          : 'ws://localhost:3300',
      // wsUrl:
      //   process.env.NODE_ENV === 'production'
      //     ? 'ws://42.193.157.44:3200' // ws不能运行在https上面
      //     : 'ws://localhost:3300',}
    };
  },
  watch: {},
  computed: {
    ...mapState({
      wsCurrUser(state) {
        return state.ws.currUser;
      },
      wsStatus(state) {
        return state.ws.wsStatus;
      },
      wsId(state) {
        return state.ws.wsId;
      },
      onlineUserNum(state) {
        return state.ws.onlineUserNum;
      },
      onlineVisitorNum(state) {
        return state.ws.onlineVisitorNum;
      },
      historyHightOnlineNum(state) {
        return state.ws.historyHightOnlineNum;
      },
      wsAvatarList(state) {
        return state.ws.wsAvatarList;
      },
      wsChatList(state) {
        return state.ws.wsChatList;
      },
      isJoin(state) {
        return state.ws.isJoin;
      },
    }),
  },
  methods: {
    ...mapMutations({
      setWsId: 'ws/setWsId',
      setWsStatus: 'ws/setWsStatus',
      setCurrUser: 'ws/setCurrUser',
      setOnlineUserNum: 'ws/setOnlineUserNum',
      setOnlineVisitorNum: 'ws/setOnlineVisitorNum',
      setHistoryHightOnlineNum: 'ws/setHistoryHightOnlineNum',
      setWsChatList: 'ws/setWsChatList',
      setWsAvatarList: 'ws/setWsAvatarList',
    }),
    handleAvatar() {
      const pathArr = require.context(
        '@/assets/img/avatar/',
        true,
        /.webp|.jpg|.png|.jpeg|.gif$/i
      );
      const res = [];
      pathArr.keys().forEach((path) => {
        try {
          const newpath = path.replace('./', '');
          res.push(require(`@/assets/img/avatar/${newpath}`));
        } catch (error) {
          console.log(error);
        }
      });
      this.setWsAvatarList(res);
    },
    // 获取在线游客和用户
    getOlineData() {
      this.wsInstance.emit(wsMsgType.getOnlineVisitorNum, {});
      this.wsInstance.emit(wsMsgType.getOnlineUserNum, {});
    },
    // 用户退出房间
    outRoom() {
      console.log('用户退出房间', this.wsCurrUser.id);
      this.wsInstance.emit(wsMsgType.userOutRoom, {
        id: this.wsCurrUser.id,
        username: this.wsCurrUser.username,
        userType: this.wsCurrUser.userType,
        avatar: this.wsCurrUser.avatar,
      });
    },
    // 用户加入房间
    joinRoom() {
      console.log('用户加入房间', this.wsCurrUser.username);
      this.wsInstance.emit(wsMsgType.userInRoom, {
        id: this.wsCurrUser.id,
        username: this.wsCurrUser.username,
        userType: this.wsCurrUser.userType,
        avatar: this.wsCurrUser.avatar,
      });
    },
    // 创建WebSocket
    createWebSocket() {
      try {
        if ('WebSocket' in window) {
          this.wsInstance = io(this.wsUrl, { transports: ['websocket'] });
          // this.wsInstance存在vuex会报错：Error: [vuex] do not mutate vuex store state outside mutation handlers.
          // 搞半天无解，将这个实例存在一个变量里好了。
          wsInstance2.instance = new WsInstanceClass(
            this.wsInstance
          ).wsInstance;
          this.initWebSocket();
        } else {
          console.log('你的浏览器不支持WebSocket！');
        }
      } catch (error) {
        console.log('创建WebSocket出错', error);
      }
    },
    // 初始化
    initWebSocket() {
      this.wsInstance.on(wsConnectStatusEnum.connect, () => {
        console.log('连接websocket成功');
        this.setWsStatus(wsConnectStatusEnum.connect);
        this.setWsId(this.wsInstance.id);
        this.setCurrUser({
          id: this.wsInstance.id,
          userType: this.userInfo ? wsUserType.user : wsUserType.visitor,
          username: this.userInfo ? this.userInfo.username : this.wsInstance.id,
          avatar: this.userInfo
            ? this.userInfo.avatar
            : getRandomOne(this.wsAvatarList),
        });
        this.handleReceiveMessage();
        this.joinRoom();
        this.getOlineData();
      });
      this.wsInstance.on(wsConnectStatusEnum.disconnect, (reason) => {
        if (reason === 'io server disconnect') {
          // the disconnection was initiated by the server, you need to reconnect manually
          this.wsInstance.connect();
        }
        console.log('断开websocket连接！');
      });
      this.wsInstance.on(wsConnectStatusEnum.connect_error, () => {
        console.log('连接websocket错误，开始重连！');
        this.wsInstance.connect();
      });
    },
    // 关闭websocket连接
    closeWs() {
      this.setWsStatus(this.wsConnectStatusEnum.disconnect);
      this.wsInstance.close();
    },
    // 处理收到的消息
    handleReceiveMessage() {
      this.wsInstance.on(wsMsgType.getOnlineUserNum, (data) => {
        this.setOnlineUserNum(data.count);
      });
      this.wsInstance.on(wsMsgType.getOnlineVisitorNum, (data) => {
        this.setOnlineVisitorNum(data.count);
      });
      this.wsInstance.on(wsMsgType.getHistoryHightOnlineNum, (data) => {
        this.setHistoryHightOnlineNum(data.count);
      });
      this.wsInstance.on(wsMsgType.visitorSwitchAvatar, (data) => {
        this.setCurrUser({
          avatar: data.avatar,
          id: this.wsInstance.id,
        });
      });
      this.wsInstance.on(wsMsgType.userInRoom, (data) => {
        this.setWsChatList([
          ...this.wsChatList,
          {
            type: wsMsgType.userInRoom,
            ...data,
          },
        ]);
      });
      this.wsInstance.on(wsMsgType.userOutRoom, (data) => {
        const { id, time } = data;
        this.setWsChatList([
          ...this.wsChatList,
          {
            type: wsMsgType.userOutRoom,
            id,
            time,
          },
        ]);
      });
      this.wsInstance.on(wsMsgType.userSendMsg, (data) => {
        const { id, avatar, msg, time } = data;
        this.setWsChatList([
          ...this.wsChatList,
          {
            type: wsMsgType.userSendMsg,
            id,
            avatar,
            msg,
            time,
          },
        ]);
      });
    },
  },

  mounted() {
    this.handleAvatar();
  },
};
