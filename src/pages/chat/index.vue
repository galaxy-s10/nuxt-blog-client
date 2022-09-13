<template>
  <div class="chat-wrap">
    <h1 class="title">在线聊天</h1>
    <hr class="hr-class" />
    <p>暂时关闭~</p>
    <!-- <WebSocketCpt></WebSocketCpt> -->
  </div>
</template>

<script>
// import WebSocketCpt from 'components/WebSocket'
export default {
  components: {},
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
          hid: 'chat',
          name: 'chat',
          content: 'Natural Blog - Chat',
        },
      ],
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
@import '@/assets/css/constant.scss';
.chat-wrap {
  .title {
    display: block;
    text-align: center;
  }
}
</style>
