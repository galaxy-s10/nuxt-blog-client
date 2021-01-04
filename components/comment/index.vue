<template>
  <div>
    <div style="padding: 20px 0; position: relative">
      <span>Comments | {{ allCount }} 条留言</span>
      <div style="position: absolute; right: 0; top: 20px">
        <login />
      </div>
    </div>
    <div v-if="list.length > 0">
      <div v-loading="listLoading" style="width: 100%">
        <div v-for="(item, index) in list" :key="index">
          <div style="display: flex">
            <div>
              <el-avatar :size="40">
                <img class="userlogo" v-lazy="item.from_user.avatar" />
              </el-avatar>
            </div>
            <div style="flex-grow: 1; padding: 5px">
              <div style="color: #0984e3">
                <span v-if="item.from_user.id == 1" class="rank">博主</span>
                <span>{{ item.from_user.username }}</span>
              </div>
              <div>{{ item.content }}</div>
              <div>
                <span class="el-icon-date">{{ format(item.createdAt) }}</span>
                <span style="float: right">
                  <i class="el-icon-chat-round" style="cursor: pointer"></i>
                  <span style="cursor: pointer" @click="showinput(item.id)"> 回复 </span>|
                  <span>
                    <el-tooltip
                      v-if="item.isStar == true"
                      class="item"
                      effect="dark"
                      content="取消点赞"
                      placement="top"
                      @click.native="starForComment(0, item)"
                    >
                      <i class="el-icon-star-on star"></i>
                    </el-tooltip>
                    <el-tooltip
                      v-else
                      class="item"
                      effect="dark"
                      content="赞一个"
                      placement="top"
                      @click.native="starForComment(1, item)"
                    >
                      <i class="el-icon-star-off star"></i>
                    </el-tooltip>
                    {{ item.stars.length }}
                  </span>
                </span>
              </div>
              <div style="background: #fafbfc; padding: 10px" v-show="item.id == isshow">
                <div>
                  <el-input
                    ref="input1"
                    type="textarea"
                    v-model="message"
                    placeholder="请输入内容..."
                    maxlength="50"
                    show-word-limit
                    @blur="handleBlur"
                  ></el-input>
                </div>
                <div style="padding-top: 5px; display: flex">
                  <div style="margin-left: auto">
                    <el-button type="primary" size="small" @click="add(item)"
                      >评论</el-button
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            v-for="(itemm, index) in item.huifu"
            :key="index"
            :style="{
              position: 'relative',
              background: '#fbfbfb',
              display: 'flex',
              marginLeft: '40px',
              padding: '10px 0',
            }"
          >
            <div>
              <el-avatar :size="40">
                <img class="userlogo" v-lazy="itemm.from_user.avatar" />
              </el-avatar>
            </div>
            <div
              :style="{
                flexGrow: 1,
                padding: '5px',
              }"
            >
              <div style="color: #0984e3">
                <span v-if="itemm.from_user.id == 1" class="rank">博主</span>
                <span>{{ itemm.from_user.username }}</span>
              </div>
              <div>
                回复
                <span style="color: #48dbfb">@{{ itemm.to_user.username }}:</span>
                {{ itemm.content }}
              </div>
              <div>
                <span class="el-icon-date">{{ format(itemm.createdAt) }}</span>
                
                <div style="float: right">
                  <i class="el-icon-chat-round" style="cursor: pointer"></i>
                  <span style="cursor: pointer" @click="showinput(itemm.id)">
                    回复 |
                    <el-tooltip
                      v-if="itemm.isStar == true"
                      class="item"
                      effect="dark"
                      content="取消点赞"
                      placement="top"
                      @click.native="starForComment(0, itemm)"
                    >
                      <i class="el-icon-star-on star"></i>
                    </el-tooltip>
                    <el-tooltip
                      v-else
                      class="item"
                      effect="dark"
                      content="赞一个"
                      placement="top"
                      @click.native="starForComment(1, itemm)"
                    >
                      <i class="el-icon-star-off star"></i>
                    </el-tooltip>
                    {{ itemm.stars.length }}
                  </span>
                
                </div>


              </div>
              <div style="background: #fafbfc; padding: 10px" v-show="itemm.id == isshow">
                <div>
                  <el-input
                    ref="input2"
                    type="textarea"
                    v-model="message"
                    placeholder="请输入内容..."
                    maxlength="50"
                    show-word-limit
                    @blur="handleBlur"
                  ></el-input>
                </div>
                <div style="padding-top: 5px; display: flex">
                  <div style="margin-left: auto">
                    <el-button type="primary" size="small" @click="add(item)"
                      >评论</el-button
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style="margin-left: 40px" v-if="item.huifu.length != 0">
            <div
              v-if="item.huifucount.length > item.huifu.length"
              @click="handleChildrenPage(item)"
              style="color: rgb(9, 132, 227); background: #fbfbfb"
            >
              <span style="cursor: pointer"
                >查看更多回复{{
                  item.huifucount.length > item.huifu.length
                    ? `(${item.huifucount.length - item.huifu.length})`
                    : ""
                }}
              </span>
            </div>
            <div
              v-else-if="item.huifu.length > pageParams.childrenPageSize"
              class="loadMore"
            >
              没有更多了
              <el-button @click="zhedie(item)" type="text">折叠评论</el-button>
            </div>
          </div>
          <!-- </div> -->
        </div>

        <div v-if="pageParams.nowPage < pageParams.lastPage" class="loadMore">
          <el-button type="text" @click="handleParentPage">加载更多留言...</el-button>
        </div>

        <div class="loadMore" style="margin: 10px 0" v-else>已加载所有留言！</div>
      </div>
    </div>
    <div v-else style="text-align: center; padding: 40px 0">目前还没有人留言~</div>
  </div>
</template>

<script>
import { format } from "@/utils/format.js";
import login from "../login";
export default {
  components: {
    login,
  },
  props: ["list", "allCount", "pageParams"],
  data() {
    return {
      loadingStar: false,
      listLoading: false,
      message: null,
      isshow: "",
      autofocus: "",
    };
  },
  methods: {
    // 给评论点赞/取消点赞
    async starForComment(type, item) {
      // let from_user_id = this.id;
      // let { article_id, id, from_user_id } = item;
      // async starForComment(type, article_id, comment_id, to_user_id) {
      if (this.$store.state.user.token) {
        this.loadingStar = true;
        if (type == 1) {
          let res = await this.$axios.post(`/api/star/starForComment`, {
            article_id: item.id,
            comment_id: item.id,
            from_user_id: this.$store.state.user.id,
            to_user_id: item.from_user_id,
          });
          setTimeout(() => {
            this.loadingStar = false;
            this.$message.success({
              message: res.data.message,
            });
            this.$emit("reshow");
          }, 300);
        } else {
          let res = await this.$axios.delete(`/api/star/delStarForComment`, {
            data: {
              article_id: item.id,
              comment_id: item.id,
              from_user_id: this.$store.state.user.id,
              to_user_id: item.from_user_id,
            },
          });

          setTimeout(() => {
            this.loadingStar = false;
            this.$message.success({
              message: res.data.message,
            });
            this.$emit("reshow");
          }, 300);
        }
      } else {
        this.$newmessage("暂未登录，请登录！", "warning");
      }
    },
    handleBlur() {
      this.isshow = "";
    },
    zhedie() {
      this.$message.success({
        message: "敬请期待！",
      });
    },
    handleChildrenPage(v) {
      // this.$emit("handleChildrenPage", v.id);
      this.$emit("handleChildrenPage", { ...this.pageParams, childrenCommentId: v.id });
    },
    handleParentPage() {
      this.$emit("handleParentPage", this.pageParams);
    },
    // 显示留言输入框
    showinput(id) {
      this.isshow = id;

      setTimeout(() => {
        //   this.$refs.input1.focus()
        // this.$refs.input2.focus()
        this.autofocus = true;
      }, 500);
    },
    format(time) {
      return format(time);
    },
    // 回复留言
    async add(item) {
      if (this.message != null && this.message.length >= 3) {
        var {
          id,
          article_id,
          from_user_id,
          from_user,
          content,
          to_comment_id,
          to_user_id,
        } = item;
        if (this.$store.state.user.token) {
          var article_id = parseInt(article_id);
          var from_user_id = parseInt(this.$store.state.user.id);
          var content = this.message;
          if (to_comment_id == -1) {
            var to_comment_id = id;
          } else {
            var to_comment_id = to_comment_id;
          }
          var to_user_id = item.from_user_id;
          try {
            await this.$store.dispatch("comment/addComment", {
              id: null,
              article_id,
              from_user_id,
              content,
              to_comment_id,
              to_user_id,
            });
            id = this.$route.params.id ? this.$route.params.id : -1;
            this.$newmessage("回复成功！", "success");
            this.$emit("reshow", id);
            this.showinput(null);
            this.message = "";
          } catch (err) {
            console.log(err);
            this.message = "";
            return;
          }
        } else {
          this.$newmessage("暂未登录，请登录！", "warning");
        }
      } else {
        this.$newmessage("请输入三个字以上留言内容~", "warning");
      }
    },
  },
  computed: {},
  mounted() {},
  watch: {},
};
</script>

<style scoped>
.star {
  cursor: pointer;
}
.loadMore {
  width: 100%;
  text-align: center;
  /* margin: 10px 0; */
}
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
