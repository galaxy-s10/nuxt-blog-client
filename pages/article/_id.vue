<template>
  <div class="article-detail-wrap">
    <h1 class="title">
      {{ detail.title }}
    </h1>

    <div class="summary-wrap">
      <div class="summary">
        <img
          v-if="detail.users[0]"
          class="user-avatar"
          :src="detail.users[0].avatar"
          alt=""
        />
        <span v-if="detail.types[0]" class="type">
          <i class="el-icon-folder-opened"></i>
          {{ detail.types[0].name }}
        </span>
        <span>
          <i class="el-icon-chat-line-round"></i>
          {{ detail.comment_total || 0 }}
        </span>
        <span>
          <i class="el-icon-view"></i>
          {{ detail.click }}
        </span>
        <span>
          <i class="el-icon-star-on"></i>
          {{ detail.star_total }}
        </span>
      </div>
      <div class="date">
        <span>发表于: {{ detail.created_at | formatDate }}</span>
      </div>
    </div>

    <img
      v-if="detail['head_img']"
      v-lazy="IMG_CDN_URL + detail['head_img']"
      class="head-img"
    />
    <img v-else src="@/assets/img/nopic.png" class="head-img" alt />

    <p class="desc">简介: {{ detail.desc || '暂无~' }}</p>

    <RenderMarkdownCpt ref="hss-md" :md="detail.content"></RenderMarkdownCpt>

    <div class="tag-list">
      <span class="el-icon-collection-tag"></span>
      <div v-if="detail.tags.length">
        <el-tag
          v-for="item in detail.tags"
          :key="item.id"
          class="hss-el-tag"
          :color="item.color"
          size="mini"
        >
          {{ item.name }}
        </el-tag>
      </div>
      <span v-else>该文章没有关联标签~</span>
    </div>

    <p class="star-wrap">
      <span v-if="detail.is_star === 1">
        <el-tooltip
          class="item"
          effect="dark"
          content="取消点赞"
          placement="top"
          @click.native="starForArticle(0, detail.id)"
        >
          <i class="el-icon-star-on"></i>
        </el-tooltip>
      </span>
      <span v-else>
        如果本文章对你有所帮助，欢迎点赞~
        <el-tooltip
          class="item"
          effect="dark"
          content="赞一个"
          placement="top"
          @click.native="starForArticle(1, detail.id)"
        >
          <i class="el-icon-star-off"></i>
        </el-tooltip>
      </span>
      {{ detail.star_total }}
    </p>

    <p class="last-update">最后更新于：{{ detail.updated_at | formatDate }}</p>

    <div class="comment-wrap">
      <div v-if="detail.is_comment">
        <el-divider>欢迎评论留言~</el-divider>
        <div>
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
      </div>
      <el-divider v-else>该文章暂未开启评论~</el-divider>
    </div>
  </div>
</template>

<script>
import CommentCpt from '@/components/Comment'
import RenderMarkdownCpt from '@/components/RenderMarkdown'
import TextareaInputCpt from '@/components/TextareaInput'
import { IMG_CDN_URL } from '@/constant'

export default {
  components: {
    CommentCpt,
    RenderMarkdownCpt,
    TextareaInputCpt,
  },
  layout: 'blog',
  async asyncData({ $axios1, params, store }) {
    try {
      const articleId = params.id
      const { data } = await $axios1.get(`/article/find/${articleId}`)
      const orderName = 'created_at'
      const commentParams = {
        article_id: articleId,
        nowPage: store.state.comment.nowPage, // 当前父评论页数
        pageSize: store.state.comment.pageSize, // 当前父评论分页大小
        childrenPageSize: store.state.comment.childrenPageSize, // 当前子评论分页大小
        orderName,
        orderBy: 'desc',
      }
      const { data: commentData } = await $axios1.get(`/comment/comment`, {
        params: commentParams,
      })
      store.commit('app/setShowCatalog', true)
      return {
        sort: orderName === 'created_at' ? 'date' : 'hot',
        commentList: commentData.rows,
        total: commentData.total,
        hasMore: commentData.hasMore,
        detail: data,
        ...commentParams,
      }
    } catch (error) {
      console.log(error)
    }
  },
  data() {
    return {
      submitCommentLoading: false,
      IMG_CDN_URL,
      loadingStar: false,
      isLoading: false,
      commentContent: '',
    }
  },
  head() {
    return {
      title: this.detail && this.detail.title + ' - 自然博客',
      meta: [{ hid: 'home', name: 'description', content: '自然 - 个人博客' }],
    }
  },
  computed: {
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
      return this.$store.state.user.userInfo
    },
  },
  watch: {
    userInfo() {
      this.refreshCommentList()
    },
  },
  created() {},
  mounted() {
    window.scrollTo({ top: 0 })
    this.renderCatalog()
  },
  destroyed() {
    this.$store.commit('app/setShowCatalog', false)
    this.$store.commit('article/changeCatalogList', [])
  },
  methods: {
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
        article_id: this.detail.id,
        nowPage: 1,
        pageSize: 3,
        childrenPageSize: this.childrenPageSize,
        orderName: this.sort === 'date' ? 'created_at' : 'star_total',
        orderBy: 'desc',
      }
      try {
        this.isLoading = true
        const { data } = await this.$axios1.get(`/comment/comment`, {
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
      try {
        const { data } = await this.$axios1.get(`/comment/comment_children`, {
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
      } catch (error) {
        console.log(error)
      }
    },
    // 获取父评论分页
    async handleParentPage(query) {
      try {
        const { data } = await this.$axios1.get(`/comment/comment`, {
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
      } catch (error) {
        console.log(error)
      }
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
        await this.$axios1.post('/comment/create', {
          article_id: this.detail.id,
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
    contentChange(newVal, oldVal) {
      this.commentContent = newVal
    },

    // 给文章点赞/取消点赞
    async starForArticle(type, articleId) {
      if (this.userInfo) {
        this.loadingStar = true
        if (type === 1) {
          const { data } = await this.$axios1.post(`/star/create`, {
            article_id: articleId,
            from_user_id: this.userInfo.id,
            comment_id: -1,
            to_user_id: -1,
          })
          this.$newmessage(data.message, 'success')
          setTimeout(() => {
            this.loadingStar = false
            this.getArticleDetail()
          }, 500)
        } else {
          const { data } = await this.$axios1.$delete(`/star/delete`, {
            article_id: articleId,
            from_user_id: this.userInfo.id,
            comment_id: -1,
            to_user_id: -1,
          })
          this.$newmessage(data.message, 'success')
          setTimeout(() => {
            this.loadingStar = false
            this.getArticleDetail()
          }, 500)
        }
      } else {
        this.$newmessage('暂未登录，请登录！', 'warning')
      }
    },

    // 渲染文章目录
    renderCatalog() {
      const list = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6']
      const md = this.$refs['hss-md']?.$el.childNodes || []
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
      this.$store.commit('article/changeCatalogList', arr)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/constant.scss';

.article-detail-wrap {
  overflow: hidden;
  padding: 10px 20px;
  border: 1px solid $theme-color4;
  border-radius: 5px;
  background-color: $theme-color6;
  .title {
    text-align: center;
  }
  .summary-wrap {
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
    .summary {
      .user-avatar {
        width: 25px;
        height: 25px;
        border-radius: 50%;
      }
    }
  }

  .tag-list {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin: 10px 0;
    .el-icon-collection-tag {
      font-size: 18px;
    }
    .hss-el-tag {
      margin: 4px;
      border: none;
      color: $theme-color6;
    }
  }
  .last-update {
    text-align: right;
  }
  .comment-wrap {
    .btn {
      margin-top: 20px;
      text-align: right;
    }
  }
}
</style>

<style lang="scss" scoped>
@import '@/assets/css/constant.scss';
@media screen and (max-width: 540px) {
  .main {
    margin: 135px auto 0;
    padding: 0;
  }
  .content {
    padding: 0 10px;
  }
  .head-img {
    height: 200px;
  }
}
.avatar {
  margin-right: 5px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
}
.desc-wrap {
  padding-bottom: 10px;
}
.star {
  cursor: pointer;
}
.little-tag {
  display: inline-block;
  margin-right: 5px;
  padding: 0 5px;
  border-radius: 3px;
  background-color: #aaaaaa;
  color: $theme-color6;
  text-align: center;
}
.head-img {
  max-height: 500px;
  width: 100%;
}
</style>
