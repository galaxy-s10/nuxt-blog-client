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
      v-lazy="detail['head_img']"
      class="head-img"
    />
    <div v-else></div>

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

    <div class="star-wrap">
      如果本文章对你有所帮助，欢迎点赞~
      <div class="icon">
        <span v-if="detail.is_star" v-loading="starLoaing">
          <el-tooltip
            class="item"
            effect="dark"
            content="取消点赞"
            placement="top"
            @click.native="starForArticle(0, detail)"
          >
            <i class="el-icon-star-on"></i>
          </el-tooltip>
        </span>
        <span v-else>
          <el-tooltip
            class="item"
            effect="dark"
            content="赞一个"
            placement="top"
            @click.native="starForArticle(1, detail)"
          >
            <i class="el-icon-star-off"></i>
          </el-tooltip>
        </span>
        {{ detail.star_info.count }}
      </div>
      <AvatarGroupCpt
        class="avatar-list"
        :list="detail.star_info.rows"
      ></AvatarGroupCpt>
    </div>

    <p class="last-update">最后更新于：{{ detail.updated_at | formatDate }}</p>

    <div class="comment-wrap">
      <div v-if="detail.is_comment === 1">
        <el-divider>欢迎评论留言~</el-divider>
        <div>
          <AsyncTextareaInputCpt @contentChange="contentChange">
          </AsyncTextareaInputCpt>
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
import AvatarGroupCpt from 'components/AvatarGroup/index.vue';
import CommentCpt from 'components/Comment/index.vue';
import RenderMarkdownCpt from 'components/RenderMarkdown/index.vue';

import { init } from '@/mixin/init';

export default {
  components: {
    // CommentCpt: () => import('components/Comment'),
    CommentCpt,
    AsyncTextareaInputCpt: () => import('components/TextareaInput/index.vue'),
    RenderMarkdownCpt, // 这个组件不能写成异步组件，否则下面的mounted钩子里面的renderCatalog方法获取的ref就是undefined
    AvatarGroupCpt,
  },
  mixins: [init],
  layout: 'blog',
  async asyncData({ $myaxios, params, store }) {
    try {
      const articleId = params.id;
      const { data } = await $myaxios.get(`/article/find/${articleId}`);
      let commentData = {};
      let commentParams = {};
      const orderName = 'created_at';
      if (data.is_comment === 1) {
        commentParams = {
          article_id: articleId,
          nowPage: 1, // 当前父评论页数
          pageSize: 2, // 当前父评论分页大小
          childrenPageSize: store.state.comment.childrenPageSize, // 当前子评论分页大小
          orderName,
          orderBy: 'desc',
        };
        const result = await $myaxios.get(`/comment/comment`, {
          params: commentParams,
        });
        commentData = result.data;
      }
      return {
        sort: orderName === 'created_at' ? 'date' : 'hot',
        commentList: commentData.rows,
        total: commentData.total,
        hasMore: commentData.hasMore,
        detail: data,
        ...commentParams,
      };
    } catch (error) {
      console.log(error);
    }
  },
  data() {
    return {
      submitCommentLoading: false,
      starLoaing: false,
      isLoading: false,
      commentContent: '',
      articleId: undefined,
      nowPage: undefined,
      pageSize: undefined,
    };
  },
  head() {
    return {
      title: this.detail && `${this.detail.title} - 自然博客`,
      meta: [{ hid: 'home', name: 'description', content: '自然 - 个人博客' }],
    };
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
      return this.$store.state.user.userInfo;
    },
  },
  watch: {
    userInfo() {
      this.refreshCommentList();
    },
  },
  created() {},
  mounted() {
    window.scrollTo({ top: 0 });
    this.$store.commit('app/setShowCatalog', true);
    const timer = setInterval(() => {
      if (this.$refs['hss-md'].$el) {
        this.renderCatalog();
        clearInterval(timer);
      }
    }, 50);
    const articleId = this.$route.params.id;
    this.articleId = articleId;
  },
  destroyed() {
    this.$store.commit('app/setShowCatalog', false);
    this.$store.commit('article/changeCatalogList', []);
  },
  methods: {
    async getArticleDetail() {
      try {
        const { data } = await this.$myaxios.get(
          `/article/find/${this.articleId}`
        );
        this.detail = data;
      } catch (error) {
        console.log(error);
      }
    },
    sortChange(sort) {
      this.sort = sort;
      this.refreshCommentList();
    },
    deleteReply(item) {
      if (item.parent_comment_id !== -1) {
        for (let index = 0; index < this.commentList.length; index = 1) {
          const element = this.commentList[index];
          if (element.id === item.parent_comment_id) {
            for (
              let indey = 0;
              indey < element.children_comment.length;
              indey += 1
            ) {
              const child = element.children_comment[indey];
              if (child.id === item.id) {
                element.children_comment.splice(indey, 1);
                break;
              }
            }
          }
        }
      }
    },
    // 留言列表
    async refreshCommentList() {
      const query = {
        article_id: this.articleId,
        nowPage: this.nowPage,
        pageSize: this.pageSize,
        childrenPageSize: this.childrenPageSize,
        orderName: this.sort === 'date' ? 'created_at' : 'star_total',
        orderBy: 'desc',
      };
      try {
        this.isLoading = true;
        const { data } = await this.$myaxios.get(`/comment/comment`, {
          params: { ...query },
        });
        this.isLoading = false;
        this.commentList = data.rows;
        this.total = data.total;
        this.hasMore = data.hasMore;
      } catch (error) {
        console.log(error);
        this.isLoading = false;
      }
    },

    // 获取子评论分页
    async handleChildrenPage(query) {
      try {
        const { data } = await this.$myaxios.get(`/comment/comment_children`, {
          params: {
            parent_comment_id: query.parent_comment_id,
            article_id: query.article_id,
            pageSize: query.childrenPageSize,
            childrenPageSize: this.childrenPageSize,
          },
        });
        this.commentList.forEach((item) => {
          if (item.id === query.parent_comment_id) {
            item.children_comment.push(...data.rows);
          }
        });
      } catch (error) {
        console.log(error);
      }
    },
    // 获取父评论分页
    async handleParentPage(query) {
      try {
        const { data } = await this.$myaxios.get(`/comment/comment`, {
          params: {
            article_id: this.articleId,
            nowPage: query.nowPage + 1,
            pageSize: this.pageSize,
            childrenPageSize: this.childrenPageSize,
            orderName: query.orderName,
            orderBy: query.orderBy,
          },
        });
        this.commentList.push(...data.rows);
        this.hasMore = data.hasMore;
      } catch (error) {
        console.log(error);
      }
    },

    // 新增回复
    async addComment() {
      if (!this.$store.state.user.userInfo) {
        this.$newmessage('暂未登录，请登录！', 'warning');
        return;
      }
      if (this.commentContent.length < 5) {
        this.$newmessage('评论内容至少5个字符~', 'warning');
        return;
      }
      try {
        this.submitCommentLoading = true;
        await this.$myaxios.post('/comment/create', {
          article_id: this.detail.id,
          content: this.commentContent,
          parent_comment_id: -1,
          reply_comment_id: -1,
          to_user_id: -1,
        });
        this.submitCommentLoading = false;
        this.$newmessage('评论成功~', 'success');
        this.refreshCommentList();
      } catch (error) {
        console.log(error);
        this.submitCommentLoading = false;
      }
    },
    contentChange(newVal, oldVal) {
      this.commentContent = newVal;
    },

    // 给文章点赞/取消点赞
    async starForArticle(type, articleDetail) {
      try {
        if (this.userInfo) {
          this.starLoaing = true;
          if (type === 1) {
            await this.$myaxios.post(`/star/create`, {
              article_id: articleDetail.id,
              from_user_id: this.userInfo.id,
              comment_id: -1,
              to_user_id: -1,
            });
            this.$newmessage('点赞成功！', 'success');
            await this.getArticleDetail();
            this.starLoaing = false;
          } else {
            await this.$myaxios.$delete(
              `/star/delete/${articleDetail.is_star_id}`
            );
            await this.getArticleDetail();
            this.$newmessage('取消点赞成功!', 'success');
            this.starLoaing = false;
          }
        } else {
          this.$newmessage('暂未登录，请登录！', 'warning');
        }
      } catch (error) {
        console.log(error);
      }
    },

    // 渲染文章目录
    renderCatalog() {
      this.$nextTick(() => {
        // vue.runtime.min.js:6 DOMException: Failed to execute 'appendChild' on 'Node': This node type does not support this method.
        // https://blog.lichter.io/posts/vue-hydration-error/
        // https://github.com/nuxt/nuxt.js/issues/5612
        const list = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'];
        const md =
          this.$refs['hss-md']?.$el.childNodes[0].childNodes[0].children || [];
        const arr = [];
        for (let i = 0; i < md.length; i += 1) {
          const item = md[i];
          if (item.nodeType === 1 && list.includes(item.nodeName)) {
            const obj = {};
            obj.id = `${item.innerText.slice(0, 10)}_${Math.floor(
              Math.random() * 100 + 1
            )}`;
            obj.type = item.nodeName;
            obj.text = item.innerText;
            try {
              // 创建一个a元素
              const ele1 = document.createElement('div');
              ele1.setAttribute('id', obj.id);
              item.appendChild(ele1);
            } catch (err) {
              console.log(err);
            }

            arr.push(obj);
          }
        }
        this.$store.commit('article/changeCatalogList', arr);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/css/constant.scss';

.article-detail-wrap {
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
  .star-wrap {
    display: flex;
    align-items: center;
    min-height: 40px;
    .icon {
      margin-left: 5px;
      cursor: pointer;
    }
    .avatar-list {
      margin-left: 10px;
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
  width: 100%;
}
</style>
