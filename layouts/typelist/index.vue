<template>
  <div :class="{header1:1,show:visible}">
    <ul class="list">
      <li @click="all()">全部</li>
      <li v-for="(item,index) in typelist" :key="index" @click="type(item.type)">{{item.type}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false
    };
  },
  methods: {
    headershow() {
      // 头部高度为70px
      const height = 70;
      const offsetTop =
        window.pageYOffset || document.documentElement.scrollTop;
      // console.log(offsetTop);
      this.visible = offsetTop > height;
    },
    type(type) {
      if (this.$store.state.article.nowtype != type) {
        this.$store.commit("article/nowpage", 1);
        this.$store.commit("article/nowtype", type);
      }
      if (this.$route.path != "/") {
        this.$router.push("/");
      }
    },
    all() {
      if (this.$store.state.article.nowtype != null) {
        this.$store.commit("article/nowpage", 1);
        this.$store.commit("article/nowtype", null);
        this.$store.dispatch("article/articlepage", { nowpage: 1 });
      }
      if (this.$route.path != "/") {
        this.$router.push("/");
      }
    }
  },
  created() {
    this.$store.dispatch("article/articletypelist");
  },
  mounted() {
    window.addEventListener("scroll", this.headershow);
  },
  destroyed() {
    window.removeEventListener("scroll", this.headershow);
  },
  computed: {
    typelist() {
      return this.$store.state.article.typelist;
    }
  }
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