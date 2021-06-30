<template>
  <div class="waterfall-masonry">
    <div v-if="isFirst">
      <!-- <div> -->
      <!-- <div> -->
      <!-- 骨架屏的样式 loading -->
      <div class="masonry-wrap" ref="masonry-wrap" style="height: 1800px">
        <div class="masonry-item">
          <div
            class="loading-block"
            style="height: 200px; background-color: #ededed"
          ></div>
          <div style="padding: 0 10px 10px">
            <h3 class="loading-block" style="width: 80%"></h3>
            <div>
              <p class="loading-block"></p>
              <div class="flex">
                <div
                  class="loading-block"
                  :style="{
                    'background-color': '#ededed',
                    width: '20px',
                    height: '20px',
                    'border-radius': '50%'
                  }"
                ></div>
                <span class="loading-block" style="width: 20%"> </span>
                <span class="loading-block" style="width: 20%"> </span>
                <span class="loading-block" style="width: 20%"> </span>
                <span class="loading-block" style="width: 20%"> </span>
              </div>
            </div>
          </div>
        </div>
        <div class="masonry-item">
          <div
            class="loading-block"
            style="height: 220px; background-color: #ededed"
          ></div>
          <div style="padding: 0 10px 10px">
            <h3 class="loading-block" style="width: 80%"></h3>
            <div>
              <p class="loading-block"></p>
              <div class="flex">
                <div
                  class="loading-block"
                  :style="{
                    'background-color': '#ededed',
                    width: '20px',
                    height: '20px',
                    'border-radius': '50%'
                  }"
                ></div>
                <span class="loading-block" style="width: 20%"> </span>
                <span class="loading-block" style="width: 20%"> </span>
                <span class="loading-block" style="width: 20%"> </span>
                <span class="loading-block" style="width: 20%"> </span>
              </div>
            </div>
          </div>
        </div>
        <div class="masonry-item">
          <div
            class="loading-block"
            style="height: 260px; background-color: #ededed"
          ></div>
          <div style="padding: 0 10px 10px">
            <h3 class="loading-block" style="width: 80%"></h3>
            <div>
              <p class="loading-block"></p>
              <div class="flex">
                <div
                  class="loading-block"
                  :style="{
                    'background-color': '#ededed',
                    width: '20px',
                    height: '20px',
                    'border-radius': '50%'
                  }"
                ></div>
                <span class="loading-block" style="width: 20%"> </span>
                <span class="loading-block" style="width: 20%"> </span>
                <span class="loading-block" style="width: 20%"> </span>
                <span class="loading-block" style="width: 20%"> </span>
              </div>
            </div>
          </div>
        </div>
        <div class="masonry-item">
          <div
            class="loading-block"
            style="height: 210px; background-color: #ededed"
          ></div>
          <div style="padding: 0 10px 10px">
            <h3 class="loading-block" style="width: 80%"></h3>
            <div>
              <p class="loading-block"></p>
              <div class="flex">
                <div
                  class="loading-block"
                  :style="{
                    'background-color': '#ededed',
                    width: '20px',
                    height: '20px',
                    'border-radius': '50%'
                  }"
                ></div>
                <span class="loading-block" style="width: 20%"> </span>
                <span class="loading-block" style="width: 20%"> </span>
                <span class="loading-block" style="width: 20%"> </span>
                <span class="loading-block" style="width: 20%"> </span>
              </div>
            </div>
          </div>
        </div>
        <div class="masonry-item">
          <div
            class="loading-block"
            style="height: 280px; background-color: #ededed"
          ></div>
          <div style="padding: 0 10px 10px">
            <h3 class="loading-block" style="width: 80%"></h3>
            <div>
              <p class="loading-block"></p>
              <div class="flex">
                <div
                  class="loading-block"
                  :style="{
                    'background-color': '#ededed',
                    width: '20px',
                    height: '20px',
                    'border-radius': '50%'
                  }"
                ></div>
                <span class="loading-block" style="width: 20%"> </span>
                <span class="loading-block" style="width: 20%"> </span>
                <span class="loading-block" style="width: 20%"> </span>
                <span class="loading-block" style="width: 20%"> </span>
              </div>
            </div>
          </div>
        </div>
        <div class="masonry-item">
          <div
            class="loading-block"
            style="height: 220px; background-color: #ededed"
          ></div>
          <div style="padding: 0 10px 10px">
            <h3 class="loading-block" style="width: 80%"></h3>
            <div>
              <p class="loading-block"></p>
              <div class="flex">
                <div
                  class="loading-block"
                  :style="{
                    'background-color': '#ededed',
                    width: '20px',
                    height: '20px',
                    'border-radius': '50%'
                  }"
                ></div>
                <span class="loading-block" style="width: 20%"> </span>
                <span class="loading-block" style="width: 20%"> </span>
                <span class="loading-block" style="width: 20%"> </span>
                <span class="loading-block" style="width: 20%"> </span>
              </div>
            </div>
          </div>
        </div>
        <div class="masonry-item">
          <div
            class="loading-block"
            style="height: 200px; background-color: #ededed"
          ></div>
          <div style="padding: 0 10px 10px">
            <h3 class="loading-block" style="width: 80%"></h3>
            <div>
              <p class="loading-block"></p>
              <div class="flex">
                <div
                  class="loading-block"
                  :style="{
                    'background-color': '#ededed',
                    width: '20px',
                    height: '20px',
                    'border-radius': '50%'
                  }"
                ></div>
                <span class="loading-block" style="width: 20%"> </span>
                <span class="loading-block" style="width: 20%"> </span>
                <span class="loading-block" style="width: 20%"> </span>
                <span class="loading-block" style="width: 20%"> </span>
              </div>
            </div>
          </div>
        </div>
        <div class="masonry-item">
          <div
            class="loading-block"
            style="height: 160px; background-color: #ededed"
          ></div>
          <div style="padding: 0 10px 10px">
            <h3 class="loading-block" style="width: 80%"></h3>
            <div>
              <p class="loading-block"></p>
              <div class="flex">
                <div
                  class="loading-block"
                  :style="{
                    'background-color': '#ededed',
                    width: '20px',
                    height: '20px',
                    'border-radius': '50%'
                  }"
                ></div>
                <span class="loading-block" style="width: 20%"> </span>
                <span class="loading-block" style="width: 20%"> </span>
                <span class="loading-block" style="width: 20%"> </span>
                <span class="loading-block" style="width: 20%"> </span>
              </div>
            </div>
          </div>
        </div>
        <div class="masonry-item">
          <div
            class="loading-block"
            style="height: 200px; background-color: #ededed"
          ></div>
          <div style="padding: 0 10px 10px">
            <h3 class="loading-block" style="width: 80%"></h3>
            <div>
              <p class="loading-block"></p>
              <div class="flex">
                <div
                  class="loading-block"
                  :style="{
                    'background-color': '#ededed',
                    width: '20px',
                    height: '20px',
                    'border-radius': '50%'
                  }"
                ></div>
                <span class="loading-block" style="width: 20%"> </span>
                <span class="loading-block" style="width: 20%"> </span>
                <span class="loading-block" style="width: 20%"> </span>
                <span class="loading-block" style="width: 20%"> </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 瀑布流布局 -->
    <div class="waterfall-wrap" ref="waterfall-wrap">
      <article
        v-for="(item, index) in list"
        :key="index"
        ref="waterfall-item"
        class="waterfall-item"
        style="opacity: 0"
      >
        <div class="wrap">
          <nuxt-link :to="`/article/${item.id}`">
            <img
              class="head-img"
              :src="
                item.img
                  ? imgCdnUrl+ item.img
                  : require('../assets/imgs/nopic.png')
              "
              alt=""
              @load="imgLoad"
              @error="imgLoadError"
            />
          </nuxt-link>
          <div class="detail">
            <h3 class="title">{{ item.title }}</h3>
            <div class="tag">
              <span v-if="item.tags.length == 0">该文章下暂无标签</span>
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
            </div>
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
    <div v-if="end" style="text-align: center">到底了！</div>
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
import { imgCdnUrl } from "@/utils/global.js";
import Cookies from "js-cookie";
import { mapActions, mapMutations } from "vuex";
export default {
  layout: "blog",
  components: {
    page
  },
  data() {
    return {
      imgCdnUrl,
      isFirst: true,
      list: [],
      offsetList: [],
      visible: false,
      masonryParams: {
        column: 3,
        gap: 20
      },
      imgLoadNum: 0,
      imgLoadErrorNum: 0,
      isLoad: false,
      showMasonry: false,
      end: false,
      ajaxGetNum: 10 //记录本次加载了多少条数据
    };
  },
  head() {
    return {
      title: "首页 - 自然博客",
      meta: [{ hid: "home", name: "description", content: "自然 - 个人博客" }]
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
        pageSize: 10
      });
    },
    headershow() {
      // 头部高度为70px
      const height = 70;
      const offsetTop =
        window.pageYOffset || document.documentElement.scrollTop;
      this.visible = offsetTop > height;
      if (
        document.documentElement.offsetHeight -
          (window.innerHeight + offsetTop) <
        300
      ) {
        // console.log("距离底部小于300px");
        if (this.isLoad || this.end) return;
        this.currentChange(this.nowPage + 1);
      }
    },
    waterfall() {
      // 获取数组最小值的下标
      function getMinIndex(arr) {
        return [].indexOf.call(arr, Math.min.apply(null, arr));
      }
      // 获取数组最大值的下标
      function getMaxIndex(arr) {
        return [].indexOf.call(arr, Math.max.apply(null, arr));
      }
      // 列数
      const column = this.masonryParams.column;
      // 间隙
      const gap = this.masonryParams.gap;
      const wrap = this.$refs["waterfall-wrap"];
      const item = this.$refs["waterfall-item"];
      const width1 = window.getComputedStyle(wrap, null)["width"];
      const width2 = width1.slice(0, width1.length - 2) - (column - 1) * gap;
      // 计算减去间隙后，每个item的平均宽度
      const width = width2 / column;
      // 保存当前列的offsetHeight的高度
      // const offsetList = [];
      wrap.style.position = "relative";
      // let startPosition = this.ajaxGetNum;
      for (let i = this.list.length - this.ajaxGetNum; i < item.length; i++) {
        // wrapHeight += item[i].offsetHeight + gap;
        item[i].style.width = "100%";
        item[i].style.display = "block";
        item[i].style.position = "absolute";
        item[i].style.width = width + "px";
        item[i].style.opacity = 1;

        if (i < column) {
          // 将第一行的offsetHeight都保存在数组里
          // offsetList.push(i == 0 ? item[i].offsetHeight + gap : item[i].offsetHeight);
          this.offsetList.push(item[i].offsetHeight);
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
          const minIndex = getMinIndex(this.offsetList);
          let w = minIndex * width;
          let g = minIndex * gap;
          // let g = gap;
          item[i].style.top = this.offsetList[minIndex] + gap + "px";
          item[i].style.left = w + g + "px";
          item[i].style.opacity = 1;
          this.offsetList[minIndex] += item[i].offsetHeight + gap;
        }
      }
      function format(v) {
        return v.slice(0, v.length - 2);
      }
      const maxIndex = getMaxIndex(this.offsetList);
      let max = this.offsetList[maxIndex];
      let wrapHeight = parseInt(this.offsetList[maxIndex]);
      // bug:取最后一个元素距离顶部的高度+它本身的高度，但是最后一个元素不一定是最大的
      // let wrapHeight =
      // parseInt(format(item[item.length - 1].style.top)) +
      // parseInt(item[item.length - 1].offsetHeight);
      wrap.style.height = wrapHeight + "px";
      this.isLoad = false;
      if (this.ajaxGetNum < this.pageSize) {
        this.end = true;
      }
    },
    // 骨架屏
    masonry() {
      // 获取数组最小值的下标
      function getMinIndex(arr) {
        return [].indexOf.call(arr, Math.min.apply(null, arr));
      }
      // 列数
      const column = this.masonryParams.column;
      // 间隙
      const gap = this.masonryParams.gap;
      const wrap = this.$refs["masonry-wrap"];
      const item = wrap.getElementsByClassName("masonry-item");
      const width1 = window.getComputedStyle(wrap, null)["width"];
      const width2 = width1.slice(0, width1.length - 2) - (column - 1) * gap;
      // 计算减去间隙后，每个item的平均宽度
      const width = width2 / column;
      // 保存当前列的offsetHeight的高度
      const offsetList = [];
      wrap.style.position = "relative";
      for (let i = 0; i < item.length; i++) {
        // console.log("瀑布流定位");
        // wrapHeight += item[i].offsetHeight + gap;
        // console.log(wrapHeight);
        item[i].style.width = "100%";
        item[i].style.display = "block";
        item[i].style.position = "absolute";
        item[i].style.width = width + "px";
        item[i].style.opacity = 1;

        if (i < column) {
          // 将第一行的offsetHeight都保存在数组里
          // offsetList.push(i == 0 ? item[i].offsetHeight + gap : item[i].offsetHeight);
          offsetList.push(item[i].offsetHeight);
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
          const minIndex = getMinIndex(offsetList);
          let w = minIndex * width;
          let g = minIndex * gap;
          // let g = gap;
          item[i].style.top = offsetList[minIndex] + gap + "px";
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
      wrap.style.height = wrapHeight + "px";
      this.isLoad = false;
    },
    imgLoad() {
      this.imgLoadNum++;
    },
    imgLoadError(e) {
      console.log("imgLoadError");
      e.target.src = require("../assets/imgs/errorpic.png");
      // e.target.style.height = "200px";
      // this.imgLoadNum++;
      this.imgLoadErrorNum++;
    }
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
      pageSize: 10
    });
    // this.list = this.pageList;
  },
  created() {
    // console.log(this.imgCdnUrl);
  },
  mounted() {
    const d = window.pageXOffset || document.documentElement.offsetWidth;
    if (d <= 414) {
      this.masonryParams.column = 2;
    }
    scrollTo({ top: 0 });
    window.addEventListener("scroll", this.headershow);
  },
  destroyed() {
    this.$store.commit("article/changeNowPage", 1);
    window.removeEventListener("scroll", this.headershow);
  },
  computed: {
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
    }
  },
  watch: {
    "$store.state.article.pageList": {
      immediate: true,
      deep: true,
      handler: function(newValue, oldValue) {
        this.ajaxGetNum = newValue.length;
        if (!newValue.length) {
          this.isLoad = false;
          this.end = true;
          if (this.nowPage == 1) {
            this.isFirst = false;
            this.list = [];
            this.$refs["waterfall-wrap"].style.height = "0px";
          }
          return;
        }
        if (this.nowPage != 1) {
          // if(newValue.length<this.pageSize){
          //   this.end = true
          // }
          this.list = this.list.concat(newValue);
        } else {
          this.list = [];
          this.$nextTick(() => {
            this.offsetList = [];
            this.imgLoadNum = 0;
            if (newValue.length < this.pageSize) {
              this.end = true;
            } else {
              this.end = false;
            }
            this.list = newValue;
          });
        }
      }
    },
    imgLoadNum(newVal) {
      if (this.imgLoadNum == this.list.length) {
        this.isFirst = false;
        this.showMasonry = true;
        this.isLoad = false;
        this.waterfall();
      }
    },
    type_id(newval, oldval) {
      scrollTo({ top: 0 });
      this.end = false;
      this.isFirst = true;
      this.isLoad = true;
      this.list = [];
      this.$nextTick(() => {
        this.$refs["waterfall-wrap"].style.height = "0px";
        this.$refs["masonry-wrap"] && this.masonry();
      });
      this.$store.dispatch("article/getArticleList", {
        ordername: this.$store.state.article.ordername,
        orderby: this.$store.state.article.orderby,
        type_id: this.$store.state.article.type_id,
        nowPage: 1,
        pageSize: 10
      });
    }
  }
};
</script>

<style scoped>
@keyframes loading {
  to {
    background-position-x: -50%;
  }
}
.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.masonry-wrap {
  box-sizing: border-box;
  /* background-color: #fff; */
  border-radius: 0.3rem;
}

/* .waterfall-item {
  box-sizing: border-box;
  background-color: #fff;
  box-shadow: 0px 4px 6px rgb(0, 0, 0, 0.12);
  border-radius: 0.3rem;
} */
.masonry-item {
  box-sizing: border-box;
  background-color: #fff;
  box-shadow: rgb(0 0 0 / 10%) 0px 0px 5px;
  border-radius: 0.3rem;
  margin-bottom: 10px;
  /* transition: all 0.1s ease; */
}
.waterfall-item {
  box-sizing: border-box;
  background-color: #fff;
  box-shadow: rgb(0 0 0 / 10%) 0px 0px 5px;
  border-radius: 0.3rem;
  transition: all 0.5s ease;
}

.waterfall-item:nth-child(2n) {
  top: 100%;
  left: 100%;
}
.waterfall-item:nth-child(2n-1) {
  top: 100%;
  right: 100%;
}
.masonry-item:nth-child(2n) {
  top: 100%;
  left: 100%;
}

.masonry-item:nth-child(2n-1) {
  top: 100%;
  left: 0%;
}

.loading-block {
  width: 100%;
  height: 1rem;
  border-radius: 0.3rem;
  background: linear-gradient(
      100deg,
      rgba(255, 255, 255, 0) 40%,
      rgba(255, 255, 255, 0.5) 50%,
      rgba(255, 255, 255, 0) 60%
    )
    #ededed;
  background-size: 200%;
  background-position-x: 150%;
  animation: 1s loading ease-in-out infinite;
}

.tag-margin {
  margin-right: 10px;
}
.wrap {
  border-radius: 6px;
  box-shadow: rgb(0 0 0 / 10%) 0px 0px 5px;
  background-color: #fff;
  overflow: hidden;
}
.wrap .head-img {
  width: 100%;
  transition: all 0.3s ease 0s;
  /* min-height: 200px; */
}
.wrap .head-img:hover {
  /* min-height: 200px; */
  transform: scale(1.1);
}
.wrap .detail {
  padding: 5px 10px;
}
.wrap .detail .title {
  margin: 10px 0;
}
.wrap .detail .tag {
  margin: 8px 0;
}
.wrap .detail .info {
  display: flex;
  font-size: 12px;
  justify-content: space-between;
  width: 90%;
  align-items: center;
  padding: 5px 0;
}

.waterfall-masonry /deep/ .el-loading-mask {
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
  box-shadow: rgb(0 0 0 / 10%) 0px 0px 5px;
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
