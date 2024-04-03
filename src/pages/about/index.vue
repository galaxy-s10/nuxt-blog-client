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

    <template v-if="frontendData">
      <!-- about富文本 -->
      <LazyRenderMarkdown
        :md="frontendData.about_me.value"
      ></LazyRenderMarkdown>

      <div class="update-time">
        最后更新：{{ frontendData.about_me.updated_at }}
      </div>
    </template>
  </div>
</template>

<script>
// eslint-disable-next-line
import { Api } from '@/api';

export default {
  components: {},
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
  async asyncData({ $myaxios, store, params, req }) {
    try {
      const [summaryData] = await Promise.all([
        $myaxios.statis.detail(),
        store.dispatch('app/getFrontendData'),
      ]);
      return {
        summary: summaryData.data,
      };
    } catch (error) {
      console.log(error);
    }
  },
  data() {
    return {};
  },
  head() {
    return {
      title: '关于 - 记录生活与技术',
      meta: [
        {
          name: 'description',
          content: '记录生活与技术 - 关于',
        },
        {
          name: 'keywords',
          content: '记录生活与技术 - 关于',
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
  .update-time {
    text-align: right;
  }
}
</style>
