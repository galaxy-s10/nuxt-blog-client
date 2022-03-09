<template>
  <div class="link-wrap">
    <h1 class="title">友链</h1>
    <hr class="hr-class" />

    <ul class="link-list-wrap">
      <template v-if="linkList.length">
        <li v-for="(item, index) in linkList" :key="index" class="li-item-wrap">
          <a :href="item.url" class="li-item-link" target="_bank">
            <img v-lazy="item.avatar" class="user-avatar" />
            <div class="desc">
              <span>{{ item.name }}</span>
              <span class="txt" :title="item.desc">
                {{ item.desc }}
              </span>
            </div>
          </a>
        </li>
      </template>
      <span v-else>暂无友链~</span>
    </ul>

    <h2 class="happy-title">欢迎大家交换友链~</h2>
    <div>
      <el-form
        ref="linkForm"
        :model="linkForm"
        :rules="linkRules"
        label-width="100px"
      >
        <el-form-item label="网站名称" prop="name">
          <el-input
            v-model="linkForm.name"
            placeholder="输入您网站的名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="网站地址" prop="url">
          <el-input
            v-model="linkForm.url"
            placeholder="输入您网站的链接"
          ></el-input>
        </el-form-item>
        <el-form-item label="网站介绍" prop="description">
          <el-input
            v-model="linkForm.desc"
            placeholder="简单介绍一下您的网站"
          ></el-input>
        </el-form-item>
        <el-form-item label="网站Logo" prop="avatar">
          <el-input
            v-model="linkForm.avatar"
            placeholder="输入您网站显示的logo"
          ></el-input>
        </el-form-item>
        <el-form-item label="您的邮箱" prop="email">
          <el-input
            v-model="linkForm.email"
            placeholder="审核结果会通过邮件通知您"
          ></el-input>
        </el-form-item>
        <el-form-item v-if="frontendData">
          <el-button
            type="primary"
            :disabled="frontendData.frontend.frontend_link === -1"
            @click="addLink()"
          >
            提交申请
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 发表评论 -->
    <div class="comment-wrap">
      <TextareaInputCpt @contentChange="contentChange"></TextareaInputCpt>
      <div class="btn">
        <el-button
          type="primary"
          :loading="submitCommentLoading"
          @click="addComment"
        >
          发表评论
        </el-button>
      </div>
    </div>

    <!-- 评论组件 -->
    <CommentCpt
      v-loading="isLoading"
      :list="commentList"
      :total="total"
      :sort="sort"
      :has-more="hasMore"
      :now-page="nowPage"
      :page-size="pageSize"
      :children-page-size="childrenPageSize"
      @refresh="refreshCommentList"
      @deleteReply="deleteReply"
      @sortChange="sortChange"
      @handleParentPage="handleParentPage"
      @handleChildrenPage="handleChildrenPage"
    />
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import CommentCpt from '@/components/Comment'
import TextareaInputCpt from '@/components/TextareaInput'

const validateEmail = (rule, value, callback) => {
  const reg =
    /^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/
  if (value) {
    if (!reg.test(value)) {
      callback(new Error('请输入正确的邮箱！'))
    }
    return callback()
  } else {
    callback()
  }
}

export default {
  components: {
    CommentCpt,
    TextareaInputCpt,
  },
  layout: 'blog',
  async asyncData({ $axios1, params, store }) {
    // 获取友链数据
    const { data: linkData } = await $axios1.get('/api/link/list', {
      params: { nowPage: 1, pageSize: 100 },
    })
    const orderName = 'created_at'
    const commentParams = {
      article_id: -1,
      nowPage: 1,
      pageSize: 3,
      childrenPageSize: store.state.comment.childrenPageSize, // 子评论分页大小
      orderName,
      orderBy: 'desc',
    }
    const { data: commentData } = await $axios1.get(`/api/comment/comment`, {
      params: commentParams,
    })
    return {
      sort: orderName === 'created_at' ? 'date' : 'hot',
      linkList: linkData.rows,
      commentList: commentData.rows,
      total: commentData.total,
      hasMore: commentData.hasMore,
      nowPage: commentParams.nowPage,
      pageSize: commentParams.pageSize,
    }
  },
  data() {
    return {
      submitCommentLoading: false,
      currentComponent: '',
      linkForm: {
        name: '',
        url: '',
        description: '',
        avatar: '',
        email: '',
      },
      linkRules: {
        name: [
          { required: true, message: '网站名称不能为空', trigger: 'blur' },
          {
            min: 2,
            max: 50,
            message: '网站名称要求2-50个字符',
            trigger: 'blur',
          },
        ],
        url: [
          { required: true, message: '网站地址不能为空', trigger: 'blur' },
          {
            max: 100,
            message: '网站地址不能超过100个字符',
            trigger: 'blur',
          },
        ],
        description: [
          { required: true, message: '网站介绍不能为空', trigger: 'blur' },
          {
            min: 2,
            max: 50,
            message: '网站介绍要求2-50个字符',
            trigger: 'blur',
          },
        ],
        avatar: [
          { required: true, message: '网站Logo不能为空', trigger: 'blur' },
          {
            max: 100,
            message: '网站Logo不能超过100个字符',
            trigger: 'blur',
          },
        ],
        email: [
          {
            validator: validateEmail,
            trigger: 'change',
          },
        ],
      },
      linkList: null,
      article_id: -1,
      commentContent: '',
      isshow: '',
      isLoading: false,
      content: '',
    }
  },
  head() {
    return {
      title: '友链 - 自然博客',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Natural Blog - Link',
        },
      ],
    }
  },
  computed: {
    frontendData() {
      return this.$store.state.app.frontendData
    },
    userInfo() {
      return this.$store.state.user.id
    },
    childrenPageSize() {
      return this.$store.state.comment.childrenPageSize
    },
  },
  watch: {
    userInfo() {
      this.refreshCommentList()
    },
  },
  mounted() {
    this.getFrontendData()
  },
  methods: {
    ...mapActions({
      getUserInfo: 'user/getUserInfo',
      getFrontendData: 'app/getFrontendData',
    }),
    ...mapMutations({
      setToken: 'user/setToken',
      logout: 'user/logout',
    }),
    contentChange(newVal, oldVal) {
      this.commentContent = newVal
    },

    // 新增回复
    async addComment() {
      if (!this.$store.state.user.userInfo) {
        this.$newmessage('暂未登录，请登录！', 'warning')
        return
      }
      if (this.commentContent.length < 5) {
        this.$newmessage('评论内容至少5个字符~', 'warning')
        return
      }
      try {
        this.submitCommentLoading = true
        await this.$axios1.post('/api/comment/create', {
          article_id: -1,
          content: this.commentContent,
          parent_comment_id: -1,
          reply_comment_id: -1,
          to_user_id: -1,
        })
        this.submitCommentLoading = false
        this.$newmessage('评论成功~', 'success')
        this.refreshCommentList()
      } catch (error) {
        console.log(error)
        this.submitCommentLoading = false
      }
    },
    // 申请友链
    addLink() {
      this.$refs.linkForm.validate(async (valid) => {
        if (valid) {
          try {
            const { data } = await this.$axios1.post(
              '/api/link/add',
              this.linkForm
            )
            this.$newmessage(data.message, 'success')
            for (const i in this.linkForm) {
              this.linkForm[i] = ''
            }
          } catch (error) {
            this.$newmessage(error.message, 'error')
          }
        } else {
          this.$newmessage('请按要求输入正确！', 'error')
        }
      })
    },
    sortChange(sort) {
      this.sort = sort
      this.refreshCommentList()
    },
    deleteReply(item) {
      if (item.parent_comment_id !== -1) {
        for (let index = 0; index < this.commentList.length; index++) {
          const element = this.commentList[index]
          if (element.id === item.parent_comment_id) {
            for (
              let index = 0;
              index < element.children_comment.length;
              index++
            ) {
              const child = element.children_comment[index]
              if (child.id === item.id) {
                element.children_comment.splice(index, 1)
                break
              }
            }
          }
        }
      }
    },
    // 留言列表
    async refreshCommentList() {
      const query = {
        article_id: -1,
        nowPage: 1,
        pageSize: 3,
        childrenPageSize: this.childrenPageSize,
        orderName: this.sort === 'date' ? 'created_at' : 'star_total',
        orderBy: 'desc',
      }
      try {
        this.isLoading = true
        const { data } = await this.$axios1.get(`/api/comment/comment`, {
          params: { ...query },
        })
        this.isLoading = false
        this.commentList = data.rows
        this.total = data.total
        this.hasMore = data.hasMore
      } catch (error) {
        console.log(error)
        this.isLoading = false
      }
    },

    // 获取子评论分页
    async handleChildrenPage(query) {
      const { data } = await this.$axios1.get(`/api/comment/comment_children`, {
        params: {
          parent_comment_id: query.parent_comment_id,
          article_id: query.article_id,
          pageSize: query.childrenPageSize,
          childrenPageSize: this.childrenPageSize,
        },
      })
      this.commentList.forEach((item) => {
        if (item.id === query.parent_comment_id) {
          item.children_comment.push(...data.rows)
        }
      })
    },
    // 获取父评论分页
    async handleParentPage(query) {
      const { data } = await this.$axios1.get(`/api/comment/comment`, {
        params: {
          article_id: -1,
          nowPage: query.nowPage + 1,
          pageSize: this.pageSize,
          childrenPageSize: this.childrenPageSize,
          orderName: query.orderName,
          orderBy: query.orderBy,
        },
      })
      this.commentList.push(...data.rows)
      this.hasMore = data.hasMore
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/constant.scss';
@import '@/assets/css/mixin.scss';

@media screen and (max-width: 720px) {
  .li-item-wrap {
    flex-basis: 50% !important;
  }
}
@media screen and (max-width: 540px) {
  .li-item-wrap {
    flex-basis: 100% !important;
  }
}
.link-wrap {
  overflow: hidden;
  padding: 30px;
  border: 1px solid $theme-color4;
  border-radius: 5px;
  background: $theme-color6;

  .title {
    display: block;
    text-align: center;
  }
  .link-list-wrap {
    display: flex;
    overflow-y: scroll;
    flex-wrap: wrap;
    justify-content: space-between;
    margin: 40px 0;
    padding: 0;
    max-height: 300px;

    @extend .hideScrollbar;
    .li-item-wrap {
      position: relative;
      overflow: hidden;
      flex-basis: 30%;
      margin-bottom: 10px;
      border-radius: 4px;
      list-style: none;
      .li-item-link {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px;
        border: 1px solid $theme-color4;
        color: $theme-color5;
        text-decoration: none;
        .user-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          transition: all 0.5s;
        }
        .desc {
          flex: 1;
          margin-left: 8px;
          font-size: 14px;
          .txt {
            @include multiEllipsis(2);
          }
        }
      }
      &::before {
        position: absolute;
        left: -60px;
        z-index: -1;
        width: 0;
        height: 100%;
        background-color: rgba(255, 174, 173, 0.5);
        content: '';
        transition: all 0.5s;
        transform: skewX(45deg);
      }
      &:hover {
        z-index: 2;
        .li-item-link {
          border-color: rgba(255, 174, 173, 1);
        }
        .user-avatar {
          transition: all 0.5s;
          transform: rotate(360deg);
        }
        &:before {
          width: 160%;
        }
      }
    }
  }
  .happy-title {
    display: block;
    text-align: center;
  }
}
.comment-wrap {
  .btn {
    margin-top: 20px;
    text-align: right;
  }
}
</style>
