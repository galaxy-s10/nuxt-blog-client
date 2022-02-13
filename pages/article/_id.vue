<template>
  <div v-if="detail">
    <div class="content">
      <h1 style="text-align: center">
        {{ detail.title }}
      </h1>
      <div class="desc-wrap">
        <div class="summary">
          <div v-if="detail.users[0]" class="user">
            <img :src="detail.users[0].avatar" alt="" />
          </div>
          <div v-if="detail.types[0]" class="type">
            <i class="el-icon-folder-opened"></i>
            {{ detail.types[0].name }}
          </div>
          <div><i class="el-icon-chat-line-round"></i>{{ allCount || 0 }}</div>
          <div>
            <i class="el-icon-view"></i>
            {{ detail.click }}
          </div>
        </div>
        <div class="date">
          <div>
            <i class="el-icon-date" style="margin-right: 4px"></i>
            {{ format(detail.created_at) }}
          </div>
        </div>
      </div>

      <img
        v-if="detail.img != null"
        :src="imgCdnUrl + detail.img"
        class="img1"
      />
      <img v-else src="~/assets/img/nopic.png" class="img1" alt />
      <div>
        <markdown ref="hss-md" :md="detail.content"></markdown>
      </div>
      <div v-loading="loadingStar">
        <div v-if="detail.isStar" style="text-align: left; font-size: 14px">
          你已经赞过这篇文章了哦~
          <el-tooltip
            class="item"
            effect="dark"
            content="取消点赞"
            placement="top"
            @click.native="starForArticle(0, detail.id)"
          >
            <i class="el-icon-star-on star"></i>
          </el-tooltip>
          {{ detail.stars.length }}
        </div>
        <div
          v-else
          style="text-align: left; font-size: 14px; padding-top: 10px"
        >
          如果本文章对你有所帮助，欢迎点个赞~
          <el-tooltip
            class="item"
            effect="dark"
            content="赞一个"
            placement="top"
            @click.native="starForArticle(1, detail.id)"
          >
            <i class="el-icon-star-off star"></i>
          </el-tooltip>
          {{ detail.stars.length }}
        </div>
      </div>

      <div style="text-align: right; font-size: 14px">
        最后更新于：{{ format(detail.updated_at) }}
      </div>
    </div>
    <div
      v-if="detail.tags.length != 0"
      style="padding: 8px 0; text-align: right"
    >
      <span class="el-icon-collection-tag"></span>
      <div v-for="item in detail.tags" :key="item.id" class="little-tag">
        {{ item.name }}
      </div>
    </div>
    <div v-if="detail.is_comment">
      <el-divider>评论一下吧~</el-divider>
      <div>
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
            >提交</el-button
          >
        </p>
        <comment
          v-loading="isLoading"
          :list="commentList"
          :all-count="allCount"
          :page-params="pageParams"
          @reshow="getComment"
          @handleParentPage="parentPage"
          @handleChildrenPage="childrenPage"
        />
      </div>
    </div>
    <div v-else>
      <el-divider>该文章暂未开启评论~</el-divider>
    </div>
  </div>
</template>

<script>
import comment from '@/components/comment'
import markdown from '@/components/markdown'
import { format } from '@/utils/format.js'
import { imgCdnUrl } from '@/constant'

export default {
  components: {
    comment,
    markdown,
  },
  layout: 'blog',
  async asyncData({ $axios1, params, store }) {
    const id = params.id
    const query = {
      article_id: params.id,
      nowPage: 1, // 当前父评论页数
      pageSize: 3, // 当前父评论分页大小
      childrenNowPage: 1, // 当前子评论页数
      childrenPageSize: 2, // 当前子评论分页大小
    }
    try {
      const data = await $axios1.get(`/api/comment/article/${id}`, {
        params: { ...query },
      })
      await store.dispatch('article/getArticleDetail', { id })
      return {
        query,
        commentList: data.rows,
        allCount: data.allCount,
        pageParams: {
          ...query,
          count: data.count, // 父评论层数
          nowPage: data.nowPage,
          lastPage: data.lastPage,
          pageSize: data.pageSize,
        },
      }
    } catch (err) {
      console.log(err)
    }
  },
  data() {
    return {
      imgCdnUrl,
      loadingStar: false,
      isLoading: false,
      isStar: false,
      // comment: "",
      content: null,
      articledata: null,
      commentList: [],
      count: '',
      query: {},
    }
  },
  head() {
    return {
      title: this.detail && this.detail.title + ' - 自然博客',
      meta: [{ hid: 'home', name: 'description', content: '自然 - 个人博客' }],
    }
  },
  computed: {
    frontendData() {
      return this.$store.state.app.frontendData.frontend
    },
    detail() {
      return this.$store.state.article.detail
    },
    // 如果直接使用userInfo(){}这种方式设置计算属性，get和set都会触发！
    // userInfo: {
    //   get() {
    //     console.log('触发了userInfo的get')
    //   },
    //   set() {
    //     console.log('触发了userInfo的set')
    //   },
    // },
    userInfo() {
      return this.$store.state.user.id
    },
  },
  watch: {
    userInfo(val) {
      this.getComment()
      this.getArticleDetail()
    },
  },
  created() {},
  mounted() {
    scrollTo({ top: 0 })
    this.renderTree()
  },
  destroyed() {
    this.$store.commit('article/changeShowCatalog', false)
    this.$store.commit('article/changeCatalogList', [])
  },
  methods: {
    // 文章详情
    async getArticleDetail() {
      await this.$store.dispatch('article/getArticleDetail', {
        id: this.$route.params.id,
      })
    },

    // 给文章点赞/取消点赞
    async starForArticle(type, article_id) {
      if (this.$store.state.user.token) {
        this.loadingStar = true
        if (type === 1) {
          const res = await this.$axios1.post(`/api/star/create`, {
            article_id,
            from_user_id: this.$store.state.user.id,
            comment_id: -1,
            to_user_id: -1,
          })
          this.$message.success({
            message: res.message,
          })
          setTimeout(() => {
            this.loadingStar = false
            this.getArticleDetail()
          }, 500)
        } else {
          const res = await this.$axios1.$delete(`/api/star/delete`, {
            data: {
              article_id,
              from_user_id: this.$store.state.user.id,
              comment_id: -1,
              to_user_id: -1,
            },
          })
          this.$message.success({
            message: res.message,
          })
          setTimeout(() => {
            this.loadingStar = false
            this.getArticleDetail()
          }, 500)
        }
      } else {
        this.$newmessage('暂未登录，请登录！', 'warning')
      }
    },

    // 获取子评论分页
    async childrenPage(query) {
      // async childrenPage(childrenCommentId) {
      query.childrenNowPage += 1
      const temp = {
        ...this.pageParams,
        ...query,
      }
      this.pageParams = temp
      // query.childrenCommentId = childrenCommentId;
      const data = await this.$axios1.get(`/api/comment/comment_children`, {
        params: { ...this.pageParams },
      })
      this.commentList.forEach((item) => {
        if (item.id === data.to_comment_id) {
          item.childrenNowPage = data.childrenNowPage
          item.childrenLastPage = data.childrenLastPage
          item.calcSurplus =
            data.count - data.childrenNowPage * data.childrenPageSize
          item.p_comment.push(...data.rows)
        }
      })
    },

    // 获取父评论分页
    async parentPage(v) {
      const query = { ...this.query, ...v }
      query.nowPage += 1
      const data = await this.$axios1.get(`/api/comment/article`, {
        params: { ...query },
      })
      this.commentList.push(...data.rows)
      this.allCount = data.allCount
      this.pageParams = {
        ...this.query,
        count: data.count,
        nowPage: data.nowPage,
        lastPage: data.lastPage,
        pageSize: data.pageSize,
      }
    },
    // 格式化日期时间
    format(time) {
      return format(time)
    },
    // 提交留言
    async addcomment() {
      if (this.content != null && this.content.length >= 3) {
        if (this.$store.state.user.token) {
          const article_id = parseInt(this.$route.params.id)
          const from_user_id = parseInt(this.$store.state.user.id)
          const content = this.content
          const to_comment_id = -1
          const to_user_id = -1
          try {
            await this.$store.dispatch('comment/addComment', {
              id: null,
              article_id,
              from_user_id,
              content,
              to_comment_id,
              to_user_id,
            })
          } catch (err) {
            this.$newmessage('', 'error')
            return
          }
          this.$newmessage('发表成功！', 'success')
          this.getComment()
        } else {
          this.$newmessage('暂未登录，请登录！', 'warning')
        }
      } else {
        this.$newmessage('请输入三个字以上留言内容~', 'warning')
      }
    },
    // 留言列表
    async getComment() {
      const id = this.$route.params.id
      const query = {
        article_id: id,
        nowPage: 1,
        pageSize: 3,
        childrenNowPage: 1,
        childrenPageSize: 2,
      }

      try {
        this.isLoading = true
        const data = await this.$axios1.get(`/api/comment/article`, {
          params: { ...query },
        })
        setTimeout(() => {
          this.isLoading = false
          this.pageParams = {
            ...query,
            count: data.count, // 父评论层数
            nowPage: data.nowPage,
            lastPage: data.lastPage,
            pageSize: data.pageSize,
          }
          this.commentList = data.rows
          this.allCount = data.allCount
        }, 300)
      } catch (err) {
        console.log(err)
        this.isLoading = false
      }
    },
    async zan() {
      const res = await this.$axios1.get(
        `/api/star/articleStar?article_id=${this.$route.params.id}&from_user_id=${this.$store.state.user.id}`
      )
      if (res.result) {
        this.isStar = true
      } else {
        this.isStar = false
      }
    },
    renderTree() {
      const list = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6']
      const md = this.$refs['hss-md']?.$el.childNodes[0].childNodes || []
      const arr = []
      md.forEach((item) => {
        if (item.nodeType === 1 && list.includes(item.nodeName)) {
          const obj = {}
          obj.id =
            item.innerText.slice(0, 10) +
            '_' +
            Math.floor(Math.random() * 100 + 1)
          obj.type = item.nodeName
          obj.text = item.innerText
          // 创建一个a元素
          const ele1 = document.createElement('a')
          ele1.setAttribute('id', obj.id)
          item.appendChild(ele1)
          arr.push(obj)
        }
      })
      this.$store.commit('article/changeShowCatalog', true)
      this.$store.commit('article/changeCatalogList', arr)
    },
  },
}
</script>

<style lang="scss" scoped>
.desc-wrap {
  .summary {
    .user {
      img {
        width: 25px;
        height: 25px;
        border-radius: 50%;
      }
    }
  }
}
.content {
  padding: 30px;
  border-radius: 5px;
  background-color: white;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  .summary,
  .date {
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin: 0 auto;
    margin-bottom: 10px;
    width: 200px;
    font-size: 12px;
  }
}
</style>

<style scoped>
.avatar {
  margin-right: 5px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
}
.desc-wrap {
  padding-bottom: 10px;
}
</style>

<style>
.star {
  cursor: pointer;
}
.little-tag {
  display: inline-block;
  margin-right: 5px;
  padding: 0 5px;
  border-radius: 3px;
  background-color: #aaaaaa;
  color: white;
  text-align: center;
}
.img1 {
  width: 100%;
  height: 460px;
}
@media screen and (max-width: 540px) {
  .main {
    margin: 135px auto 0;
    padding: 0;
  }
  .content {
    padding: 0 10px;
  }
  .img1 {
    height: 200px;
  }
}
</style>
