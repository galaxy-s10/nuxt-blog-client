<template>
  <div class="interaction-wrap">
    <h1 class="title">在线互动(Beta)</h1>
    <hr class="hr-class" />
    当前音乐列表：
    <div class="music-list">
      <span
        v-for="item in musicList"
        :key="item.id"
        class="music-item"
      >
        {{ item.id }}:{{ item.name }}
      </span>
    </div>
    <p>在线点歌：</p>
    <WebSocketCpt></WebSocketCpt>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import WebSocketCpt from '@/components/WebSocket/index.vue';

export default {
  components: { WebSocketCpt },
  layout: 'blog',
  async asyncData({ $myaxios, store, params }) {},
  data() {
    return {
      currentTagId: 1,
      currentTagName: '',
    };
  },
  head() {
    return {
      title: '聊天 - 自然博客',
      meta: [
        {
          name: 'description',
          content: '自然博客 - 聊天',
        },
        {
          name: 'keywords',
          content: '自然博客 - 聊天',
        },
      ],
    };
  },
  computed: {
    ...mapState({
      musicList(state) {
        return state.app.musicList;
      },
    }),
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.interaction-wrap {
  .title {
    display: block;
    text-align: center;
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
    }
  }
}
</style>
