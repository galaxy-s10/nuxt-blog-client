<template>
  <div class="content">
    <h1 style="text-align:center;padding:10px">留言板</h1>
    <hr class="hrclass" />
    <div style="text-align:center;margin:30px 0">这里是一个留言板，想说什么就在这里留言，欢迎吐槽~</div>
    <el-input
      type="textarea"
      resize="none"
      :rows="5"
      show-word-limit
      maxlength="200"
      v-model="content"
    ></el-input>
    <p style="text-align:right">
      <el-button type="primary" @click="addcomment()">提交</el-button>
    </p>
    <comment :list="lists" :count="count" @reshow="commentlist" />
  </div>
</template>

<script>
import { format } from "@/utils/format.js";
import comment from "../../components/comment";
export default {
  layout: "blog",
  components: {
    comment
  },
  data() {
    return {
      article_id: -1,
      messagecontent: "",
      isshow: "",
      listLoading: true,
      content: ""
    };
  },
  head() {
    return {
      title: "留言板"
    };
  },
  async asyncData({ $axios }) {
    // var { lists, count } = await commentlist(-1);
    var { lists, count } = await $axios.$get(`/api/comment?article_id=-1`);
    return {
      lists,
      count
    };
  },
  mounted() {},
  methods: {
    // 留言列表
    async commentlist(id) {
      var res = await this.$axios.$get(`/api/comment?article_id=${id}`);
      this.lists = res.lists;
      this.count = res.count;
      // commentlist(id)
      //   .then(res => {
      //     this.lists = res.lists;
      //     this.count = res.count;
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   });
    },
    // 格式化时间
    format(time) {
      return format(time);
    },
    // 提交留言
    async addcomment() {
      if (this.$store.state.user.token) {
        var article_id = this.article_id;
        var from_userid = this.$store.state.user.id;
        var content = this.content;
        var to_commentid = -1;
        var to_username = null;
        var date = new Date();
        var date = format(date);
        var res = await this.$axios.$post("/api/comment/add", {
          article_id,
          from_userid,
          content,
          to_commentid,
          to_username,
          date
        });
        if (res) {
          this.commentlist(this.article_id);
          this.$newmessage("发表成功！", "success");
        } else {
          this.$newmessage(res.data, "success");
        }
      } else {
        this.$newmessage("暂未登录，请登录！", "warning");
      }
    }
  },
  computed: {}
};
</script>


<style>
</style>