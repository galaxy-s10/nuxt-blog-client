<template>
  <div>
    <div v-if="data">
      {{ userInfo }}
      ppp
      {{ isStar }}
      <div v-for="(item, index) in data.rows" :key="index" class="content">
        <div style>
          <h1 style="margin: 20px 0 10px; text-align: center">
            {{ item.title }}
          </h1>
          <p style="text-align: center; font-size: 12px">
            <span class="el-icon-date" style="margin-right: 4px"></span>
            {{ format(item.date) }}
          </p>
          <p style="font-size: 12px; text-align: center; margin-bottom: 20px">
            <span class="el-icon-view"></span>
            {{ item.click }}浏览
          </p>
          <img v-if="item.img != null" :src="item.img" class="img1" />
          <!-- <img  v-lazy="item.img" alt="item.img" width="100%" height="460" /> -->
          <img v-else src="../../assets/imgs/nopic.png" alt />
          <div>
            <!-- <div class="hljs" v-html="newcontent(item.content)"></div> -->
            <markdown :md="item.content"></markdown>
          </div>
          <div style="text-align: left; font-size: 14px" v-if="isStar.result">
            你已经赞过这篇文章了哦~
            <el-tooltip
              class="item"
              effect="dark"
              content="取消点赞"
              placement="top"
            >
              <i class="el-icon-star-on star"></i>
            </el-tooltip>
          </div>
          <div style="text-align: left; font-size: 14px" v-else>
            如果本文章对你有所帮助，欢迎点个赞!
            <el-tooltip
              class="item"
              effect="dark"
              content="赞一个"
              placement="top"
            >
              <i class="el-icon-star-off star"></i>
            </el-tooltip>
          </div>
          <div style="text-align: right; font-size: 14px">
            最后更新于：{{ format(item.updatedAt) }}
          </div>
        </div>
        <div v-if="item.tags.length != 0">
          <span class="el-icon-collection-tag"></span>
          <div class="little-tag" v-for="item in item.tags" :key="item.id">
            {{ item.name }}
          </div>
        </div>
        <div v-if="item.is_comment == 1">
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
              :list="lists"
              :count="count"
              @reshow="commentlist"
              v-loading="isLoading"
            />
          </div>
        </div>
        <div v-else>
          <el-divider>该文章暂未开启评论~~~</el-divider>
        </div>
      </div>
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
      isLoading: false,
      isStar: false,
      comment: "",
      content: null,
      articledata: null,
      lists: [],
      count: "",
    };
  },
  head() {
    return {
      title: this.data.rows[0].title,
    };
  },
  async asyncData({ $axios, params, store }) {
    console.log("object");
    console.log(params.id);
    console.log(store.state.user.id);

    // if(isStar.result){

    // }
    var id = params.id;
    var data = await $axios.$get(`/api/comment?article_id=${id}`);
    await store.dispatch("article/findarticle", { id });
    return { lists: data.rows, count: data.count };
  },
  methods: {
    // 格式化日期时间
    format(time) {
      return format(time);
    },
    // 提交留言
    async addcomment() {
      if (this.content != null && this.content.length >= 3) {
        if (this.$store.state.user.token) {
          var article_id = parseInt(this.$route.params.id);
          var from_userid = parseInt(this.$store.state.user.id);
          var content = this.content;
          var to_commentid = -1;
          var to_userid = -1;
          try {
            await this.$store.dispatch("comment/addComment", {
              id: null,
              article_id,
              from_userid,
              content,
              to_commentid,
              to_userid,
            });
          } catch (err) {
            this.$newmessage("", "error");
            return;
          }
          this.$newmessage("发表成功！", "success");
          this.commentlist(this.$route.params.id);
        } else {
          this.$newmessage("暂未登录，请登录！", "warning");
        }
      } else {
        this.$newmessage("请输入三个字以上留言内容~", "warning");
      }
    },
    // 留言列表
    async commentlist(id) {
      this.isLoading = true;
      var res = await this.$axios.$get(`/api/comment?article_id=${id}`);
      setTimeout(() => {
        this.isLoading = false;
        this.lists = res.lists;
        this.count = res.count;
      }, 300);
    },
    // 文章信息
    // articleinfo(id) {
    //   findarticle(id).then((res) => {
    //     this.data = res.list.rows;
    //   });
    // },
    // 评论
    async getComment() {
      var id = this.$route.params.id;
      var data = await this.$axios.$get(`/api/comment?article_id=${id}`);
      // await this.$store.dispatch("article/findarticle", { id });
      console.log("data");
      console.log(data);
      this.lists = data.rows;
      this.count = data.count;
    },
    // 判断是否点赞
    async zan() {
      let res = await this.$axios.$get(
        `/api/star/articleStar?article_id=${this.$route.params.id}&from_user_id=${this.$store.state.user.id}`
      );
      console.log("000");
      console.log(res);
      this.isStar = res;
    },
  },
  created() {
    console.log("create");
  },
  async mounted() {
    console.log("mounted");
    console.log(this.$store);
    var isStar = await this.$axios.$get(
      `/api/star/articleStar?article_id=${this.$route.params.id}&from_user_id=${this.userInfo.id}`
    );
    // var isStar = await this.$axios.$get(
    //   `/api/star/articleStar?article_id=${this.$route.params.id}&from_user_id=${this.$store.state.user.id}`
    // );
    console.log("isStar");
    console.log(isStar);
    // this.isStar = isStar;
    scrollTo({ top: 0 });
  },
  computed: {
    data() {
      return this.$store.state.article.data;
    },
    userInfo() {
      console.log("userInfo");
      // this.zan();
      this.getComment();
      return this.$store.state.user;
    },
  },
  watch: {
    userInfo(val) {
      console.log(val);
      console.log("监听");
      // this.zan();
    },
  },
};
</script>

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