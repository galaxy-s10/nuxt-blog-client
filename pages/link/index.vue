<template>
  <div
    class="content"
    style="
      overflow: hidden;
      background: white;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
      padding: 30px;
    "
  >
    <h1 style="text-align: center; padding: 10px">友链</h1>
    <hr class="hrclass" />
    <ul class="linkWrap">
      <div v-if="linkList.length">
        <li v-for="(item, index) in linkList" :key="index" class="liitem">
          <a :href="item.url" class="alink" target="_bank">
            <div class="linkborder">
              <div style="flex: 1">
                <div style="color: #ffa7a6">{{ item.name }}</div>
                <div class="ellipsis" :title="item.desc">{{ item.desc }}</div>
              </div>
              <div>
                <img
                  v-lazy="item['avatar']"
                  class="img"
                  style="border: 2px solid #eee"
                />
              </div>
            </div>
          </a>
        </li>
      </div>
      <span v-else>暂无友链~</span>
    </ul>

    <div style="text-align: center; margin: 30px 0">
      <h2>欢迎大家交换友链~</h2>
    </div>
    <div v-if="true" style>
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
            :disabled="frontendData.frontend_link === -1"
            @click="addLink()"
            >提交申请</el-button
          >
        </el-form-item>
      </el-form>
    </div>

    <el-input
      v-model="content"
      type="textarea"
      resize="none"
      :rows="5"
      show-word-limit
      maxlength="200"
    ></el-input>
    <p style="text-align: right">
      <el-button
        v-if="frontendData"
        type="primary"
        :disabled="frontendData.frontend_comment === -1"
        @click="addcomment()"
        >发表评论</el-button
      >
    </p>
    <comment
      v-loading="isLoading"
      :list="commentList"
      :total="total"
      :has-more="hasMore"
      :now-page="nowPage"
      :page-size="pageSize"
      :children-page-size="childrenPageSize"
      @refresh="getComment"
      @handleParentPage="handleParentPage"
      @handleChildrenPage="handleChildrenPage"
    />
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import comment from '@/components/comment'
import { format } from '@/utils/format.js'
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
    comment,
  },
  layout: 'blog',
  async asyncData({ $axios1, params, store }) {
    // 获取友链数据
    const { rows } = await $axios1.get('/api/link/list', {
      params: { nowPage: 1, pageSize: 100, status: 1 },
    })
    const searchQuery = {
      article_id: -1,
      nowPage: store.state.comment.nowPage, // 当前父评论页数
      pageSize: store.state.comment.pageSize, // 当前父评论分页大小
      childrenPageSize: store.state.comment.childrenPageSize, // 当前子评论分页大小
    }
    const data = await $axios1.get(`/api/comment/comment`, {
      params: searchQuery,
    })
    return {
      linkList: rows,
      commentList: data.rows,
      total: data.total,
      hasMore: data.hasMore,
    }
  },
  data() {
    return {
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
      messagecontent: '',
      isshow: '',
      isLoading: false,
      content: '',
    }
  },
  head() {
    return {
      title: '友链 - 自然博客',
      meta: [{ hid: 'home', name: 'description', content: '自然 - 个人博客' }],
    }
  },
  computed: {
    formatDate(time) {
      return (time) => {
        return format(time)
      }
    },
    frontendData() {
      return this.$store.state.app.frontendData.frontend
    },
    userInfo() {
      return this.$store.state.user.id
    },
    childrenPageSize() {
      return this.$store.state.comment.childrenPageSize
    },
    pageSize() {
      return this.$store.state.comment.pageSize
    },
    nowPage() {
      return this.$store.state.comment.nowPage
    },
  },
  watch: {
    userInfo(val) {
      this.getComment()
    },
  },
  mounted() {},
  methods: {
    ...mapActions({
      getUserInfo: 'user/getUserInfo',
    }),
    ...mapMutations({
      setToken: 'user/setToken',
      logout: 'user/logout',
    }),
    // 申请友链
    addLink() {
      this.$refs.linkForm.validate(async (valid) => {
        if (valid) {
          try {
            const addLinkRes = await this.$axios1.post(
              '/api/link/add',
              this.linkForm
            )
            this.$newmessage(addLinkRes.message, 'success')
            for (const i in this.linkForm) {
              this.linkForm[i] = ''
            }
          } catch (err) {
            this.$newmessage(err.message, 'error')
          }
        } else {
          this.$newmessage('请按要求输入正确！', 'error')
        }
      })
    },
    // 留言列表
    async getComment() {
      const id = -1
      const query = {
        article_id: id,
        nowPage: 1,
        pageSize: 3,
        childrenNowPage: 1,
        childrenPageSize: 2,
      }

      try {
        this.isLoading = true
        const data = await this.$axios1.get(`/api/comment/comment`, {
          params: { ...query },
        })
        setTimeout(() => {
          this.isLoading = false
          this.pageParams = {
            ...query,
            nowPage: data.nowPage,
            pageSize: data.pageSize,
          }
          this.commentList = data.rows
          this.total = data.total
        }, 300)
      } catch (err) {
        console.log(err)
        this.isLoading = false
      }
    },
    // 提交留言
    async addcomment() {
      if (this.$store.state.user.token) {
        const article_id = parseInt(this.article_id)
        const from_user_id = parseInt(this.$store.state.user.id)
        const content = this.content
        const to_comment_id = -1
        const to_user_id = -1
        if (content.length >= 3) {
          const res = await this.$axios1.post('/api/comment/create', {
            article_id,
            from_user_id,
            content,
            to_comment_id,
            to_user_id,
          })
          if (res) {
            this.getComment()
            this.$newmessage('发表成功！', 'success')
          } else {
            this.$newmessage(res.data, 'success')
          }
        } else {
          this.$newmessage('请输入三个及以上内容~~~', 'warning')
        }
      } else {
        this.$newmessage('暂未登录，请登录！', 'warning')
      }
    },
    // 获取子评论分页
    async handleChildrenPage(query) {
      const data = await this.$axios1.get(`/api/comment/comment_children`, {
        params: {
          to_comment_id: query.to_comment_id,
          article_id: query.article_id,
          nowPage: query.childrenNowPage + 1,
          pageSize: query.childrenPageSize,
          childrenPageSize: this.childrenPageSize,
        },
      })
      this.commentList.forEach((item) => {
        if (item.id === query.to_comment_id) {
          item.children_comment.push(...data.rows)
        }
      })
    },
    // 获取父评论分页
    async handleParentPage(query) {
      const data = await this.$axios1.get(`/api/comment/comment`, {
        params: {
          article_id: -1,
          nowPage: query.nowPage + 1,
          pageSize: this.pageSize,
          childrenPageSize: this.childrenPageSize,
        },
      })
      this.commentList.push(...data.rows)
      this.hasMore = data.hasMore
    },
  },
}
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
.linkWrap {
  max-height: 300px;
  overflow-y: scroll;
  padding: 0;
  margin: 40px 0;
}
.liitem::before {
  content: '';
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
