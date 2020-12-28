<template>
  <div
    style="
      overflow: hidden;
      background: white;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    "
    class="content"
  >
    <div style="margin: 30px">
      <el-timeline>
        <el-timeline-item>
          <h1>目前一共{{ total }}篇文章</h1>
        </el-timeline-item>
        <el-timeline-item
          v-for="(item, index) in history"
          :key="index"
          :timestamp="formatDate(item.createdAt)"
        >
          <router-link :to="'/article/' + item.id" class="acss">{{
            item.title
          }}</router-link>
        </el-timeline-item>
      </el-timeline>
      <page
        :total="total"
        :pagesize="pagesize"
        @currentchange="currentchange"
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
      meta: [
        { hid: 'home', name: 'description', content: '自然 - 个人博客' }
      ]
    };
  },
  methods: {
    currentchange(nowpage) {
      this.$store.dispatch("article/articlepage", {
        ordername: "createdAt",
        orderby: "desc",
        nowpage,
      });
    },
  },
  created() {},
  computed: {
    formatDate(time) {
      return (time) => {
        return format(time);
      };
    },
    history() {
      return this.$store.state.article.list;
    },
    total() {
      return this.$store.state.article.count;
    },
    pagesize() {
      return this.$store.state.article.historypagesize;
    },
  },
  async asyncData({ $axios, store }) {
    await store.dispatch("article/articlepage", {
      ordername: "createdAt",
      orderby: "desc",
      nowpage: 1,
    });
  },
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