<template>
  <div class="item-wrap">
    <div class="avatar-wrap">
      <div
        @mouseenter="loadingUserDetail(item.from_user)"
        @mouseleave="mouseleave()"
      >
        <div v-if="currentUserDetail" class="detail">
          <div class="top">
            <div class="avatar">
              <img :src="currentUserDetail.avatar" alt="" />
            </div>
            <div class="name">
              <div>
                <b>{{ currentUserDetail.username }}</b>
              </div>
              <p
                class="desc"
                :title="currentUserDetail && currentUserDetail.desc"
              >
                {{ currentUserDetail && currentUserDetail.desc }}
              </p>
            </div>
          </div>
          <div class="bottom">
            <div>
              github:
              <a
                v-if="currentUserDetail.github_users[0]"
                :href="currentUserDetail.github_users[0].html_url"
                target="__blank"
              >
                {{ currentUserDetail.github_users[0].html_url }}</a
              >
              <span v-else>未绑定</span>
            </div>
            <div>
              email:
              {{
                currentUserDetail.email_users[0]
                  ? currentUserDetail.email_users[0].email
                  : '未绑定'
              }}
            </div>
          </div>
          <div class="triangle"></div>
        </div>
        <img v-lazy="item.from_user.avatar" class="user-avatar" />
      </div>
    </div>
    <div class="comment">
      <div class="comment-main">
        <div class="user-box">
          <div>
            <span class="username">
              {{ item.from_user.username }}
              <template v-if="item.from_user.roles">
                <span
                  v-for="role in item.from_user.roles"
                  :key="role.value"
                  class="role"
                >
                  {{ role.role_name }}
                </span>
              </template>
            </span>
            <span
              v-if="
                item.to_user_id !== -1 &&
                item.parent_comment_id !== item.reply_comment_id
              "
              class="username"
            >
              <span class="txt">回复</span>
              {{ item.to_user.username }}
            </span>
          </div>
          <div class="date">
            <span>{{ item.created_at | convertDate }}</span>
          </div>
        </div>
        <div class="content">
          <AsyncRenderMarkdownCpt :md="item.content"></AsyncRenderMarkdownCpt>
          <div
            v-if="
              item.reply_comment &&
              item.parent_comment_id !== item.reply_comment_id
            "
            class="parent-content"
          >
            <div v-if="!item.reply_comment.deleted_at" class="padding">
              <AsyncRenderMarkdownCpt
                :md="item.reply_comment.content"
              ></AsyncRenderMarkdownCpt>
            </div>
            <div v-else>该评论已被删除</div>
          </div>
        </div>
        <div class="operation">
          <div class="left">
            <div class="star" @click="handleStar(item)">
              <i
                :class="{
                  'el-icon-star-on': item.is_star === true,
                  'el-icon-star-off': item.is_star === false,
                }"
              >
              </i>
              <span>
                {{ item.star_total }}
                {{ item.is_star === true ? '取消点赞' : '点赞' }}
              </span>
            </div>
            <div class="comment" @click="showReply(item)">
              <i class="el-icon-chat-round"></i>
              <span>回复</span>
            </div>
            <div
              v-if="userInfo ? item.from_user_id === userInfo.id : false"
              class="delete"
              @click="deleteReply(item)"
            >
              <span>删除</span>
            </div>
          </div>
          <div class="right">
            <span>
              {{ JSON.parse(item.ip_data) | parseIpInfo }}
            </span>
            <span class="ua">{{ (item.ua || '') | parseUa }}</span>
          </div>
        </div>
      </div>
      <div
        v-if="item.children_comment && item.children_comment.length"
        class="comment-child"
      >
        <CItem
          v-for="(child, index) in item.children_comment"
          :key="index"
          :item="child"
          v-bind="$attrs"
          v-on="$listeners"
        ></CItem>
        <div class="load-more" @click="handleModal(item)">
          共{{ item.children_comment_total }}条回复
          <i class="el-icon-caret-bottom"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CItem',
  components: {
    AsyncRenderMarkdownCpt: () => import('components/RenderMarkdown/index.vue'),
  },
  props: {
    item: {
      type: Object,
      require: true,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      currentComment: null,
      sort: 'hot',
      currentUserDetail: null,
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo;
    },
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async loadingUserDetail(v) {
      const { data } = await this.$myaxios.get(`/user/find/${v.id}`, {});
      this.currentUserDetail = data;
    },
    mouseleave() {
      let timer = null;
      timer = setTimeout(() => {
        this.currentUserDetail = null;
        clearTimeout(timer);
      }, 300);
    },
    sortChange(val) {
      this.sort = val;
    },
    closeModal() {
      this.$emit('closeModal');
    },
    // 弹窗回复数据
    handleModal(item) {
      this.$emit('handleModal', item);
    },
    // 处理点击/取消star
    handleStar(item) {
      this.$emit('handleStar', item);
    },
    // 显示回复框
    showReply(item) {
      this.$emit('showReply', item);
    },
    // 删除回复
    deleteReply(item) {
      this.$emit('deleteReply', item);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/css/constant.scss';

.item-wrap {
  position: relative;
  display: flex;
  margin: 10px 0;
  .avatar-wrap {
    position: relative;
    .detail {
      position: absolute;
      z-index: 100;
      padding: 15px;
      width: 200px;
      border: 1px solid #ebebeb;
      border-radius: 2px;
      background-color: #fff;
      box-shadow: 0 2px 6px 0 rgb(0 0 0 / 8%);
      transform: translate(-10%, -100%);
      .top {
        display: flex;
        align-content: space-around;
        align-items: center;
        .avatar {
          margin-right: 10px;

          img {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            box-shadow: 0 2px 6px 0 rgb(0 0 0 / 15%);
          }
        }
        .name {
          overflow: hidden;
          flex-basis: 100%;
          .desc {
            width: 100%;
            color: #8a919f;
            font-size: 14px;

            @extend .singleEllipsis;
          }
        }
      }
      .triangle {
        width: 10px;
        height: 10px;
        background-color: white;
        position: absolute;
        bottom: -6px;
        left: 15%;
        border-right: 1px solid #ebebeb;
        border-bottom: 1px solid #ebebeb;
        transform: rotate(45deg);
      }
    }
    .user-avatar {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      transition: all 0.5s;
      cursor: pointer;
      &:hover {
        transform: rotate(1turn);
      }
    }
  }
  &:not(:first-child) {
    margin-top: 20px;
  }

  .comment {
    flex: 1;
    .comment-main {
      margin-left: 10px;
      &:hover .delete {
        display: block !important;
      }
      .user-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .username {
          color: $theme-color1;
          .role {
            display: inline-block;
            margin-left: 4px;
            padding: 2px;
            border-radius: 3px;
            background-color: #94c9ff;
            background-image: linear-gradient(180deg, #94c9ff 0%, #59aeff 100%);
            color: $theme-color6;
            text-align: center;
            font-size: 12px;
            transform: translateY(-1px);
          }
          .txt {
            color: $theme-color5;
          }
        }
      }
      .content {
        margin-top: 8px;
        font-size: 16px;
        .parent-content {
          display: flex;
          background: #f2f3f5;
          border: 1px solid #e4e6eb;
          box-sizing: border-box;
          border-radius: 4px;
          padding: 0px 12px;
          line-height: 36px;
          font-size: 14px;
          color: #8a919f;
          margin-top: 8px;
          .padding {
            padding: 6px 0;
          }
          & :deep(.markdown-body) {
            color: #8a919f;
          }
        }
      }
      .operation {
        display: flex;
        justify-content: space-between;
        margin-top: 8px;
        height: 22px;
        line-height: 22px;
        .left {
          display: flex;
          justify-content: space-between;
          .star {
            margin-right: 16px;
            cursor: pointer;
          }
          .comment {
            margin-right: 16px;
            cursor: pointer;
          }
          .delete {
            display: none;
            color: $theme-color7;
            cursor: pointer;
          }
        }
        .right {
          font-size: 14px;
        }
      }
    }
    .comment-child {
      margin-top: 10px;
      padding: 10px;
      border-radius: 6px;
      background-color: $theme-color2;
      .load-more {
        display: inline-block;
        color: $theme-color1;
        cursor: pointer;
      }
    }
  }
}
</style>
