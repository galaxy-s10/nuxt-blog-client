<template>
  <div class="websocket-wrap">
    <div class="nav">
      当前连接状态: {{ connectStatus }}，当前在线人数: {{ onlineCount }}
    </div>
    <div class="main">
      <div ref="content-list" class="content-list">
        <div v-for="(item, index) in chatList" :key="index" class="item">
          <div v-if="item.type === webSocketMsgType.userInRoom" class="tip">
            {{ item.nickname }}加入了聊天({{ item.time }})
          </div>
          <div v-if="item.type === webSocketMsgType.userOutRoom" class="tip">
            {{ item.nickname }}退出了聊天({{ item.time }})
          </div>
          <div v-if="item.type === webSocketMsgType.userSendMsg">
            <div :class="{ 'msg-item': true, 'is-me': item.id === wsId }">
              <img :src="item.avatar" class="avatar" alt="" />
              <div class="info">
                <div v-if="item.id !== wsId" class="nickname">
                  {{ item.nickname }}
                </div>
                <div class="msg">
                  {{ item.msg }}
                  <i class="triangle"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!isJoin" class="mask"></div>

      <div v-if="!isJoin" class="join">
        <div class="item avatar">
          <el-popover
            popper-class="popover"
            placement="bottom"
            width="200"
            trigger="click"
          >
            <div class="avatar-list">
              <img
                v-for="(item, index) in avatarList"
                :key="index"
                :src="item"
                class="avatar"
                alt=""
                @click="avatar = item"
              />
            </div>
            <div slot="reference">
              <div class="curr-avatar">
                <img width="50" class="avatar" :src="avatar" alt="" />
                <i class="el-icon-caret-bottom bottom"></i>
              </div>
            </div>
          </el-popover>
        </div>
        <div class="item input">
          <div>
            <el-input
              v-model="nickname"
              maxlength="6"
              placeholder="请输入昵称"
            ></el-input>
          </div>
        </div>
        <div class="item btn" @click="join">加入</div>
      </div>
      <div v-else class="send-msg">
        <el-input v-model="msg" placeholder="请输入内容"
          ><template slot="append">
            <el-button @click="userSendMsg">发送</el-button>
          </template>
        </el-input>
      </div>
    </div>
  </div>
</template>

<script>
import { io } from 'socket.io-client';
const webSocketMsgType = {
  connect: 'connect', // 用户连接
  userInRoom: 'userInRoom', // 用户进入聊天
  userOutRoom: 'userOutRoom', // 用户退出聊天
  userSendMsg: 'userSendMsg', // 用户发送消息
  heartbeatCheck: 'heartbeatCheck', // 心跳检测
  getOnlineUser: 'getOnlineUser', // 获取在线用户
};
const connectStatusEnum = {
  connecting: 'connecting', // 连接中
  connected: 'connected', // 已连接
  disconnect: 'disconnect', // 断开连接
  reconnect: 'reconnect', // 重新连接
};
const avatarList = [
  'https://img.cdn.hsslive.cn/1613141138717Billd.webp',
  'https://img.cdn.hsslive.cn/1610170474620Hololo.webp',
  'https://img.cdn.hsslive.cn/1610170481257MoonTIT.webp',
  'https://img.cdn.hsslive.cn/1610170481257CoCo.webp',
  'https://img.cdn.hsslive.cn/1610170481257Nill.webp',
  'https://img.cdn.hsslive.cn/1610170481257Ojin.webp',
];
export default {
  name: 'App',
  data() {
    return {
      webSocketMsgType,
      connectStatusEnum,
      connectStatus: connectStatusEnum.disconnect, // 是否连接
      // heartbeatPingTime: 1000, // 心跳检测时间（毫秒）
      // heartbeatTimer: null, // 心跳定时器
      wsInstance: null, // ws实例
      chatList: [],
      avatarList,
      nickname: '',
      wsId: null,
      avatar: avatarList[0],
      isJoin: false, // 是否已加入聊天
      msg: '',
      onlineCount: 0, // 当前在线人数
      // url: 'wss://www.zhengbeining.com/wss/',
      url: 'wss://www.hsslive.cn/',
      // url: 'ws://42.193.157.44:3200',
      // url: 'ws://localhost:3300',
    };
  },
  computed: {},
  watch: {
    chatList() {
      this.$nextTick(() => {
        this.$refs['content-list'].scrollTop =
          this.$refs['content-list'].scrollHeight;
      });
    },
  },
  mounted() {
    this.createWebSocket(this.url);
  },
  destroyed() {
    this.closeWs();
  },
  methods: {
    join() {
      if (this.nickname.length > 6) {
        this.$newmessage('昵称最多6个字符!', 'info');
      }
      this.isJoin = true;
      this.wsInstance.emit(webSocketMsgType.userInRoom, {
        nickname: this.nickname,
        msg: this.msg,
      });
    },
    // 关闭websocket连接
    closeWs() {
      this.connectStatus = this.connectStatusEnum.disconnect;
      this.wsInstance.close();
    },
    // 处理收到的消息
    handleReceiveMessage() {
      this.wsInstance.on(webSocketMsgType.getOnlineUser, (data) => {
        this.onlineCount = data.count;
      });
      this.wsInstance.on(webSocketMsgType.userInRoom, (data) => {
        const { nickname, msg, time } = data;
        this.chatList.push({
          type: webSocketMsgType.userInRoom,
          nickname,
          msg,
          time,
        });
      });
      this.wsInstance.on(webSocketMsgType.userOutRoom, (data) => {
        const { nickname, time } = data;
        this.chatList.push({
          type: webSocketMsgType.userOutRoom,
          nickname,
          time,
        });
      });
      this.wsInstance.on(webSocketMsgType.userSendMsg, (data) => {
        const { id, nickname, avatar, msg, time } = data;
        this.chatList.push({
          type: webSocketMsgType.userSendMsg,
          id,
          nickname,
          avatar,
          msg,
          time,
        });
      });
    },
    // 新建WebSocket
    createWebSocket(url) {
      try {
        if ('WebSocket' in window) {
          this.wsInstance = io(url, { transports: ['websocket'] });
          this.initWebSocket();
        } else {
          console.log('你的浏览器不支持WebSocket！');
        }
      } catch (error) {
        console.log('新建WebSocket出错', error);
      }
    },
    // 初始化
    initWebSocket() {
      this.wsInstance.on('connect', () => {
        this.wsId = this.wsInstance.id;
        this.connectStatus = this.connectStatusEnum.connected;
        this.wsInstance.emit(webSocketMsgType.getOnlineUser, {});
        this.handleReceiveMessage();
      });
      this.wsInstance.on('disconnect', (reason) => {
        if (reason === 'io server disconnect') {
          // the disconnection was initiated by the server, you need to reconnect manually
          this.wsInstance.connect();
        }
        console.log('断开websocket连接!');
      });
      this.wsInstance.on('connect_error', () => {
        console.log('连接websocket错误，开始重连！');
        this.wsInstance.connect();
      });
    },
    // 用户发送消息
    userSendMsg() {
      if (this.msg.trim() === '') {
        this.$newmessage('请输入内容', 'info');
        return;
      }
      if (this.msg.length > 100) {
        this.$newmessage('最多输入100个字符', 'info');
        return;
      }
      this.wsInstance.emit(webSocketMsgType.userSendMsg, {
        nickname: this.nickname,
        avatar: this.avatar,
        msg: this.msg,
      });
      this.msg = '';
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/css/constant.scss';
@import '@/assets/css/mixin.scss';
.websocket-wrap {
  .main {
    position: relative;
    .content-list {
      height: 400px;
      overflow-y: scroll;
      background-color: $theme-color3;
      @extend .hideScrollbar;
      .item {
        padding: 0 10px;
        margin-bottom: 10px;
      }
      .tip {
        text-align: center;
        margin: 10px 0;
      }
      .msg-item {
        display: flex;
        &.is-me {
          flex-direction: row-reverse;
          .info {
            .msg {
              background-color: $theme-color11;
              .triangle {
                left: auto;
                right: -5px;
                top: 12px;
              }
            }
          }
        }
        .avatar {
          width: 40px;
          height: 40px;
        }
        .info {
          margin: 0 10px;

          .nickname {
            font-size: 14px;
          }
          .msg {
            position: relative;
            max-width: 200px;
            border-radius: 5px;
            word-break: break-all;
            margin-top: 4px;
            background-color: $theme-color6;
            padding: 10px;
            .triangle {
              width: 10px;
              height: 10px;
              background-color: inherit;
              position: absolute;
              left: -5px;
              right: auto;
              top: 15px;
              transform: rotate(45deg);
            }
          }
        }
      }
    }
    .send-msg {
      display: flex;
    }
    .mask {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background-color: $theme-color3;
    }
    .join {
      position: absolute;
      width: 100%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      .item {
        margin: 0 auto;
        &.avatar {
          width: 50px;
        }
        &.input {
          margin-top: 20px;
          width: 30%;
        }
        &.btn {
          margin-top: 20px;
          width: 60px;
          height: 60px;
          color: $theme-color6;
          line-height: 60px;
          border-radius: 50%;
          text-align: center;
          background-color: $theme-color1;
          cursor: pointer;
        }
        .curr-avatar {
          position: relative;
          .bottom {
            position: absolute;
            bottom: 0;
            right: 0;
          }
        }
        .avatar {
          width: 50px;
          border-radius: 50%;
          cursor: pointer;
        }
      }
    }
  }
}
</style>

<style lang="scss">
.popover {
  width: 200px;
  .avatar-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }

  .avatar {
    width: 30%;
    border-radius: 50%;
    margin-bottom: 10px;
    cursor: pointer;
  }
}
</style>
