<template>
  <div>
    <article v-for="(item,index) in pagelist" :key="index" class="article-con">
      <div class="article-l">
        <nuxt-link
          :to="`/article/${item.id}`"
          tag="div"
          v-lazy:background-image="item.img"
          class="img"
        />
      </div>
      <div class="article-r">
        <nuxt-link :to="'/article/'+item.id" tag="h2" class="overtext">{{item.title}}</nuxt-link>
        <el-divider></el-divider>
        <p>暂时无可提供的摘要</p>
        <p style="font-size:12px">
          <span class="jgh">{{format1(item.date)}}</span>
          <span class="jgh">{{item.click}}次浏览</span>
          <span>{{item.Comments.length}}条评论</span>
        </p>
      </div>
    </article>
    <div style="text-align:center;padding:30px 0">
      <!-- <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="pagesize"
        @current-change="currentchange"
      ></el-pagination>-->
      <page :total="total" :pagesize="pagesize" @currentchange="currentchange" />
    </div>
  </div>
</template>

<script>
import page from "../components/page";
import { format, format1 } from "@/utils/format.js";
export default {
  layout: "blog",
  components: {
    page
  },
  data() {
    return {
      visible: false
    };
  },
  head() {
    return {
      title: "首页"
    };
  },
  methods: {
    // 格式化时间
    format1(time) {
      return format1(time);
    },
    // currentPage 改变时会触发
    currentchange(nowpage) {
      this.$store.commit("article/nowpage", nowpage);
      this.$store.dispatch("article/articlepage", {
        nowpage,
        type: this.$store.state.article.type
      });
    },
    headershow() {
      // 头部高度为70px
      const height = 70;
      const offsetTop =
        window.pageYOffset || document.documentElement.scrollTop;
      this.visible = offsetTop > height;
    },
    hello(x) {
      this.$store.dispatch("article/articlelist", { type: x });
    }
  },
  async fetch({ store, params }) {
    await store.commit("article/nowpage", 1);
    await store.dispatch("article/articlepage", { nowpage: 1 });
  },
  created() {},
  mounted() {
    window.addEventListener("scroll", this.headershow);
  },
  destroyed() {
    window.removeEventListener("scroll", this.headershow);
  },
  computed: {
    // fetch() {
    //   this.$store.dispatch("articlepage", { pagesize: 3, nowpage: 1 });
    // },
    pagelist() {
      return this.$store.state.article.pagelist;
    },
    total() {
      return this.$store.state.article.count;
    },
    pagesize() {
      return this.$store.state.article.pagesize;
    },
    nowpage() {
      return this.$store.state.article.nowpage;
    },
    nowtype() {
      return this.$store.state.article.nowtype;
    }
  },
  watch: {
    nowtype(newval, oldval) {
      console.log("nowtypenowtype");
      this.$store.dispatch("article/articlepage", { nowpage: 1 });
    }
  }
};
</script>

<style scoped>
.v-enter {
  transform: translateX(-10px);
  opacity: 0;
}
.v-enter-active {
  transition: all 0.5s ease;
}
.jgh::after {
  content: "·";
  font-weight: 600;
  padding: 0 5px;
}
.img {
  background-position: 50% 50%;
  background-size: cover;
  height: 100%;
  width: 100%;
  transition: all 0.3s;
}
.article-con {
  display: flex;
  width: 100%;
  background: white;
  margin-bottom: 15px;
  border-radius: 5px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.05);
}
.article-l {
  flex: 0 0 40%;
  margin: 20px;
}
.article-r {
  box-sizing: border-box;
  padding: 30px;
  overflow: hidden;
}
</style>
