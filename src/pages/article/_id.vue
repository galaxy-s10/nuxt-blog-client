<template>
  <div class="article-detail-wrap">
    <ModalCpt
      :visiable.sync="rewardModal"
      class="reward-modal-wrap"
      :title="'打赏'"
      :top="'30%'"
    >
      <template #content>
        <div class="reward-content">
          <div class="item">
            <img
              src="@/assets/img/wechat_reward.webp"
              alt=""
            />
            <p>微信</p>
          </div>
          <div class="item">
            <img
              src="@/assets/img/zhifubao_reward.webp"
              alt=""
            />
            <p>支付宝</p>
          </div>
        </div>
      </template>
      <template #footer>
        <p>谢谢，距离买房又近了一步~</p>
      </template>
    </ModalCpt>

    <template v-if="detail">
      <div class="article-suspended-panel-wrap">
        <div class="article-suspended-panel">
          <div
            class="panel-btn"
            @click="showRewardModal"
          >
            <span class="reward">赏</span>
          </div>
          <div
            v-loading="starLoaing"
            element-loading-background="rgba(0, 0, 0, 0)"
            class="panel-btn"
            @click="starForArticle(detail.is_star || isStar ? 0 : 1, detail)"
          >
            <i
              :class="{
                [detail.is_star || isStar
                  ? 'el-icon-star-on'
                  : 'el-icon-star-off']: true,
                ico: true,
                rotate: true,
              }"
            ></i>
            <span
              v-if="detail.star_info.count"
              class="badge"
            >
              {{ detail.star_info.count }}
            </span>
          </div>

          <a
            href="#comment-anchor"
            class="comment-anchor-a"
          >
            <div
              class="panel-btn"
              @click="jumpToComment"
            >
              <i class="el-icon-chat-dot-round ico"></i>
              <span
                v-if="detail.comment_total"
                class="badge"
              >
                {{ detail.comment_total }}
              </span>
            </div>
          </a>
        </div>
      </div>

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
          <span
            v-if="detail.types[0]"
            class="type"
          >
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
            {{ detail.star_info.count }}
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

      <RenderMarkdownCpt
        ref="hss-md"
        :md="detail.content"
      ></RenderMarkdownCpt>

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

      <div
        v-if="detail.star_info.rows.length"
        class="star-wrap"
      >
        最近他们赞了该文章：
        <AvatarGroupCpt
          class="avatar-list"
          :list="detail.star_info.rows.slice(0, 10)"
        ></AvatarGroupCpt>
      </div>

      <p class="last-update">
        最后更新于：{{ detail.updated_at | formatDate }}
      </p>

      <div class="comment-wrap">
        <div id="comment-anchor"></div>
        <div v-if="detail.is_comment === 1">
          <el-divider>欢迎评论留言~</el-divider>
          <div>
            <AsyncTextareaInputCpt @contentChange="contentChange">
            </AsyncTextareaInputCpt>
            <div class="btn">
              <div class="err">{{ errMsg }}</div>
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
    </template>
    <div v-else>找不到该文章</div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

// eslint-disable-next-line
import { Api } from '@/api';
import AvatarGroupCpt from '@/components/AvatarGroup/index.vue';
import CommentCpt from '@/components/Comment/index.vue';
import ModalCpt from '@/components/Modal/index.vue';
import RenderMarkdownCpt from '@/components/RenderMarkdown/index.vue';

export default {
  components: {
    // CommentCpt: () => import('@/components/Comment'),
    CommentCpt,
    ModalCpt,
    AsyncTextareaInputCpt: () => import('@/components/TextareaInput/index.vue'),
    RenderMarkdownCpt, // 这个组件不能写成异步组件，否则下面的mounted钩子里面的renderCatalog方法获取的ref就是undefined
    AvatarGroupCpt,
  },
  layout: 'blog',
  /**
   * @typedef {Object} asyncDataType
   * @property {Api} $myaxios
   * @property {Object} store
   * @property {Object} params
   * @property {Object} req
   * @param {asyncDataType} value
   * https://nuxtjs.org/docs/concepts/context-helpers
   */
  async asyncData({ $myaxios, store, params, req }) {
    try {
      const articleId = params.id;
      const { data } = await $myaxios.article.find(articleId);
      let commentData = {};
      let commentParams = {};
      const orderName = 'created_at';
      if (data?.is_comment === 1) {
        commentParams = {
          article_id: articleId,
          nowPage: 1, // 当前父评论页数
          pageSize: 2, // 当前父评论分页大小
          childrenPageSize: store.state.comment.childrenPageSize, // 当前子评论分页大小
          orderName,
          orderBy: 'desc',
        };
        const result = await $myaxios.comment.comment(commentParams);
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
      isStar: false, // 是否已经点赞了
      rewardModal: false,
      detail: null,
      errMsg: '',
    };
  },
  head() {
    return {
      title: this.detail && `${this.detail.title} - Billd博客`,
      meta: [
        {
          name: 'description',
          content: 'Billd博客 - 文章',
        },
        {
          name: 'keywords',
          content: 'Billd博客 - 文章',
        },
      ],
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
      this.refreshStar();
    },
  },
  created() {},
  mounted() {
    window.scrollTo({ top: 0 });
    this.$store.commit('app/setShowCatalog', true);
    if (this.$refs['hss-md']?.$el) {
      this.renderCatalog();
    }
    const articleId = this.$route.params.id;
    this.articleId = articleId;
    if (
      this.detail?.star_info.rows.includes((v) => v.id === this.userInfo.id)
    ) {
      this.isStar = true;
    }
  },
  destroyed() {
    this.$store.commit('app/setShowCatalog', false);
    this.$store.commit('article/changeCatalogList', []);
  },
  methods: {
    ...mapMutations({
      setShowLoginModal: 'app/setShowLoginModal',
    }),
    jumpToComment() {
      // const el = document.querySelector('#comment-anchor');
      // window.scrollTo({
      //   top: el.offsetTop,
      // });
    },
    refreshStar() {
      const res = this.detail.star_info.rows.find((v) => {
        return v.id === this.userInfo.id;
      });
      this.isStar = res;
    },
    showRewardModal() {
      this.$newmessage('谢谢老板！', 'success');
      this.rewardModal = true;
    },
    async getArticleDetail() {
      try {
        const { data } = await this.$myaxios.article.find(this.articleId);
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
        const { data } = await this.$myaxios.comment.comment(query);
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
        const { data } = await this.$myaxios.comment.commentChildren({
          parent_comment_id: query.parent_comment_id,
          article_id: query.article_id,
          pageSize: query.childrenPageSize,
          childrenPageSize: this.childrenPageSize,
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
        const { data } = await this.$myaxios.comment.comment({
          article_id: this.articleId,
          nowPage: query.nowPage + 1,
          pageSize: this.pageSize,
          childrenPageSize: this.childrenPageSize,
          orderName: query.orderName,
          orderBy: query.orderBy,
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
        this.setShowLoginModal(true);
        this.$newmessage('暂未登录，请登录！', 'warning');
        return;
      }
      if (this.commentContent.length < 2) {
        this.errMsg = '评论内容至少2个字符~';
        this.$newmessage(this.errMsg, 'warning');
        return;
      }
      this.errMsg = '';
      try {
        this.submitCommentLoading = true;
        await this.$myaxios.comment.create({
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

    /** type:1给文章点赞,type:0取消点赞 */
    async starForArticle(type, articleDetail) {
      try {
        if (this.userInfo) {
          this.starLoaing = true;
          if (type === 1) {
            await this.$myaxios.star.create({
              article_id: articleDetail.id,
              from_user_id: this.userInfo.id,
              comment_id: -1,
              to_user_id: -1,
            });
            this.$newmessage('点赞成功！', 'success');
            await this.getArticleDetail();
            this.starLoaing = false;
          } else {
            await this.$myaxios.star.delete(
              articleDetail.is_star_id || this.isStar.star_id
            );
            this.isStar = false;
            await this.getArticleDetail();
            this.$newmessage('取消点赞成功！', 'success');
            this.starLoaing = false;
          }
        } else {
          this.setShowLoginModal(true);
          this.$newmessage('暂未登录，请登录！', 'warning');
        }
      } catch (error) {
        console.log(error);
      }
    },

    // 渲染文章目录
    renderCatalog() {
      // this.$nextTick(() => {
      // vue.runtime.min.js:6 DOMException: Failed to execute 'appendChild' on 'Node': This node type does not support this method.
      // https://blog.lichter.io/posts/vue-hydration-error/
      // https://github.com/nuxt/nuxt.js/issues/5612
      const list = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'];
      const md =
        this.$refs['hss-md'].$el.childNodes[0].childNodes[0].children || [];
      const arr = [];
      for (let i = 0; i < md.length; i += 1) {
        const item = md[i];
        if (item.nodeType === 1 && list.includes(item.nodeName)) {
          const obj = {};
          obj.id = `heading-${i}`;
          obj.type = item.nodeName;
          obj.text = item.innerText;
          try {
            // 创建一个a元素
            const el = document.createElement('a');
            el.style.position = 'relative';
            el.style.top = '-50px';
            el.setAttribute('id', obj.id);
            item.appendChild(el);
          } catch (error) {
            console.log(error);
          }
          arr.push(obj);
        }
      }
      if (window.location.hash) {
        setTimeout(() => {
          window.location.href = window.location.hash;
        }, 0);
      }
      this.$store.commit('article/changeCatalogList', arr);
      // });
    },
  },
};
</script>

<style lang="scss" scoped>
@media screen and (max-width: 540px) {
  .main {
    margin: 135px auto 0;
    padding: 0;
  }
  .content {
    padding: 0 10px;
  }
}
.article-detail-wrap {
  // 加这个transform: none;的作用主要是因为article-suspended-panel使用了fixed，如果的它的祖先元素的transform非none，就会fixed就会失效
  // 因为layout里面使用了transition组件，里面自定义了v-enter，使用了transform，因此如果article-suspended-panel的父级没有设置transform: none;就会使用找到
  // 祖先v-enter的transform，就会导致fixed定位失效，因此这里使用transform: none;覆盖掉v-enter的v-enter的transform
  // transform: none; //在这里设置的话，会覆盖掉v-enter的v-enter的transform，缺点就是因为这一个none导致了整个dom都没有这个transform,
  // FIX: 将v-enter的transform:translate(-10px)替换margin-left，这样就不会有fixed问题
  .article-suspended-panel-wrap {
    // transform: none; //这里设置的话没用，因为是根据祖先的transform定位
    .article-suspended-panel {
      position: fixed;
      top: 250px;
      margin-left: -100px;
      .comment-anchor-a {
        color: inherit;
        text-decoration: none;
      }
      .panel-btn {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 30px;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background-color: #fff;
        background-position: 50%;
        background-repeat: no-repeat;
        box-shadow: 0 2px 4px 0 rgb(0 0 0 / 4%);
        color: inherit;
        text-align: center;
        text-decoration: none;
        cursor: pointer;
        @keyframes rotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        &:hover {
          .rotate {
            animation: rotate 2s infinite linear;
          }
        }
        .reward {
          color: gold;
          font-size: 22px;
        }
        .ico {
          font-size: 22px;
        }
        .badge {
          position: absolute;
          top: 0;
          right: -5px;
          padding: 0 5px;
          border-radius: 10px;
          background-color: #c2c8d1;
          color: white;
          font-size: 13px;
        }
      }
    }
  }

  .reward-modal-wrap {
    .reward-content {
      display: flex;
      justify-content: space-around;
      .item {
        text-align: center;
        img {
          width: 200px;
          height: 200px;
        }
      }
    }
    :deep(.footer) {
      margin: 0;
      padding: 0;
      text-align: center;
    }
  }

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
    #comment-anchor {
      position: relative;
      top: -50px;
    }
    .btn {
      .err {
        color: $theme-color7;
      }
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 20px;
    }
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
