<template>
  <div>
    <div v-if="data">
      <div v-for="(item,index) in data.rows" :key="index" class="content">
        <div style>
          <h1 style="margin:20px 0 10px;text-align:center">{{item.title}}</h1>
          <p style="text-align:center;font-size:12px">
            <span class="el-icon-date" style="margin-right:4px"></span>
            {{format(item.date)}}
          </p>
          <p style="font-size:12px;text-align:center;margin-bottom:20px;">
            <span class="el-icon-view"></span>
            {{item.click}}浏览
          </p>
          <img v-if="item.img!=null" :src="item.img" class="img1" />
          <!-- <img  v-lazy="item.img" alt="item.img" width="100%" height="460" /> -->
          <img v-else src="../../assets/imgs/无图.png" alt />
          <div>
            <!-- <div class="hljs" v-html="newcontent(item.content)"></div> -->
            <markdown :md="item.content"></markdown>
          </div>
          <div style="text-align:right;font-size:14px;">最后更新于：{{format(item.updatedAt)}}</div>
        </div>
        <el-divider>评论一下吧 ！</el-divider>
        <div>
          <el-input
            type="textarea"
            resize="none"
            :rows="5"
            show-word-limit
            maxlength="200"
            v-model="content"
          ></el-input>
          <p style="text-align:right">
            <el-button type="primary" @click="addcomment()">评论</el-button>
          </p>
          <comment :list="list" :count="count" @reshow="commentlist" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import comment from "../../components/comment";
import markdown from "../../components/markdown";
import { findarticle } from "@/api/article";
import { commentlist, addcomment } from "@/api/comment";
import { format, format1 } from "@/utils/format.js";
export default {
  layout: "blog",
  components: {
    comment,
    markdown
  },
  data() {
    return {
      // list: "",
      // count: null,
      comment: "",
      content: "",
      // data: null,
      articledata: null,
      xxx: null
    };
  },
  head() {
    return {
      title: this.data.rows[0].title
    };
  },
  async asyncData({ $axios, params }) {
    // var { lists, count } = await commentlist(params.id);
    var id = params.id;
    var data = await $axios.$get(`/api/comment?article_id=${id}`);
    return { list: data.lists, count: data.count };
  },
  async fetch({ store, params }) {
    var id = params.id;
    await store.dispatch("article/findarticle", { id });
  },
  methods: {
    // 格式化日期时间
    format(time) {
      return format(time);
    },
    // 提交留言
    addcomment() {
      if (this.$store.state.user.token) {
        var article_id = this.$route.params.id;
        var from_userid = this.$store.state.user.token;
        var content = this.content;
        var to_commentid = -1;
        var to_username = null;
        var date = new Date();
        var date = format(date);
        addcomment({
          article_id,
          from_userid,
          content,
          to_commentid,
          to_username,
          date
        })
          .then(res => {
            if (res) {
              this.commentlist(this.$route.params.id);
              this.$newmessage("发表成功！", "success");
            } else {
              this.$newmessage(res.data, "success");
            }
          })
          .catch(err => {
            console.log("err");
            this.$newmessage("发表失败！", "error");
          });
      } else {
        this.$newmessage("暂未登录，请登录！", "warning");
      }
    },
    // 文章留言列表
    commentlist(id) {
      commentlist(id)
        .then(res => {
          this.list = res.lists;
          this.count = res.count;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 文章信息
    articleinfo(id) {
      findarticle(id).then(res => {
        this.data = res.list.rows;
      });
    }
  },
  created() {},
  mounted() {},
  computed: {
    data() {
      return this.$store.state.article.data;
    }
  }
};
</script>

<style>
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