<template>
  <div class="masonry">
    <div class="masonry-wrap" ref="masonry-wrap">
      <article
        v-for="(item, index) in list"
        :key="index"
        ref="masonry-item"
        class="masonry-item"
        style="opacity: 0"
      >
        <div class="wrap">
          <img
            class="head-img"
            :src="item.img ? item.img : require('../assets/imgs/nopic.png')"
            alt=""
            @load="imgLoad"
          />
          <div class="detail">
            <div class="title">{{ item.title }}</div>
            <div class="info">
              <img
                style="width: 20px; height: 20px; border-radius: 50%"
                :src="item.users[0] && item.users[0].avatar"
                alt=""
              />
              <div>
                <i class="el-icon-date"></i>
                {{ format1(item.createdAt) }}
              </div>
              <div>
                <i class="el-icon-view"></i>
                {{ item.click }}
              </div>
              <div>
                <i class="el-icon-chat-round"></i>
                {{ item.comments.length }}
              </div>
              <div>
                <i class="el-icon-star-off"></i>
                {{ item.stars.length }}
              </div>
            </div>
          </div>
        </div>
        <!-- <article v-for="(item, index) in pageList" :key="index" class="article-con"> -->
        <!-- <img
          :src="item.img ? item.img : require('../assets/imgs/nopic.png')"
          style="max-width: 100%"
          alt=""
        /> -->
        <!-- <nuxt-link
          :to="`/article/${item.id}`"
          tag="div"
          v-lazy:background-image="item.img"
          class="img"
        /> -->
        <!-- <div class="article-l">
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
        <p v-if="item.tags.length == 0">该文章下暂无标签</p>
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
        <div style="font-size: 12px; display: flex; align-items: center; margin: 10px 0">
          <img
            style="width: 20px; height: 20px; border-radius: 50%"
            :src="item.users[0] && item.users[0].avatar"
            alt=""
          />
          <div class="jgh"></div>
          <div class="jgh">{{ format1(item.createdAt) }}</div>
          <div class="jgh">{{ item.click }}次浏览</div>
          <div class="jgh">{{ item.comments.length }}条评论</div>
          <div>{{ item.stars.length }}个star</div>
        </div>
      </div> -->
      </article>
    </div>

    <div v-if="isLoad" v-loading="true" style="height: 50px"></div>
    <!-- <div style="text-align: center; padding: 30px 0">
      <page
        :count="count"
        :nowPage="nowPage"
        :pageSize="pageSize"
        @currentChange="currentChange"
      />
    </div> -->
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
      list: [],
      visible: false,
      masonryParams: {
        column: 3,
        gap: 20,
      },
      imgLoadNum: 0,
      isLoad: false,
      showMasonry: false,
    };
  },
  head() {
    return {
      title: "首页 - 自然博客",
      meta: [{ hid: "home", name: "description", content: "自然 - 个人博客" }],
    };
  },
  methods: {
    // ...mapActions({
    //   userLogin: "user/login",
    //   getUserInfo: "user/getUserInfo",
    // }),
    // ...mapMutations({
    //   setToken: "user/setToken",
    //   logout: "user/logout",
    // }),
    // 格式化时间
    format1(time) {
      return format1(time);
    },
    // currentPage 改变时会触发
    async currentChange(nowPage) {
      this.$store.commit("article/changeNowPage", nowPage);
      this.isLoad = true;
      await this.$store.dispatch("article/getArticleList", {
        ordername: this.$store.state.article.ordername,
        orderby: this.$store.state.article.orderby,
        type_id: this.$store.state.article.type_id,
        nowPage,
        pageSize: 10,
      });
      // console.log(this.pageList);
      this.isLoad = false;
      // if (this.list.length == 0) {
      //   this.list = this.pageList;
      // } else {
      //   this.list = this.list.concat(this.pageList);
      // }
    },
    headershow() {
      // 头部高度为70px
      const height = 70;
      const offsetTop = window.pageYOffset || document.documentElement.scrollTop;
      this.visible = offsetTop > height;
      // console.log(offsetTop);
      // console.log(window.innerHeight);
      // console.log(window.innerHeight + offsetTop);
      // console.log(document.documentElement.offsetHeight)
      if (
        document.documentElement.offsetHeight - (window.innerHeight + offsetTop) <
        300
      ) {
        console.log("距离底部小于300px");
        if (this.isLoad) return;
        this.currentChange(this.nowPage + 1);
      }
    },
    masonry() {
      // 获取数组最小值的下标
      function getMinIndex(arr) {
        return [].indexOf.call(arr, Math.min.apply(null, arr));
      }
      // 列数
      const column = this.masonryParams.column;
      // 间隙
      const gap = this.masonryParams.gap;
      // const wrap = document.getElementsByClassName("masonry-wrap")
      // const item = wrap[0].getElementsByClassName("masonry-item")
      const wrap = this.$refs["masonry-wrap"];
      const item = this.$refs["masonry-item"];
      const width1 = window.getComputedStyle(wrap, null)["width"];
      const width2 = width1.slice(0, width1.length - 2) - (column - 1) * gap;
      // 计算减去间隙后，每个item的平均宽度
      const width = width2 / column;
      // 保存当前列的offsetHeight的高度
      const offsetList = [];
      wrap.style.position = "relative";
      console.log(wrap, item);
      console.log(this.$refs);
      for (let i = 0; i < item.length; i++) {
        wrapHeight += item[i].offsetHeight + gap;
        // console.log(wrapHeight);
        item[i].style.width = "100%";
        item[i].style.display = "block";
        item[i].style.position = "absolute";
        item[i].style.width = width + "px";
        item[i].style.opacity = 0;

        if (i < column) {
          // 将第一行的offsetHeight都保存在数组里
          console.log(item[i]);
          console.log(item[i].offsetHeight);
          offsetList.push(i == 0 ? item[i].offsetHeight + gap : item[i].offsetHeight);
          item[i].style.top = "0";
          if ((i + 1) % column == 1) {
            item[i].style.left = 0;
            item[i].style.opacity = 1;
          } else {
            let w = i * width;
            let g = i * gap;
            item[i].style.left = `calc(${w}px + ${g}px)`;
            item[i].style.opacity = 1;
          }
        } else {
          // 当前数组的最低offsetHeight索引
          const minIndex = getMinIndex(offsetList);
          let w = minIndex * width;
          let g = minIndex * gap;
          item[i].style.top = offsetList[minIndex] + g + "px";
          item[i].style.left = w + g + "px";
          item[i].style.opacity = 1;
          offsetList[minIndex] += item[i].offsetHeight + gap;
        }
      }
      function format(v) {
        return v.slice(0, v.length - 2);
      }
      let wrapHeight =
        parseInt(format(item[item.length - 1].style.top)) +
        parseInt(item[item.length - 1].offsetHeight);
      console.log(wrapHeight, 999999999);
      wrap.style.height = wrapHeight + "px";
    },
    imgLoad() {
      this.imgLoadNum++;
      console.log("imgLoad");
    },
    // hello(x) {
    //   this.$store.dispatch("article/articlelist", { type: x });
    // },
  },
  async fetch({ store, params }) {
    await store.dispatch("article/getArticleList", {
      ordername: "createdAt",
      orderby: "desc",
      type_id: store.state.article.type_id,
      nowPage: 1,
      pageSize: 10,
    });
    console.log(this.pageList);
    // this.list = this.pageList;
  },
  created() {},
  mounted() {
    // setTimeout(() => {
    // this.masonry();
    // }, 1000);
    this.list = this.$store.state.article.pageList
    // console.log(this.list)
    // console.log(this.$store.state.article.pageList)
    scrollTo({ top: 0 });
    window.addEventListener("scroll", this.headershow);
  },
  destroyed() {
    window.removeEventListener("scroll", this.headershow);
  },
  computed: {
    // pageList() {
    //   console.log(this.list);
    //   // if (this.list) {
    //   this.list = this.list.concat(this.$store.state.article.pageList);
    //   // } else {
    //   //   this.list = this.$store.state.article.pageList;
    //   // }

    //   return this.$store.state.article.pageList;
    // },
    count() {
      return this.$store.state.article.count;
    },
    pageSize() {
      return this.$store.state.article.pageSize;
    },
    nowPage() {
      return this.$store.state.article.nowPage;
    },
    type_id() {
      return this.$store.state.article.type_id;
    },
  },
  watch: {
    // pageList() {
    //   console.log(this.pageList);
    //   this.list = this.pageList;
    // },
    "$store.state.article.pageList": {
      deep: true,
      handler: function (newValue, oldValue) {
        console.log('xxx')
        console.log(newValue)
        // console.log(this.list)
        this.list = this.list.concat(newValue)
      },
    },
    imgLoadNum(newVal) {
      console.log(this.imgLoadNum);
      if (this.imgLoadNum == this.list.length) {
        this.showMasonry = true;
        this.isLoad = false;
        this.masonry();
      }
    },
    type_id(newval, oldval) {
      this.$store.dispatch("article/getArticleList", {
        ordername: this.$store.state.article.ordername,
        orderby: this.$store.state.article.orderby,
        type_id: this.$store.state.article.type_id,
        nowPage: 1,
        pageSize: 10,
      });
    },
  },
};
</script>

<style scoped>
.wrap {
  border-radius: 6px;
  box-shadow: 0 2px 9px 0 rgba(0, 0, 0, 0.08);
  background-color: #fff;
  overflow: hidden;
}
.wrap .head-img {
  width: 100%;
}
.wrap .detail {
  padding: 5px 10px;
}
.wrap .detail .title {
  margin: 10px 0;
}
.wrap .detail .info {
  display: flex;
  font-size: 12px;
  justify-content: space-between;
  align-items: center;
  padding: 5px 50px 5px 0;
}

.masonry /deep/ .el-loading-mask {
  background-color: rgba(255, 255, 255, 0);
}
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
  transition: all 0.5s ease 0s;
}
.img:hover {
  transform: scale(1.1);
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
  overflow: hidden;
}
.article-r {
  box-sizing: border-box;
  padding: 30px;
  overflow: hidden;
}
</style>
