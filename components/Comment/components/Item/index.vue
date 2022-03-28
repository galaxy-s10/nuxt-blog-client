<template>
  <div class="item-wrap">
    <img v-lazy="item.from_user.avatar" class="user-avatar" />
    <div class="comment">
      <div class="comment-main">
        <div class="user-box">
          <div>
            <span class="username">
              {{ item.from_user.username }}
              <span v-if="item.from_user.roles" class="role">
                {{
                  item.from_user.roles &&
                  item.from_user.roles[0].role_description
                }}
              </span>
            </span>
            <span v-if="item.to_user" class="username">
              <span class="txt">回复</span>
              {{ item.to_user.username }}
            </span>
          </div>
          <div class="date">
            <span>{{ item.created_at | convertDate }}</span>
          </div>
        </div>
        <div class="content">
          <RenderMarkdownCpt :md="item.content"></RenderMarkdownCpt>
        </div>
        <div class="operation">
          <div class="left">
            <div class="star" @click="handleStar(item)">
              <i
                :class="{
                  'el-icon-star-on': item.is_star === true,
                  'el-icon-star-off': item.is_star === false,
                }"
              ></i>
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
import RenderMarkdownCpt from '@/components/RenderMarkdown'

export default {
  name: 'CItem',
  components: { RenderMarkdownCpt },
  props: ['item'],
  data() {
    return {
      currentComment: null,
      sort: 'hot',
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo
    },
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    sortChange(val) {
      this.sort = val
    },
    closeModal() {
      this.$emit('closeModal')
    },
    // 弹窗回复数据
    handleModal(item) {
      this.$emit('handleModal', item)
    },
    // 处理点击/取消star
    handleStar(item) {
      this.$emit('handleStar', item)
    },
    // 显示回复框
    showReply(item) {
      this.$emit('showReply', item)
    },
    // 删除回复
    deleteReply(item) {
      this.$emit('deleteReply', item)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/constant.scss';

.item-wrap {
  position: relative;
  display: flex;
  margin: 10px 0;
  &:not(:first-child) {
    margin-top: 20px;
  }
  .user-avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    transition: all 0.5s;
    &:hover {
      transform: rotate(1turn);
    }
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
