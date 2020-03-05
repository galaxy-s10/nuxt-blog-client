<template>
  <div style="overflow:hidden;background:white;box-shadow:0 0 5px rgba(0,0,0,.1);" class="content">
    <div style="margin:30px;">
      <el-timeline>
        <el-timeline-item>
          <h1>目前一共{{total}}篇文章</h1>
        </el-timeline-item>
        <el-timeline-item
          v-for="(item,index) in history"
          :key="index"
          :timestamp="format(item.date)"
        >
          <router-link :to="'/article/'+item.id" class="acss">{{item.title}}</router-link>
        </el-timeline-item>
      </el-timeline>
      <page :total="total" :pagesize="pagesize" @currentchange="currentchange" />
    </div>
  </div>
</template>

<script>
import page from "../../components/page";
import { format } from "@/utils/format.js";
export default {
  layout: "blog",
  components: {
    page
  },
  data() {
    return {};
  },
  head() {
    return {
      title: "归档"
    };
  },
  methods: {
    // 格式化时间
    format(time) {
      return format(time);
    },
    currentchange(nowpage) {
      // this.$store.commit("article/nowpage", nowpage);
      this.$store.dispatch("article/articlepage", {
        ordername: "date",
        orderby: "desc",
        nowpage
      });
    }
  },
  created() {},
  computed: {
    history() {
      return this.$store.state.article.list;
    },
    total() {
      return this.$store.state.article.count;
    },
    pagesize() {
      return this.$store.state.article.historypagesize;
    }
  },
  async asyncData({ $axios, store }) {
    // const { data } = await $axios.$get(
    //   `article/archive?page=${store.getters.archivePage}&limit=10`
    // );
    // await store.commit("article/nowtype", null);
    await store.dispatch("article/articlepage", {
      ordername: "date",
      orderby: "desc",
      nowpage:1
    });
  },
  mounted() {
    // this.$store.dispatch("article/history", {
    //   ordername: "date",
    //   orderby: "desc"
    // });
  }
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