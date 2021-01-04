<template>
  <div>
    <div
      class="tag"
      style="
        overflow: hidden;
        background: white;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
        padding: 30px;
      "
    >
      <div
        class="newtag"
        v-for="item in tagList"
        :key="item.id"
        :class="{ currenttag: tagindex == item.id }"
        @click="getTagArticle(item.id)"
      >
        <span>{{ item.name }}</span>
        <span style="margin-left: 10px">{{ item.articles.length }}</span>
      </div>
      <div>
        <article v-for="(item, index) in articleList" :key="index" class="article-con">
          <div class="article-l">
            <nuxt-link
              :to="`/article/${item.article.id}`"
              tag="div"
              v-lazy:background-image="item.article.img"
              class="img"
            />
          </div>
          <div class="article-r">
            <nuxt-link :to="'/article/' + item.article.id" tag="h2" class="overtext">{{
              item.article.title
            }}</nuxt-link>
            <el-divider></el-divider>
            <div>
              <el-tag
                v-for="(item, index) in item.article.tags"
                :key="index"
                class="tag-margin"
                size="mini"
                :disable-transitions="false"
                :color="item.color"
                >{{ item.name }}</el-tag
              >
            </div>
            <div
              style="font-size: 12px; display: flex; align-items: center; margin: 10px 0"
            >
              <img
                style="width: 20px; height: 20px; border-radius: 50%"
                :src="item.article.users[0] && item.article.users[0].avatar"
                alt=""
              />
              <div class="jgh"></div>
              <div class="jgh">{{ format1(item.article.createdAt) }}</div>
              <div class="jgh">{{ item.article.click }}次浏览</div>
              <div class="jgh">{{ item.article.comments.length }}条评论</div>
              <div>{{ item.article.stars.length }}个star</div>
            </div>
            <!-- <p style="font-size:12px">
              <span class>{{item.article.click}}次浏览</span>
              <span class="jgh"></span>
              
              <span>{{item.article.comments.length}}条评论</span>
            </p> -->
          </div>
        </article>
        <div class="page-btn" v-if="count != 0">
          <div>
            <el-button v-show="nowPage != 1" @click="prePage">上一页</el-button>
          </div>
          <div>
            <el-button v-show="maxSize != nowPage" @click="nextPage">下一页</el-button>
          </div>
        </div>
        <div v-else style="text-align: center; padding: 40px 0">该标签下暂无文章~</div>
      </div>
    </div>
  </div>
</template>

<script>
import { format, format1 } from "@/utils/format.js";

export default {
  layout: "blog",
  components: {},
  data() {
    return {
      tagList: null,
      tagindex: 1,
      nowPage: 1,
      maxSize: null,
    };
  },
  head() {
    var title;
    this.tagList.forEach((item) => {
      if (item.id == this.tagindex) {
        title = item.name;
      }
    });
    return {
      title: "标签 - " + title + " - 自然博客",
      meta: [{ hid: "home", name: "description", content: "自然 - 个人博客" }],
    };
  },
  async asyncData({ $axios, params }) {
    const { rows } = await $axios.$get("/api/tag/pageList?nowPage=1&pageSize=100");
    // 分页大小
    const pageSize = 3;
    const rows1 = await $axios.$get(
      `/api/tag/page?id=${params.id}&nowPage=1&pageSize=${pageSize}`
    );

    return {
      // 页数
      pageSize,
      // 所有标签
      tagList: rows,
      // 标签下的文章
      articleList: rows1.rows,
      // 标签下的文章总条数
      count: rows1.count,
      // 最大页码
      maxSize: Math.ceil(rows1.count / pageSize),
    };
  },
  created() {},
  mounted() {
    this.tagindex = this.$route.params.id;
  },
  methods: {
    // 格式化时间
    format1(time) {
      return format1(time);
    },
    prePage() {
      this.nowPage--;
      this.$axios
        .$get("/api/tag/page", {
          params: { id: this.tagindex, nowPage: this.nowPage, pageSize: this.pageSize },
        })
        .then((res) => {
          this.articleList = res.rows;
          this.count = res.count;
          scrollTo({ top: 0 });
        });
    },
    nextPage() {
      this.nowPage++;
      this.$axios
        .$get("/api/tag/page", {
          params: { id: this.tagindex, nowPage: this.nowPage, pageSize: this.pageSize },
        })
        .then((res) => {
          this.articleList = res.rows;
          this.count = res.count;
          scrollTo({ top: 0 });
        });
    },
    getTagArticle(id) {
      this.tagindex = id;
      this.nowPage = 1;
      this.$router.push({ path: `/tag/${id}` });
    },
  },
};
</script>

<style scoped>
@media screen and (max-width: 540px) {
  .main {
    padding: 0;
    margin: 120px auto 0;
  }
  .content {
    padding: 0 10px;
  }
  .img {
    height: 200px !important;
  }
}
.page-btn {
  display: flex;
  justify-content: space-between;
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
.img {
  background-position: 50% 50%;
  background-size: cover;
  height: 100%;
  width: 100%;
  transition: all 0.3s ease 0s;
}
.img:hover {
  transform: scale(1.1);
}
.currenttag {
  border: 1px solid #005cc5 !important;
}
.newtag {
  display: inline-block;
  background-color: white;
  border: 1px solid rgba(93, 121, 148, 0.15);
  border-radius: 3px;
  height: 30px;
  line-height: 30px;
  padding: 0 10px;
  margin: 10px;
  position: relative;
}
.newtag:hover {
  cursor: pointer;
}
.newtag::after {
  content: "";
  position: absolute;
  left: -1px;
  top: 50%;
  width: 8px;
  height: 8px;
  border-width: 0 0 1px 1px;
  border-color: inherit;
  border-style: solid;
  background-color: inherit;
  transform: translateX(-50%) translateY(-50%) rotate(45deg);
}
.jgh::after {
  content: "·";
  font-weight: 600;
  padding: 0 5px;
}
.tag {
  overflow: hidden;
  background: white;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  padding: 30px;
}
.tag /deep/ .el-tag {
  color: white;
}
.tag /deep/ .el-tag:hover {
  cursor: pointer;
}
.tag /deep/ .el-tag .el-icon-close {
  color: white;
}
.tag /deep/ .el-tag .el-icon-close:hover {
  background-color: transparent;
}
.tag-margin {
  display: inline-block;
  margin: 5px 10px;
}
</style>
