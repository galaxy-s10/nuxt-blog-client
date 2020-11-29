<template>
  <div>
    <article v-for="(item, index) in pagelist" :key="index" class="article-con">
      <div class="article-l">
        <nuxt-link
          :to="`/article/${item.id}`"
          tag="div"
          v-lazy:background-image="item.img"
          class="img"
        />
      </div>
      <div class="article-r">
        <nuxt-link :to="'/article/' + item.id" tag="h2" class="overtext">{{
          item.title
        }}</nuxt-link>
        <el-divider></el-divider>
        <p v-if="item.tags.length == 0">暂时无可提供的摘要</p>
        <div v-else class="tag">
          <el-tag
            v-for="item in item.tags"
            :key="item.id"
            class="tag-margin"
            size="mini"
            :disable-transitions="false"
            :color="item.color"
            @close="closeTag(item.id)"
            >{{ item.name }}</el-tag
          >
        </div>
        <p style="font-size: 12px">
          <span class="jgh">{{ format1(item.date) }}</span>
          <span class="jgh">{{ item.click }}次浏览</span>
          <span class="jgh">{{ item.comments.length }}条评论</span>
          <span>{{ item.stars.length }}个star</span>
        </p>
      </div>
    </article>
    <div style="text-align: center; padding: 30px 0">
      <page
        :total="total"
        :pagesize="pagesize"
        @currentchange="currentchange"
      />
    </div>
  </div>
</template>

<script>
import page from "../components/page";
import { format, format1 } from "@/utils/format.js";
import Cookies from "js-cookie";
import { mapActions, mapMutations } from "vuex";
export default {
  layout: "blog",
  components: {
    page,
  },
  data() {
    return {
      visible: false,
    };
  },
  head() {
    return {
      title: "首页",
    };
  },
  methods: {
    ...mapActions({
      userLogin: "user/login",
      getUserInfo: "user/getUserInfo",
    }),
    ...mapMutations({
      setToken: "user/setToken",
      logout: "user/logout",
    }),
    // 格式化时间
    format1(time) {
      return format1(time);
    },
    // currentPage 改变时会触发
    currentchange(nowpage) {
      this.$store.commit("article/nowpage", nowpage);
      this.$store.dispatch("article/articlepage", {
        nowpage,
        type: this.$store.state.article.type,
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
    },
  },
  async fetch({ store, params }) {
    await store.commit("article/nowpage", 1);
    await store.dispatch("article/articlepage", { nowpage: 1 });
  },
  created() {},
  mounted() {
    scrollTo({ top: 0 });
    window.addEventListener("scroll", this.headershow);
  },
  destroyed() {
    window.removeEventListener("scroll", this.headershow);
  },
  computed: {
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
    },
  },
  watch: {
    nowtype(newval, oldval) {
      this.$store.dispatch("article/articlepage", { nowpage: 1 });
    },
  },
};
</script>

<style scoped>
.tag /deep/ .el-tag {
  color: white;
}
/* 响应式布局 - 小于 540px */
@media screen and (max-width: 540px) {
  .img {
    min-height: 150px;
  }
}
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
