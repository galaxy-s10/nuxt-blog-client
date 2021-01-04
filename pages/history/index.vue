<template>
  <div
    style="overflow: hidden; background: white; box-shadow: 0 0 5px rgba(0, 0, 0, 0.1)"
    class="content"
  >
    <div style="margin: 30px">
      <el-timeline>
        <el-timeline-item>
          <h1>目前一共{{ count }}篇文章</h1>
        </el-timeline-item>
        <el-timeline-item
          v-for="(item, index) in historyList"
          :key="index"
          :timestamp="formatDate(item.createdAt)"
        >
          <router-link :to="'/article/' + item.id" class="acss">{{
            item.title
          }}</router-link>
        </el-timeline-item>
      </el-timeline>
      <page
        :count="count"
        :nowPage="nowPage"
        :pageSize="pageSize"
        @currentChange="currentChange"
      />
    </div>
  </div>
</template>

<script>
import page from "../../components/page";
import { format } from "@/utils/format.js";
export default {
  layout: "blog",
  components: {
    page,
  },
  data() {
    return {};
  },
  head() {
    return {
      title: "归档 - 自然博客",
      meta: [{ hid: "home", name: "description", content: "自然 - 个人博客" }],
    };
  },
  methods: {
    currentChange(nowPage) {
      this.$store.dispatch("article/getHistoryList", { nowPage });
    },
  },
  created() {},
  computed: {
    formatDate(time) {
      return (time) => {
        return format(time);
      };
    },
    historyList() {
      return this.$store.state.article.historyList;
    },
    count() {
      return this.$store.state.article.count;
    },
    nowPage() {
      return this.$store.state.article.nowPage;
    },
    pageSize() {
      return this.$store.state.article.historyPageSize;
    },
  },
  async fetch({ store, params }) {
    await store.dispatch("article/getHistoryList", { nowPage: 1 });
  },
  async asyncData({ $axios, store }) {},
  mounted() {},
};
</script>

<style>
.acss {
  text-decoration: none;
  font-size: 18px;
  color: #666;
}
.acss:hover {
  color: #53a8ff;
}
</style>
