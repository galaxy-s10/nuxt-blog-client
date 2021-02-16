<template>
  <div
    class="content"
    style="
      overflow: hidden;
      background: white;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
      padding: 30px;
    "
  >
    <h1 style="text-align: center; padding: 10px">关于</h1>
    <hr class="hrclass" />
    <!-- 数据统计 -->
    <div class="summary">
      <div class="tongji">数据统计</div>
      <div class="list">
        <div class="item">
          <div class="num">{{ filterNum(summary.articleCount) }}</div>
          <div class="type">文章</div>
        </div>
        <div class="item">
          <div class="num">{{ filterNum(summary.commentCount) }}</div>
          <div class="type">评论</div>
        </div>
        <div class="item">
          <div class="num">{{ filterNum(summary.readCount) }}</div>
          <div class="type">阅读</div>
        </div>
        <div class="item">
          <div class="num">{{ filterNum(summary.userCount) }}</div>
          <div class="type">用户</div>
        </div>
        <div class="item">
          <div class="num">{{ filterNum(summary.visitorLogCount) }}</div>
          <div class="type">访问量</div>
        </div>
      </div>
    </div>
    <div>
      <!-- <div class="hljs" v-html="newcontent(item.content)"></div> -->
      <markdown :md="detail"></markdown>
    </div>
    <h1>本站发展历史</h1>
    <el-timeline>
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
import markdown from "../../components/markdown";

export default {
  layout: "blog",
  components: {
    markdown,
  },
  data() {
    return {
      detail: {},
      summary: {}, //数据统计
      activities: [
        {
          content: "第一次尝试写博客并上线",
          timestamp: "2019-9-10",
          color: "#f9f5c7",
        },
        {
          content: "重写前端ui,后台使用vue-element-template",
          timestamp: "2019-10-12",
          color: "#0bbd87",
        },
        {
          content: "重写后端,使用sequelize",
          timestamp: "2019-12-1",
          color: "pink",
        },
        {
          content: "改成ssr利于seo,使用nuxt框架",
          timestamp: "2020-1-20",
          color: "#275cc7",
        },
        {
          content: "修复若干bug,新增jwt验证权限",
          timestamp: "2020-3-1",
          color: "skyblue",
        },
      ],
    };
  },
  head() {
    return {
      title: "关于 - 自然博客",
      meta: [{ hid: "home", name: "description", content: "自然 - 个人博客" }],
    };
  },
  async fetch({ $axios, store, params }) {},
  async asyncData({ $axios, store }) {
    let res = await $axios.$get("/api/frontend/detail");
    return {
      detail: res.detail.frontend_about,
      summary: res.summary,
    };
    // this.detail = res.detail.frontend_about;
  },
  methods: {
    filterNum(v) {
      let res = v;
      if (v < 1000) {
        res = v;
      } else if (v >= 1000 && v < 10000) {
        res = (v / 1000).toFixed(1) + "k+";
      } else {
        res = (v / 10000).toFixed(2) + "w+";
      }
      return res;
    },
  },
};
</script>

<style scoped>
.summary {
  position: relative;
  border: 1px dashed #e0e0e0;
  padding: 20px 50px;
  margin: 32px 0 24px;
  border-radius: 6px;
}
.summary .tongji {
  color: #fff;
  padding: 4.5px;
  position: absolute;
  top: -15px;
  left: 56px;
  background: #fff;
  background: #eb5055;
  padding: 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}
.summary .list {
  display: flex;
}
.summary .list .item {
  flex: 1;
  /* font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif; */
  text-align: center;
  color: #666;
}
.summary .list .num {
  font-size: 2rem;
  color: #adabab;
}
.summary .list .type {
  font-size: 0.9rem;
}

.font {
  display: inline-block;
  margin-right: 15px;
  font-size: 18px;
  height: 40px;
  line-height: 40px;
}
.alink {
  color: #666;
  text-decoration: none;
}
</style>
