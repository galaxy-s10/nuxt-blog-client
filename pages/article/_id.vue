<template>
  <div>
    <div v-if="detail">
      <div class="content">
        <h1 style="margin: 20px 0 10px; text-align: center">
          {{ detail.title }}
        </h1>
        <div class="desc-warp">
          <div class="desc-warp1">
            <span>
              <i class="el-icon-folder-opened"></i>
              {{ detail.types[0].name }}
            </span>
            <span><i class="el-icon-chat-dot-round"></i>{{ allCount }}</span>
            <span>
              <span class="el-icon-view"></span>
              {{ detail.click }}浏览
            </span>
          </div>
          <div class="desc-warp2">
            <div style="display: flex; align-items: center">
              <div style="display: flex; align-items: center">
                <img
                  :src="detail.users[0].avatar"
                  alt=""
                  style="width: 20px; height: 20px; border-radius: 50%; margin-right: 5px"
                />
                <span>{{ detail.users[0].username }}</span>
              </div>
            </div>
            <div>
              <i class="el-icon-date" style="margin-right: 4px"></i>
              {{ format(detail.createdAt) }}
            </div>
          </div>
        </div>

        <img v-if="detail.img != null" :src="detail.img" class="img1" />
        <!-- <img  v-lazy="item.img" alt="item.img" width="100%" height="460" /> -->
        <img v-else src="../../assets/imgs/nopic.png" class="img1" alt />
        <div>
          <!-- <div class="hljs" v-html="newcontent(item.content)"></div> -->
          <markdown :md="detail.content"></markdown>
        </div>
        <div v-loading="loadingStar">
          <!-- <div style="text-align: left; font-size: 14px" v-if="isStar"> -->
          <div style="text-align: left; font-size: 14px" v-if="detail.isStar">
            你已经赞过这篇文章了哦~
            <el-tooltip
              class="item"
              effect="dark"
              content="取消点赞"
              placement="top"
              @click.native="starForArticle(0, detail.id)"
            >
              <i class="el-icon-star-on star"></i>
            </el-tooltip>
            {{ detail.stars.length }}
          </div>
          <div style="text-align: left; font-size: 14px" v-else>
            如果本文章对你有所帮助，欢迎点个赞!
            <el-tooltip
              class="item"
              effect="dark"
              content="赞一个"
              placement="top"
              @click.native="starForArticle(1, detail.id)"
            >
              <i class="el-icon-star-off star"></i>
            </el-tooltip>
            {{ detail.stars.length }}
          </div>
        </div>

        <div style="text-align: right; font-size: 14px">
          最后更新于：{{ format(detail.updatedAt) }}
        </div>
      </div>
      <div v-if="detail.tags.length != 0">
        <span class="el-icon-collection-tag"></span>
        <div class="little-tag" v-for="item in detail.tags" :key="item.id">
          {{ item.name }}
        </div>
      </div>
      <div v-if="detail.is_comment">
        <el-divider>评论一下吧!</el-divider>
        <div>
          <el-input
            type="textarea"
            resize="none"
            :rows="5"
            show-word-limit
            maxlength="200"
            v-model="content"
          ></el-input>
          <p style="text-align: right">
            <el-button type="primary" @click="addcomment()">提交</el-button>
          </p>
          <comment
            :list="commentList"
            :allCount="allCount"
            :pageParams="pageParams"
            @reshow="getComment"
            @handleParentPage="parentPage"
            @handleChildrenPage="childrenPage"
            v-loading="isLoading"
          />
        </div>
      </div>
      <div v-else>
        <el-divider>该文章暂未开启评论~~~</el-divider>
      </div>
      <!-- </div> -->
    </div>
  </div>
</template>

<script>
import comment from "../../components/comment";
import markdown from "../../components/markdown";
import { format, format1 } from "@/utils/format.js";
export default {
  layout: "blog",
  components: {
    comment,
    markdown,
  },
  data() {
    return {
      loadingStar: false,
      isLoading: false,
      isStar: false,
      // comment: "",
      content: null,
      articledata: null,
      commentList: [],
      count: "",
      query: {},
    };
  },
  head() {
    return {
      title: this.detail && this.detail.title + " - 自然博客",
      meta: [{ hid: "home", name: "description", content: "自然 - 个人博客" }],
    };
  },
  async asyncData({ $axios, params, store }) {
    var id = params.id;
    let query = {
      article_id: params.id,
      nowPage: 1, //当前父评论页数
      pageSize: 3, //当前父评论分页大小
      childrenNowPage: 1, //当前子评论页数
      childrenPageSize: 2, //当前子评论分页大小
    };
    // this.query = query;
    try {
      var data = await $axios.$get(`/api/comment`, { params: { ...query } });
      await store.dispatch("article/getArticleDetail", { id });
      return {
        query,
        commentList: data.rows,
        allCount: data.allCount,
        pageParams: {
          ...query,
          count: data.count, //父评论层数
          nowPage: data.nowPage,
          lastPage: data.lastPage,
          pageSize: data.pageSize,
        },
      };
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    // 文章详情
    async getArticleDetail() {
      await this.$store.dispatch("article/getArticleDetail", {
        id: this.$route.params.id,
      });
    },

    // 给文章点赞/取消点赞
    async starForArticle(type, article_id) {
      if (this.$store.state.user.token) {
        this.loadingStar = true;
        if (type == 1) {
          let res = await this.$axios.$post(`/api/star/starForArticle`, {
            article_id,
            from_user_id: this.$store.state.user.id,
          });
          this.$message.success({
            message: res.message,
          });
          setTimeout(() => {
            this.loadingStar = false;
            this.getArticleDetail();
          }, 500);
        } else {
          let res = await this.$axios.$delete(`/api/star/delStarForArticle`, {
            data: { article_id, from_user_id: this.$store.state.user.id },
          });
          this.$message.success({
            message: res.message,
          });
          setTimeout(() => {
            this.loadingStar = false;
            this.getArticleDetail();
          }, 500);
        }
      } else {
        this.$newmessage("暂未登录，请登录！", "warning");
      }
    },

    // 获取子评论分页
    async childrenPage(childVal) {
      // async childrenPage(childrenCommentId) {
      query.childrenNowPage += 1;
      let temp = {
        ...this.pageParams,
        ...query,
      };
      this.pageParams = temp;
      // query.childrenCommentId = childrenCommentId;
      var data = await this.$axios.$get(`/api/comment/childrenPage`, {
        params: { ...this.pageParams },
      });
      this.commentList.forEach((item) => {
        if (item.id == data.to_comment_id) {
          item.childrenNowPage = data.childrenNowPage;
          item.childrenLastPage = data.childrenLastPage;
          item.calcSurplus = data.count - data.childrenNowPage * data.childrenPageSize;
          item.huifu.push(...data.rows);
        }
      });
    },

    // 获取父评论分页
    async parentPage(v) {
      let query = { ...this.query, ...v };
      query.nowPage += 1;
      var data = await this.$axios.$get(`/api/comment`, {
        params: { ...query },
      });
      this.commentList.push(...data.rows);
      this.allCount = data.allCount;
      this.pageParams = {
        ...this.query,
        count: data.count,
        nowPage: data.nowPage,
        lastPage: data.lastPage,
        pageSize: data.pageSize,
      };
    },
    // 格式化日期时间
    format(time) {
      return format(time);
    },
    // 提交留言
    async addcomment() {
      if (this.content != null && this.content.length >= 3) {
        if (this.$store.state.user.token) {
          var article_id = parseInt(this.$route.params.id);
          var from_user_id = parseInt(this.$store.state.user.id);
          var content = this.content;
          var to_comment_id = -1;
          var to_user_id = -1;
          try {
            await this.$store.dispatch("comment/addComment", {
              id: null,
              article_id,
              from_user_id,
              content,
              to_comment_id,
              to_user_id,
            });
          } catch (err) {
            this.$newmessage("", "error");
            return;
          }
          this.$newmessage("发表成功！", "success");
          this.getComment();
        } else {
          this.$newmessage("暂未登录，请登录！", "warning");
        }
      } else {
        this.$newmessage("请输入三个字以上留言内容~", "warning");
      }
    },
    // 留言列表
    async getComment() {
      var id = this.$route.params.id;
      let query = {
        article_id: id,
        nowPage: 1,
        pageSize: 3,
        childrenNowPage: 1,
        childrenPageSize: 2,
      };

      try {
        this.isLoading = true;
        var data = await this.$axios.$get(`/api/comment`, {
          params: { ...query },
        });
        setTimeout(() => {
          this.isLoading = false;
          this.pageParams = {
            ...query,
            count: data.count, //父评论层数
            nowPage: data.nowPage,
            lastPage: data.lastPage,
            pageSize: data.pageSize,
          };
          this.commentList = data.rows;
          this.allCount = data.allCount;
        }, 300);
      } catch (err) {
        console.log(err);
        this.isLoading = false;
      }
    },
    async zan() {
      let res = await this.$axios.$get(
        `/api/star/articleStar?article_id=${this.$route.params.id}&from_user_id=${this.$store.state.user.id}`
      );
      if (res.result) {
        this.isStar = true;
      } else {
        this.isStar = false;
      }
    },
  },
  created() {},
  mounted() {
    // var isStar = await this.$axios.$get(
    //   `/api/star/articleStar?article_id=${this.$route.params.id}&from_user_id=${this.userInfo.id}`
    // );
    // this.isStar = isStar;
    scrollTo({ top: 0 });
  },
  computed: {
    detail() {
      return this.$store.state.article.detail;
    },
    // 如果直接使用userInfo(){}这种方式设置计算属性，get和set都会触发！
    // userInfo: {
    //   get: function () {
    //     console.log("getterr");
    //     return this.$store.state.user.id;
    //   },
    //   set: function () {
    //     console.log("setterr");
    //   },
    // },
    userInfo() {
      return this.$store.state.user.id;
    },
  },
  watch: {
    userInfo(val) {
      // this.zan();
      this.getComment();
      this.getArticleDetail();
    },
  },
};
</script>

<style scoped>
.desc-warp {
  padding-bottom: 10px;
}
.desc-warp1 {
  width: 180px;
  margin: 0 auto;
  justify-content: space-around;
  display: flex;
  align-items: center;
  font-size: 12px;
}
.desc-warp2 {
  width: 220px;
  margin: 0 auto;
  height: 30px;
  justify-content: space-around;
  display: flex;
  align-items: center;
  font-size: 12px;
}
</style>

<style>
.star {
  cursor: pointer;
}
.little-tag {
  display: inline-block;
  text-align: center;
  background-color: #aaaaaa;
  color: white;
  padding: 0 5px;
  border-radius: 3px;
  margin-right: 5px;
}
.img1 {
  width: 100%;
  height: 460px;
}
@media screen and (max-width: 540px) {
  .main {
    padding: 0;
    margin: 120px auto 0;
  }
  .content {
    padding: 0 10px;
  }
  .img1 {
    height: 200px;
  }
}
</style>
