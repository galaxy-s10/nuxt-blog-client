<template>
  <div class="websocket-wrap">
    <div>
      <!-- <div>当前连接状态: {{ wsStatus }}</div> -->
      <div>
        <span> 历史最高同时在线: {{ onlineData.historyHightOnlineNum }} </span>
        <span> | </span>
        <span> 当天最高同时在线: {{ onlineData.currDayHightOnlineNum }} </span>
      </div>
      <div>
        <span> 当前在线游客: {{ onlineData.visitor }}</span>
        <span> | </span>
        <span> 当前在线用户: {{ onlineData.user }}</span>
      </div>
    </div>
    <div class="main">
      <div
        ref="content-list"
        class="content-list"
      >
        <div
          v-for="(item, index) in wsChatList"
          :key="index"
          class="item"
        >
          <div
            v-if="item.type === wsMsgType.userInRoom"
            class="tip"
          >
            <span class="username">
              {{
                item.data.userInfo.userType === wsUserType.visitor
                  ? '游客'
                  : '用户'
              }}:
              {{ item.data.userInfo.username }}
            </span>
            加入了聊天({{ item.data.created_at }})
          </div>
          <div
            v-if="item.type === wsMsgType.userOutRoom"
            class="tip"
          >
            <span class="username">
              {{
                item.data.userInfo.userType === wsUserType.visitor
                  ? '游客'
                  : '用户'
              }}:
              {{ item.data.userInfo.username }}
            </span>
            退出了聊天({{ item.data.created_at }})
          </div>
          <div v-if="item.type === wsMsgType.userSendMsg">
            <div
              :class="{
                'msg-item': true,
                'is-me': item.data.userInfo.id === wsId,
              }"
            >
              <img
                :src="item.data.userInfo.avatar"
                class="avatar"
                alt=""
              />
              <div class="info">
                <div
                  v-if="item.data.userInfo.id !== wsId"
                  class="nickname"
                >
                  {{ item.data.userInfo.username }}
                </div>
                <div class="msg">
                  {{ item.data.value.msg }}
                  <i class="triangle"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="!isJoin"
        class="mask"
      ></div>

      <div
        v-if="!isJoin"
        class="join"
      >
        <div class="item avatar">
          <img
            v-if="userInfo"
            width="50"
            class="avatar"
            :src="wsCurrUser.avatar"
            alt=""
          />
          <el-popover
            v-else
            popper-class="popover"
            placement="bottom"
            width="200"
            trigger="click"
          >
            <div class="avatar-list">
              <img
                v-for="(item, index) in wsAvatarList"
                :key="index"
                :src="item"
                class="avatar"
                alt=""
                @click="visitorSwitchAvatar(item)"
              />
            </div>
            <div slot="reference">
              <div class="curr-avatar">
                <img
                  width="50"
                  class="avatar"
                  :src="wsCurrUser.avatar"
                  alt=""
                />
                <i class="el-icon-caret-bottom bottom"></i>
              </div>
            </div>
          </el-popover>
        </div>
        <div class="item input">
          <div>
            <el-input
              v-model="wsCurrUser.username"
              :disabled="true"
              placeholder="请输入昵称"
            ></el-input>
          </div>
        </div>
        <div
          class="item btn"
          @click="setIsJoin(true)"
        >
          加入
        </div>
      </div>
      <div
        v-else
        class="send-msg"
      >
        <el-input
          v-model="msg"
          placeholder="请输入内容"
        >
          <template slot="append">
            <el-button @click="userSendMsg">发送</el-button>
          </template>
        </el-input>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';

import { wsMsgType, wsConnectStatus, wsUserType } from '@/constant';
import { websocketMixin } from '@/mixin/websocket';
import { wsInstance2 } from '@/mixin/ws';
export default {
  mixins: [websocketMixin],
  data() {
    return {
      wsMsgType,
      wsConnectStatus,
      wsUserType,
      msg: '',
    };
  },
  computed: {
    ...mapState({
      userInfo(state) {
        return state.user.userInfo;
      },
    }),
  },
  watch: {
    wsChatList() {
      this.$nextTick(() => {
        this.$refs['content-list'].scrollTop =
          this.$refs['content-list'].scrollHeight;
      });
    },
  },
  mounted() {},
  destroyed() {},
  methods: {
    ...mapMutations({
      setIsJoin: 'ws/setIsJoin',
    }),
    visitorSwitchAvatar(avatar) {
      wsInstance2.instance.emit(wsMsgType.visitorSwitchAvatar, {
        avatar,
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
      wsInstance2.instance.emit(wsMsgType.userSendMsg, {
        id: this.wsCurrUser.id,
        userInfo: this.wsCurrUser,
        value: { msg: this.msg },
      });
      this.msg = '';
    },
  },
};
</script>

<style lang="scss" scoped>
.websocket-wrap {
  .main {
    position: relative;
    .content-list {
      overflow-y: scroll;
      height: 400px;
      background-color: $theme-color3;

      @extend %hideScrollbar;
      .item {
        margin-bottom: 10px;
        padding: 0 10px;
      }
      .tip {
        margin: 10px 0;
        text-align: center;
        font-size: 14px;
        .username {
          font-weight: bold;
        }
      }
      .msg-item {
        display: flex;
        &.is-me {
          flex-direction: row-reverse;
          .info {
            .msg {
              background-color: $theme-color11;
              .triangle {
                top: 12px;
                right: -5px;
                left: auto;
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
            margin-top: 4px;
            padding: 10px;
            max-width: 200px;
            border-radius: 5px;
            background-color: $theme-color6;
            word-break: break-all;
            .triangle {
              position: absolute;
              top: 15px;
              right: auto;
              left: -5px;
              width: 10px;
              height: 10px;
              background-color: inherit;
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
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: $theme-color3;
    }
    .join {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100%;
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
          border-radius: 50%;
          background-color: #0093e9;
          background-image: linear-gradient(160deg, #0093e9 0%, #80d0c7 100%);
          color: $theme-color6;
          text-align: center;
          line-height: 60px;
          cursor: pointer;
        }
        .curr-avatar {
          position: relative;
          .bottom {
            position: absolute;
            right: 0;
            bottom: 0;
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
    margin-bottom: 10px;
    width: 30%;
    border-radius: 50%;
    cursor: pointer;
  }
}
</style>
