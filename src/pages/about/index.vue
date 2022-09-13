<template>
  <div class="about-wrap">
    <h1 class="title">关于</h1>

    <hr class="hr-class" />

    <!-- 数据统计 -->
    <div class="summary">
      <div class="badge">数据统计</div>
      <div class="list">
        <div class="item">
          <div class="num">{{ filterNum(summary.article.total) }}</div>
          <div class="type">文章</div>
        </div>
        <div class="item">
          <div class="num">{{ filterNum(summary.comment.total) }}</div>
          <div class="type">评论</div>
        </div>
        <div class="item">
          <div class="num">{{ filterNum(summary.article.read) }}</div>
          <div class="type">阅读</div>
        </div>
        <div class="item">
          <div class="num">{{ filterNum(summary.user.total) }}</div>
          <div class="type">用户</div>
        </div>
        <div class="item">
          <div class="num">
            {{
              visitorHistoryData && filterNum(visitorHistoryData.visit_total)
            }}
          </div>
          <div class="type">访问量</div>
        </div>
      </div>
    </div>

    <!-- about富文本 -->
    <AsyncRenderMarkdownCpt
      :md="frontendData.frontend_about"
    ></AsyncRenderMarkdownCpt>

    <h1>本站发展历史</h1>

    <!-- 时间线 -->
    <el-timeline :reverse="'reverse'">
      <el-timeline-item
        v-for="(activity, index) in activities"
        :key="index"
        :icon="activity.icon"
        :type="activity.type"
        :color="activity.color"
        :size="activity.size"
        :timestamp="activity.timestamp"
        >{{ activity.content }}</el-timeline-item
      >
    </el-timeline>
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
    return {
      activities: [
        {
          content: '第一次尝试写博客并上线',
          timestamp: '2019-09-10',
          color: '#f9f5c7',
        },
        {
          content: '重写前端ui,后台使用vue-element-template',
          timestamp: '2019-10-12',
          color: '#0bbd87',
        },
        {
          content: '重写后端,使用sequelize',
          timestamp: '2019-12-01',
          color: 'pink',
        },
        {
          content: '改成ssr利于seo,使用nuxt框架',
          timestamp: '2020-01-20',
          color: '#275cc7',
        },
        {
          content: '修复若干bug,新增jwt验证权限',
          timestamp: '2020-03-01',
          color: 'skyblue',
        },
        {
          content: '初步重构前后端',
          timestamp: '2022-02-01',
          color: '#8137a5',
        },
      ],
    };
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
    visitorHistoryData() {
      return this.$store.state.log.historyData;
    },
  },
  methods: {
    filterNum(v) {
      let res = v;
      if (v < 1000) {
        res = v;
      } else if (v >= 1000 && v < 10000) {
        res = `${(v / 1000).toFixed(1)}k+`;
      } else {
        res = `${(v / 10000).toFixed(2)}w+`;
      }
      return res || 0;
    },
  },
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
