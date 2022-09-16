<template>
  <div class="about-wrap">
    <h1 class="title">关于</h1>

    <hr class="hr-class" />

    <!-- 数据统计 -->
    <div class="summary">
      <div class="badge">数据统计</div>
      <div class="list">
        <div class="item">
          <div class="num">{{ summary.article.total | filterNum }}</div>
          <div class="type">文章</div>
        </div>
        <div class="item">
          <div class="num">{{ summary.comment.total | filterNum }}</div>
          <div class="type">评论</div>
        </div>
        <div class="item">
          <div class="num">{{ summary.article.read | filterNum }}</div>
          <div class="type">阅读</div>
        </div>
        <div class="item">
          <div class="num">{{ summary.user.total | filterNum }}</div>
          <div class="type">用户</div>
        </div>
        <div class="item">
          <div class="num">{{ summary.visit.total | filterNum }}</div>
          <div class="type">访问量</div>
        </div>
      </div>
    </div>

    <!-- about富文本 -->
    <AsyncRenderMarkdownCpt
      :md="frontendData.frontend_about"
    ></AsyncRenderMarkdownCpt>
  </div>
</template>

<script>
import { init } from '@/mixin/init';
export default {
  components: {
    AsyncRenderMarkdownCpt: () => import('components/RenderMarkdown/index.vue'),
  },
  mixins: [init],
  layout: 'blog',
  async asyncData({ $myaxios }) {
    const { data } = await $myaxios.get('/statis/detail');
    return {
      summary: data,
    };
  },
  data() {
    return {};
  },
  head() {
    return {
      title: '关于 - 自然博客',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Natural Blog - About',
        },
      ],
    };
  },
  computed: {
    frontendData() {
      return this.$store.state.app.frontendData;
    },
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
@import '@/assets/css/constant.scss';
.about-wrap {
  .title {
    display: block;
    text-align: center;
  }
  .summary {
    position: relative;
    margin: 30px 0;
    padding: 20px;
    border: 1px solid $theme-color4;
    border-radius: 6px;
    .badge {
      position: absolute;
      top: 0;
      left: 0;
      padding: 4px;
      border-radius: 4px;
      background: $theme-color7;
      color: $theme-color6;
      font-size: 12px;
      transform: translate(50%, -50%);
    }
    .list {
      display: flex;
      .item {
        flex: 1;
        text-align: center;
      }
      .num {
        padding: 10px 0;
        font-size: 24px;
      }
      .type {
        font-size: 12px;
      }
    }
  }
}
</style>
