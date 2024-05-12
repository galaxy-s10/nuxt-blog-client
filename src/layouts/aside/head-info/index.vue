<template>
  <div class="user-info">
    <div
      ref="dndRef"
      class="container"
      @mousedown="handleStart"
      @mousemove.prevent="handleMove"
      @mouseleave="handleLeave"
    >
      <div class="bgc"></div>
      <div class="user-avatar">
        <img
          v-if="userInfo"
          :src="
            userInfo
              ? userInfo.avatar
              : require('@/assets/img/default_avatar.webp')
          "
        />
        <img
          v-else
          :src="wsCurrUser.avatar"
        />
        <div
          :class="{
            status: true,
            connect: wsStatus === wsConnectStatus.connect,
          }"
        ></div>
      </div>

      <div class="info">
        <div class="name">
          {{ userInfo ? userInfo.username : `游客id：${wsCurrUser.id}` }}
        </div>
        <p class="title">{{ userInfo ? userInfo.desc : 'hello world！' }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import { wsConnectStatus } from '@/constant';
import { websocketMixin } from '@/mixin/websocket';

export default {
  name: 'UserInfoCpt',
  components: {},
  mixins: [websocketMixin],
  props: {},
  data() {
    return {
      wsConnectStatus,
      offset: { x: 0, y: 0 }, // x:距离最左边多少px；y:距离最下边多少px
      len: 0,
      position: { top: 0, left: 0 },
      requestAnimationFrameId: [],
      speed: 1,
      radius: 80,
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
    userInfo() {
      setTimeout(() => {
        this.outRoom();
        this.closeWs();
      });
      setTimeout(() => {
        this.createWebSocket();
      }, 500);
    },
  },
  created() {},
  mounted() {
    this.createWebSocket();
  },
  methods: {
    handleMove(event) {
      const currentTarget = event.currentTarget;
      const rect = currentTarget.getBoundingClientRect();
      if (event.targetTouches) {
        this.position.top = `${event.targetTouches[0].clientY - rect.top}px`;
        this.position.left = `${event.targetTouches[0].clientX - rect.left}px`;
      } else {
        this.position.top = `${event.clientY - rect.top}px`;
        this.position.left = `${event.clientX - rect.left}px`;
      }
      const myStep = () => {
        currentTarget.style.background = `radial-gradient(
          circle at ${this.position.left} ${this.position.top},
          rgba(0, 163, 255) 0,
          rgba(0, 163, 255, 0) calc(0% + ${this.len}px)
        )
        no-repeat border-box border-box rgba(0, 0, 0, 0)`;
        if (this.len < this.radius) {
          this.len += this.speed;
        } else {
          this.requestAnimationFrameId.forEach((val) => {
            window.cancelAnimationFrame(val);
          });
          this.requestAnimationFrameId = [];
        }
        this.requestAnimationFrameId.push(window.requestAnimationFrame(myStep));
      };
      if (this.len >= this.radius) {
        currentTarget.style.background = `radial-gradient(
          circle at ${this.position.left} ${this.position.top},
          rgba(0, 163, 255) 0,
          rgba(0, 163, 255, 0) calc(0% + ${this.len}px)
        )
        no-repeat border-box border-box rgba(0, 0, 0, 0)`;
        return;
      }
      myStep();
    },
    handleStart(event) {
      let x = 0;
      let y = 0;
      if (event.targetTouches) {
        x =
          event.targetTouches[0].pageX -
          this.$refs.dndRef.getBoundingClientRect().x;
        y =
          event.targetTouches[0].pageY -
          this.$refs.dndRef.getBoundingClientRect().y;
      } else {
        x = event.pageX - this.$refs.dndRef.getBoundingClientRect().x;
        y = event.pageY - this.$refs.dndRef.getBoundingClientRect().y;
      }
      this.offset.x = x;
      this.offset.y = y;
    },
    handleLeave(event) {
      this.len = 0;
      this.requestAnimationFrameId.forEach((val) => {
        window.cancelAnimationFrame(val);
      });
      this.requestAnimationFrameId = [];
      const currentTarget = event.currentTarget;
      currentTarget.style.background = 'none';
    },
  },
};
</script>

<style lang="scss" scoped>
.user-info {
  overflow: hidden;
  border-radius: 6px;
  background-color: white;
  .container {
    overflow: hidden;
    padding-bottom: 10px;
    border: 1px solid $theme-color4;
    background: $theme-color6;
    .bgc {
      height: 80px;
      background-image: -webkit-linear-gradient(
        43deg,
        #4158d0 0%,
        #c850c0 46%,
        #ffcc70 100%
      );
      background-image: -moz-linear-gradient(
        43deg,
        #4158d0 0%,
        #c850c0 46%,
        #ffcc70 100%
      );
      background-image: -o-linear-gradient(
        43deg,
        #4158d0 0%,
        #c850c0 46%,
        #ffcc70 100%
      );
      background-image: linear-gradient(
        43deg,
        #4158d0 0%,
        #c850c0 46%,
        #ffcc70 100%
      );
    }
    .user-avatar {
      position: relative;
      left: 50%;
      width: 80px;
      height: 80px;
      transform: translate(-50%, -50%);
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        transition: all 0.5s;
        transform: rotate(0);
        &:hover {
          transform: rotate(1turn);
        }
      }
      .status {
        position: absolute;
        right: 0;
        bottom: 0;
        width: 15px;
        height: 15px;
        border-radius: 50%;
        background-color: #b4b8ba;
        cursor: pointer;
        &.connect {
          background-color: #73d84d;
        }
      }
    }
    .info {
      margin-top: -30px;
      .name {
        text-align: center;
        font-weight: bold;
      }
      .title {
        margin: 4px;
        text-align: center;
      }
    }
  }
}
</style>
