<template>
  <div>
    <div style="padding: 20px 0; position: relative">
      <span>Comments | {{ total || 0 }} 条留言</span>
      <div style="position: absolute; right: 0; top: 20px">
        <LoginCpt />
      </div>
    </div>
    <div v-if="list.length > 0">
      <div v-loading="listLoading" style="width: 100%">
        <div v-for="(item, index) in list" :key="index" class="parent-comment">
          <div style="display: flex">
            <div>
              <el-avatar :size="40">
                <img v-lazy="item.from_user.avatar" class="user-avatar" />
              </el-avatar>
            </div>
            <div style="flex-grow: 1; padding: 5px">
              <div class="top">
                <span style="color: #0984e3">{{
                  item.from_user.username
                }}</span>
                <span class="rank">{{
                  item.from_user.roles &&
                  item.from_user.roles[0].role_description
                }}</span>
                <span class="ua">{{ parseUa(item.ua || '') }}</span>
              </div>
              <div class="content">{{ item.content }}</div>
              <div class="bottom">
                <div class="el-icon-date">
                  {{ format(item.created_at) }}
                  <span class="ip-data">
                    {{
                      JSON.parse(item.ip_data).province +
                      '/' +
                      JSON.parse(item.ip_data).city +
                      '/' +
                      JSON.parse(item.ip_data).district
                    }}</span
                  >
                </div>
                <div style="float: right">
                  <span
                    class="el-icon-chat-round"
                    style="cursor: pointer"
                  ></span>
                  <span style="cursor: pointer" @click="showinput(item.id)">
                    回复{{ ` | ` }}
                  </span>
                  <span>
                    <el-tooltip
                      v-if="item.isStar === true"
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
                </div>
              </div>
              <div
                v-show="item.id === isshow"
                style="background: #fafbfc; padding: 10px"
              >
                <div>
                  <el-input
                    ref="input1"
                    v-model="message"
                    type="textarea"
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
            v-for="(itemm, indexx) in item.children_comment"
            :key="indexx"
            class="children-comment"
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
                <img v-lazy="itemm.from_user.avatar" class="user-avatar" />
              </el-avatar>
            </div>
            <div
              :style="{
                flexGrow: 1,
                padding: '5px',
              }"
            >
              <div style="color: #0984e3">
                <div>
                  <span class="rank">{{
                    item.from_user.roles &&
                    item.from_user.roles[0].role_description
                  }}</span
                  >{{ itemm.from_user.username }}
                </div>
              </div>
              <div>
                回复
                <span style="color: #48dbfb"
                  >@{{ itemm.to_user.username }}:</span
                >
                <div class="content">{{ itemm.content }}</div>
              </div>
              <div>
                <span class="el-icon-date">{{ format(itemm.created_at) }}</span>
                <div style="float: right">
                  <i class="el-icon-chat-round" style="cursor: pointer"></i>
                  <span style="cursor: pointer" @click="showinput(itemm.id)">
                    回复{{ ` | ` }}
                    <el-tooltip
                      v-if="itemm.isStar === true"
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
              <div
                v-show="itemm.id === isshow"
                style="background: #fafbfc; padding: 10px"
              >
                <div>
                  <el-input
                    ref="input2"
                    v-model="message"
                    type="textarea"
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
            v-if="item.children_comment.length != 0"
            style="margin-left: 40px"
          >
            <div
              v-if="item.children_comment.length < item.children_comment_total"
              style="color: rgb(9, 132, 227); background: #fbfbfb"
              @click="handleChildrenPage(item)"
            >
              <span :style="{ cursor: 'pointer' }"
                >查看更多回复({{ item.children_comment_total }})
              </span>
            </div>
            <div v-else class="loadMore">
              没有更多了~
              <el-button type="text" @click="zhedie(item)">折叠评论</el-button>
            </div>
          </div>
        </div>

        <div v-if="hasMore" class="loadMore">
          <el-button type="text" @click="handleParentPage"
            >加载更多留言...</el-button
          >
        </div>

        <div v-else class="loadMore" style="margin: 10px 0">
          已加载所有留言！
        </div>
      </div>
    </div>
    <div v-else style="text-align: center; padding: 40px 0">
      目前还没有人留言~
    </div>
  </div>
</template>

<script>
import ua from 'ua-device'
import LoginCpt from '@/components/login'
import { format } from '@/utils/format.js'
export default {
  components: {
    LoginCpt,
  },
  props: [
    'list',
    'pageSize',
    'nowPage',
    'childrenPageSize',
    'hasMore',
    'total',
  ],
  data() {
    return {
      loadingStar: false,
      listLoading: false,
      message: null,
      isshow: '',
      autofocus: '',
    }
  },
  methods: {
    parseUa(v) {
      const osName = ua(v).os.name
      const osVersion = ua(v).os.version ? ua(v).os.version.original : ''
      return osName + ' ' + osVersion
    },
    // 给评论点赞/取消点赞
    async starForComment(type, item) {
      if (this.$store.state.user.token) {
        if (type === 1) {
          const res = await this.$axios1.post(`/api/star/starForComment`, {
            article_id: item.article_id,
            comment_id: item.id,
            from_user_id: this.$store.state.user.id,
            to_user_id: item.from_user_id,
          })
          setTimeout(() => {
            this.loadingStar = false
            this.$message.success({
              message: res.data.message,
            })
            this.$emit('refresh')
          }, 300)
        } else {
          const res = await this.$axios1.delete(`/api/star/delStarForComment`, {
            data: {
              article_id: item.article_id,
              comment_id: item.id,
              from_user_id: this.$store.state.user.id,
              to_user_id: item.from_user_id,
            },
          })

          setTimeout(() => {
            this.loadingStar = false
            this.$message.success({
              message: res.data.message,
            })
            this.$emit('refresh')
          }, 300)
        }
      } else {
        this.$newmessage('暂未登录，请登录！', 'warning')
      }
    },
    handleBlur() {
      this.isshow = ''
    },
    zhedie() {
      this.$message.success({
        message: '敬请期待！',
      })
    },
    handleChildrenPage(v) {
      v.nowPage = v.nowPage ? v.nowPage + 1 : 1
      this.$emit('handleChildrenPage', {
        article_id: v.article_id,
        to_comment_id: v.id,
        childrenNowPage: v.nowPage,
        childrenPageSize: this.childrenPageSize,
      })
    },
    handleParentPage() {
      this.$emit('handleParentPage', {
        nowPage: this.nowPage,
        pageSize: this.pageSize,
        hasMore: this.hasMore,
      })
    },
    // 显示留言输入框
    showinput(id) {
      this.isshow = id

      setTimeout(() => {
        this.autofocus = true
      }, 500)
    },
    format(time) {
      return format(time)
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
        } = item
        if (this.$store.state.user.token) {
          var article_id = parseInt(article_id)
          var from_user_id = parseInt(this.$store.state.user.id)
          var content = this.message
          if (to_comment_id === -1) {
            var to_comment_id = id
          } else {
            var to_comment_id = to_comment_id
          }
          var to_user_id = item.from_user_id
          try {
            await this.$store.dispatch('comment/addComment', {
              id: null,
              article_id,
              from_user_id,
              content,
              to_comment_id,
              to_user_id,
            })
            id = this.$route.params.id ? this.$route.params.id : -1
            this.$newmessage('回复成功！', 'success')
            this.$emit('refresh', id)
            this.showinput(null)
            this.message = ''
          } catch (err) {
            console.log(err)
            this.message = ''
          }
        } else {
          this.$newmessage('暂未登录，请登录！', 'warning')
        }
      } else {
        this.$newmessage('请输入三个字以上留言内容~', 'warning')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.children-comment,
.parent-comment {
  .content {
    padding: 10px 0;
    font-size: 16px;
  }
  .el-icon-date {
    font-size: 14px;
  }
}
.parent-comment {
  .top {
    display: flex;
    align-items: center;
    .ua {
      font-size: 12px;
    }
  }
  .bottom {
    .ip-data {
      font-size: 12px;
    }
  }
}
.user-avatar {
  border-radius: 50%;
  transition: all 0.5s;
  &:hover {
    transform: rotate(1turn);
  }
}
.star {
  cursor: pointer;
}
.loadMore {
  width: 100%;
  text-align: center;
}
.rank {
  position: relative;
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
