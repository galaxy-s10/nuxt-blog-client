<template>
  <div :class="{ header1: 1, show: visible }">
    <ul class="list">
      <li @click="all()">全部</li>
      <li v-for="(item, index) in articleTypeList" :key="index" @click="type(item.id)">
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    headershow() {
      // 头部高度为70px
      const height = 70;
      const offsetTop = window.pageYOffset || document.documentElement.scrollTop;
      // console.log(offsetTop);
      this.visible = offsetTop > height;
    },
    async type(type_id) {
      if (this.$route.path != "/") {
        this.$router.push("/");
      }
      // if (this.$store.state.article.type_id != type_id) {
      this.$store.commit("article/changeNowPage", 1);
      this.$store.commit("article/changeType_id", type_id);
      // await this.$store.dispatch("article/getArticleList", {
      //   type_id: this.$store.state.article.type_id,
      //   nowPage: 1,
      //   pageSize: 5,
      // });
      // }
    },
    async all() {
      if (this.$store.state.article.type_id) {
        this.$store.commit("article/changeNowPage", 1);
        this.$store.commit("article/changeType_id", "");
      }
      if (this.$route.path != "/") {
        this.$router.push("/");
      }
    },
  },
  created() {},
  mounted() {
    window.addEventListener("scroll", this.headershow);
  },
  destroyed() {
    window.removeEventListener("scroll", this.headershow);
  },
  computed: {
    articleTypeList() {
      return this.$store.state.article.ArticleTypeList;
    },
  },
};
</script>

<style scoped>
.header1 {
  position: fixed;
  top: 70px;
  left: 0;
  width: 100%;
  background-color: white;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  z-index: 99;
}
.show {
  transition: all 0.5s;
  transform: translateY(-50px);
}
ul li {
  display: inline-block;
  height: 50px;
  line-height: 50px;
  margin: 0 10px;
  cursor: pointer;
}
.list {
  margin: 0 auto;
  color: #53a8ff;
}
/* 响应式布局 - 小于 540px */
@media screen and (max-width: 540px) {
  .header1 {
    top: 50px;
  }
  .list {
    padding: 0 20px;
  }
}
/* 响应式布局 - 大于540px */
@media screen and (min-width: 540px) {
  .list {
    width: 100%;
    padding: 0 20px;
  }
  .show {
    transform: translateY(-70px);
  }
}

/* 响应式布局 - 大于 992px */
@media screen and (min-width: 992px) {
  .list {
    width: 960px;
  }
}

/* 响应式布局 - 大于 1200px */
@media screen and (min-width: 1200px) {
  .list {
    width: 1140px;
  }
}
</style>
