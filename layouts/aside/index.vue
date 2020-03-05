<template>
  <!-- 右侧-->
  <aside class="navb">
    <div class="user">
      <div class="bgc"></div>
      <div style="position: relative;">
        <img :src="avatar" class="img" alt />
        <span class="username">{{name}}</span>
        <p class="usertitle">{{title}}</p>
      </div>
    </div>
    <div class="hotart">
      <div style="padding:10px 0 10px 10px;">
        <span class="el-icon-trophy" style="font-size:18px;font-weight:blod;margin-right:4px"></span>
        <h1 style="display:inline-block;font-size:18px;margin:5px 0">热门文章</h1>
      </div>
      <div style="padding-left:10px;overflow:hidden">
        <div v-for="(item,index) in hotlist" :key="index" style="margin-bottom:10px;display:flex">
          <div class="aside-l">
            <nuxt-link :to="'/article/'+item.id" tag="img" v-lazy="item.img" class="img1" />
            <!-- <nuxt-link
              v-else
              :to="'/article/'+item.id"
              tag="div"
              :style="{backgroundImage:nopic}"
              class="img1"
            />-->
          </div>

          <div class="aside-r">
            <nuxt-link :to="'/article/'+item.id" tag="h4" class="tcss">#{{item.title}}</nuxt-link>
            <div style="margin: 2px 0">
              <span class="el-icon-date tcss1" style="padding:0 2px;">{{format1(item.date)}}</span>
              <span class="el-icon-view tcss1" style="padding:0 2px;">{{item.click}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script>
import { articlelist, articlepage } from "@/api/article";
import { format1 } from "@/utils/format.js";
export default {
  data() {
    return {
      // nopic: "url(" + require("../../assets/imgs/无图.png") + ")"
    };
  },
  methods: {
    format1(time) {
      return format1(time);
    }
  },
  created() {
    // this.getarticle();
    this.$store.dispatch("article/articlehotlist", {
      ordername: "click",
      orderby: "desc",
      nowpage: 1
    });
  },
  computed: {
    avatar() {
      if (this.$store.state.user.token) {
        return this.$store.state.user.avatar;
      }
      return "http://img.cdn.zhengbeining.com/比德尔.jpg";
    },
    name() {
      if (this.$store.state.user.token) {
        return this.$store.state.user.name;
      }
      return "VueBlog";
    },
    title() {
      if (this.$store.state.user.token) {
        return this.$store.state.user.title;
      }
      return "记录曾经所踩过的坑~";
    },
    hotlist() {
      return this.$store.state.article.hotlist;
    }
  }
};
</script>

<style scoped>
.tcss {
  cursor: pointer;
  padding: 0;
  margin: 0;
  transition: all 0.3s ease-in-out;
}
.tcss1 {
  font-size: 10px;
}
.tcss:hover {
  margin-left: 5px;
  color: #53a8ff;
}
.bgc {
  background: url("http://img.cdn.zhengbeining.com/321.png") no-repeat 50%;
  height: 120px;
  background-size: cover;
}
.img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  position: absolute;
  top: -40px;
  left: 25px;
  transition: all 0.5s;
}
.img:hover {
  transform: rotate(360deg);
  transition: all 0.5s;
}
.aside-l img {
  width: 100%;
  height: 100%;
  border-radius: 5px;
  cursor: pointer;
  /* background-size: cover; */
}
.username {
  margin: 0;
  padding: 0;
  padding-left: 120px;
  font-size: 18px;
  font-weight: 800;
}
.usertitle {
  margin: 0;
  padding: 30px;
  font-size: 18px;
}
.aside-l {
  /* width: 40%; */
  flex: 0 0 30%;
}
.aside-r {
  box-sizing: border-box;
  /* width: 60%; */
  overflow: hidden;
  /* height: 100px; */
  /* padding: 2px; */
  margin-left: 10px;
  font-size: 14px;
}
</style>