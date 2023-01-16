<template>
  <div class="interaction-wrap">
    <h1 class="title">在线互动(Beta)</h1>
    <hr class="hr-class" />

    <div class="interaction-list">
      历史记录（最近100条）
      <SliderCpt
        v-if="interactionList.length"
        :list="interactionList"
        :row="3"
      ></SliderCpt>
    </div>
    <template v-if="userInfo">
      <p>点歌：</p>
      <div class="music-list">
        <span
          v-for="item in musicList"
          :key="item.id"
          class="music-item"
          @click="handleChooseSong(item)"
        >
          {{ item.id }}:{{ item.name }}
        </span>
      </div>
    </template>
    <template v-else>Tips: 登录后可以点歌~</template>

    <WebSocketCpt></WebSocketCpt>
  </div>
</template>

<script>
import { mapState } from 'vuex';

// eslint-disable-next-line
import { Api } from '@/api';
import SliderCpt from '@/components/Slider/index.vue';
import WebSocketCpt from '@/components/WebSocket/index.vue';
import { wsMsgType, wsUserType } from '@/constant';
import { wsInstance2 } from '@/mixin/ws';

export default {
  components: { WebSocketCpt, SliderCpt },
  layout: 'blog',
  /**
   * @typedef {Object} asyncDataType
   * @property {Api} $myaxios
   * @property {Object} store
   * @property {Object} params
   * @property {Object} req
   * @param {asyncDataType} value
   * https://nuxtjs.org/docs/concepts/context-helpers
   */
  async asyncData({ $myaxios, store, params, req }) {},
  data() {
    return { wsUserType, rowsLen: 0, interactionList: [] };
  },
  head() {
    return {
      title: '互动 - 自然博客',
      meta: [
        {
          name: 'description',
          content: '自然博客 - 互动',
        },
        {
          name: 'keywords',
          content: '自然博客 - 互动',
        },
      ],
    };
  },
  computed: {
    ...mapState({
      musicList(state) {
        return state.app.musicList;
      },
      userInfo(state) {
        return state.user.userInfo;
      },
    }),
  },
  watch: {},
  created() {},
  mounted() {
    this.getInteractionList();
  },
  methods: {
    handleChooseSong(item) {
      wsInstance2.instance.emit(wsMsgType.chooseSong, {
        userInfo: this.userInfo,
        music: item,
      });
    },
    async getInteractionList() {
      const { code, data } = await this.$myaxios.interaction.list({
        nowPage: 1,
        pageSize: 100,
        orderName: 'created_at',
        orderBy: 'desc',
      });
      if (code === 200) {
        const res = [];
        // 不管多少条数据，都平均分成3份
        const count = Math.ceil(data.rows.length / 3);
        for (let i = 0, len = data.rows.length; i < len; i += count) {
          const item = data.rows.slice(i, i + count);
          res.push([...item, ...item]);
        }
        this.rowsLen = data.rows.length;
        this.interactionList = data.rows;
      } else {
        console.log('getInteractionList出错');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@keyframes left-right {
  0% {
    transform: translateX(-1000px);
  }
  100% {
    transform: translateX(0);
  }
}
@keyframes right-left {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-1000px);
  }
}
.interaction-wrap {
  .title {
    display: block;
    text-align: center;
  }
  .interaction-list {
  }
  .music-list {
    .music-item {
      display: inline-block;
      margin-right: 6px;
      margin-bottom: 6px;
      padding: 3px 6px;
      border-radius: 4px;
      background-color: #8ec5fc;
      background-image: linear-gradient(62deg, #8ec5fc 0%, #e0c3fc 100%);
      color: white;
      font-size: 14px;
      cursor: pointer;
    }
  }
}
</style>
