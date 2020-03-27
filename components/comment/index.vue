<template>
  <div>
    <div style="padding:20px 0;position:relative">
      <span>Comments | {{count}} 条留言</span>
      <div style="position:absolute;right:0;top:20px">
        <login />
      </div>
    </div>
    <div v-if="list.length>0">
      <div v-loading="listLoading" style="width:100%;">
        <div v-for="(item,index) in list" :key="index">
          <div>
            <div style="display:flex;">
              <!-- 作者头像，ID -->
              <div>
                <el-avatar :size="40">
                  <img class="userlogo" v-lazy="item.from_user.avatar" />
                </el-avatar>
              </div>
              <!-- 名字，内容，时间 -->
              <div style="flex-grow:1;padding:5px">
                <div style="color:#0984e3">
                  <span v-if="item.from_user.role == 'admin'" class="rank">博主</span>
                  <span>{{item.from_user.username}}</span>
                </div>
                <div>{{item.content}}</div>
                <div style>
                  <span class="el-icon-date">{{format(item.date)}}</span>
                  <span style="float:right;">
                    <i class="el-icon-chat-round" style="cursor:pointer"></i>
                    <span style="margin-left:10px;cursor:pointer" @click="showinput(item.id)">回复</span>
                  </span>
                </div>
                <div style="background:#fafbfc;padding:10px;" v-show="item.id == isshow">
                  <div>
                    <el-input
                      type="textarea"
                      v-model="message"
                      placeholder="请输入内容..."
                      maxlength="50"
                      show-word-limit
                    ></el-input>
                  </div>
                  <div style="padding-top:5px;display:flex">
                    <div style="margin-left:auto">
                      <el-button type="primary" size="small" @click="add(item)">评论</el-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              v-for="(item,index) in item.children"
              :key="index"
              style="background:#fbfbfb;display:flex;margin-left:40px;padding:10px 0;"
            >
              <!-- 作者头像，ID -->
              <div>
                <el-avatar :size="40">
                  <img class="userlogo" v-lazy="item.from_user.avatar" />
                </el-avatar>
              </div>
              <!-- 名字，内容，时间 -->
              <div style="flex-grow:1;padding:5px;border-bottom:1px solid #eee;">
                <div style="color:#0984e3">
                  <span v-if="item.from_user.role == 'admin'" class="rank">博主</span>
                  <span>{{item.from_user.username}}</span>
                </div>
                <div>
                  回复
                  <span style="color:#48dbfb">@{{item.to_user.username}}:</span>
                  {{item.content}}
                </div>
                <div style>
                  <span class="el-icon-date">{{format(item.date)}}</span>
                  <span style="float:right;">
                    <i class="el-icon-chat-round" style="cursor:pointer"></i>
                    <span style="margin-left:10px;cursor:pointer" @click="showinput(item.id)">回复</span>
                  </span>
                </div>
                <div style="background:#fafbfc;padding:10px;" v-show="item.id == isshow">
                  <div>
                    <el-input
                      type="textarea"
                      v-model="message"
                      placeholder="请输入内容..."
                      maxlength="50"
                      show-word-limit
                    ></el-input>
                  </div>
                  <div style="padding-top:5px;display:flex">
                    <div style="margin-left:auto">
                      <el-button type="primary" size="small" @click="add(item)">评论</el-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else style="text-align:center;padding:40px 0">
      <h5 style="padding:0;margin:0;text-align:right"></h5>目前还没有人留言~
    </div>
  </div>
</template>

<script>
import { format } from "@/utils/format.js";
import login from "../login";
export default {
  components: {
    login
  },
  props: ["list", "count"],
  data() {
    return {
      listLoading: false,
      message: null,
      isshow: ""
    };
  },
  methods: {
    // 留言列表
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
    // 显示留言输入框
    showinput(id) {
      this.isshow = id;
    },
    format(time) {
      return format(time);
    },
    // 回复留言
    async add(item) {
      if (this.message != null) {
        var {
          id,
          article_id,
          from_userid,
          from_user,
          content,
          to_commentid,
          to_userid,
          date
        } = item;
        if (this.$store.state.user.token) {
          var article_id = article_id;
          var from_userid = this.$store.state.user.id;
          var content = this.message;
          if (to_commentid == -1) {
            var to_commentid = id;
          } else {
            var to_commentid = to_commentid;
          }
          var to_userid = item.from_userid;
          var date = new Date();
          var date = format(date);
          var res = await this.$axios.$post("/api/comment/add", {
            article_id,
            from_userid,
            content,
            to_commentid,
            to_userid,
            date
          });
          console.log(res)
          if (res.code) {
            this.$emit("reshow", article_id);
            this.$newmessage("发表成功！", "success");
          } else {
            this.$newmessage(res.message, "error");
          }
        } else {
          this.$newmessage("暂未登录，请登录！", "warning");
        }
      } else {
        this.$newmessage("请输入留言内容~", "warning");
      }
    }
  },
  computed: {},
  mounted() {},
  watch: {
    list: function(newval, oldval) {
      this.listLoading = true;
      setTimeout(() => {
        this.listLoading = false;
      }, 500);
    }
  }
};
</script>


<style scoped>
.rank {
  position: relative;
  top: -2px;
  display: inline-block;
  border: 1px solid #fd79a8;
  color: #fd79a8;
  border-radius: 3px;
  padding: 1px;
  font-size: 12px;
  min-width: 30px;
  text-align: center;
  line-height: 1em;
  margin-right: 3px;
}
</style>