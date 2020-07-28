<template>
  <div
    class="content"
    style="overflow:hidden;background:white;box-shadow:0 0 5px rgba(0,0,0,.1);padding:30px"
  >
    <h1 style="text-align:center;padding:10px">友链</h1>
    <hr class="hrclass" />
    <ul
      style="padding:0;margin:0;overflow:hidden;margin:40px 0;display:flex:justity-content:spance-between;flex-wrap:wrap"
    >
      <li class="liitem" v-for="(item,index) in linkList" :key="index">
        <a :href="item.url" class="alink" target="_bank">
          <div class="linkborder">
            <div style="flex:1">
              <div style="color:#ffa7a6">{{item.name}}</div>
              <div class="ellipsis">{{item.description}}</div>
            </div>
            <div>
              <img :src="item.avatar" class="img" style="border:2px solid #eee" />
            </div>
          </div>
        </a>
      </li>
    </ul>
    <div style="text-align:center;margin:30px 0">
      <h2>欢迎大家交换友链~</h2>
    </div>

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
    <comment :list="lists" :count="count" @reshow="commentlist" v-loading="isLoading" />
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
      linkList: null,
      article_id: -1,
      messagecontent: "",
      isshow: "",
      isLoading: false,
      content: ""
    };
  },
  computed: {
    formatDate(time) {
      return time => {
        return format(time);
      };
    }
  },
  head() {
    return {
      title: "友链"
    };
  },
  async asyncData({ $axios, params }) {
    const { rows } = await $axios.$get("/api/link/list");
    var { lists, count } = await $axios.$get(`/api/comment?article_id=-1`);
    return {
      linkList: rows,
      lists,
      count
    };
  },
  methods: {
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
    // 提交留言
    async addcomment() {
      if (this.$store.state.user.token) {
        var article_id = parseInt(this.article_id);
        var from_userid = parseInt(this.$store.state.user.id);
        var content = this.content;
        var to_commentid = -1;
        var to_userid = -1;
        if (content.length >= 3) {
          var res = await this.$axios.$post("/api/comment/add", {
            id: null,
            article_id,
            from_userid,
            content,
            to_commentid,
            to_userid
          });
          if (res) {
            this.commentlist(this.article_id);
            this.$newmessage("发表成功！", "success");
          } else {
            this.$newmessage(res.data, "success");
          }
        } else {
          this.$newmessage("请输入三个及以上内容~~~", "warning");
        }
      } else {
        this.$newmessage("暂未登录，请登录！", "warning");
      }
    }
  }
};
</script>


<style scoped>
@media screen and (max-width: 720px) {
  .liitem {
    width: 45% !important;
  }
}
@media screen and (max-width: 540px) {
  .liitem {
    width: 90% !important;
    margin: 15px auto !important;
    float: none !important;
  }
}
.liitem::before {
  content: "";
  background-color: rgba(255, 174, 173, 0.3);
  height: 100%;
  width: 0;
  left: -60px;
  position: absolute;
  transform: skewX(45deg);
  transition: all 0.5s;
  z-index: -1;
}
.liitem:hover {
  z-index: 2;
}
.liitem:hover:before {
  width: 160%;
}
.liitem:hover .linkborder {
  border-color: #ffaead;
}
.liitem:hover .img {
  transform: rotate(360deg);
  transition: all 0.5s;
}
.alink {
  color: #666;
  text-decoration: none;
}
.ellipsis {
  font-size: 13px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  border-top: 2px dashed #eee;
  padding-top: 10px;
  margin-top: 10px;
}
.liitem {
  width: 31.33%;
  box-sizing: border-box;
  margin: 1%;
  display: inline-block;
  position: relative;
  list-style: none;
  overflow: hidden;
}
.linkborder {
  padding: 10px 18px;
  display: flex;
  justify-content: space-between;
  border: 1px solid #eee;
  border-radius: 5px;
}
.img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  left: 25px;
  transition: all 0.5s;
}
</style>