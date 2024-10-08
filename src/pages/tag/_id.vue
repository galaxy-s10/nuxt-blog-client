<template>
  <div class="tag-wrap">
    <a
      v-for="item in articleList"
      :key="'article-key-' + item.id"
      :href="`/article/${item.id}`"
      class="a-css"
      @click="goArticle($event, item)"
    >
      <article class="article-item">
        <div class="article-left">
          <div
            v-if="item.head_img"
            v-lazy:background-image="item.head_img"
            class="head-img"
          ></div>
          <div
            v-else
            class="head-img"
          >
            <NoHeadImgCpt></NoHeadImgCpt>
          </div>
        </div>

        <div class="article-right">
          <nuxt-link
            :to="'/article/' + item.id"
            class="article-right-txt"
          >
            {{ item.title }}
          </nuxt-link>
          <el-divider></el-divider>
          <el-tag
            v-for="tagItem in item.tags"
            :key="'article-tag-key-' + tagItem.id"
            class="overwrite-el-tag"
            size="mini"
            :disable-transitions="false"
            :color="tagItem.color"
            >{{ tagItem.name }}</el-tag
          >
          <div class="summary">
            <img
              class="user-avatar"
              :src="item.users[0] && item.users[0].avatar"
              alt=""
            />
            <span class="jgh"></span>
            <span>{{ item.created_at | convertDate }}</span>
            <span class="jgh"></span>
            <span>{{ item.visit }}浏览</span>
            <span class="jgh"></span>
            <span>{{ item.comment_total }}评论</span>
            <span class="jgh"></span>
            <div>{{ item.star_total }}star</div>
          </div>
        </div>
      </article>
    </a>
    <div
      v-if="total"
      class="page-btn"
    >
      <div>
        <el-button
          v-show="articleListParams && articleListParams.nowPage !== 1"
          @click="handlePage('prev')"
        >
          上一页
        </el-button>
      </div>
      <div>
        <el-button
          v-show="hasMore"
          @click="handlePage('next')"
        >
          下一页
        </el-button>
      </div>
    </div>
    <div v-else>该标签暂无文章</div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

// eslint-disable-next-line
import { Api } from '@/api';
import NoHeadImgCpt from '@/components/NoHeadImg/index.vue';

export default {
  components: { NoHeadImgCpt },
  layout: 'blog',
  props: {
    tagId: {
      type: Number,
      default: -1,
    },
  },
  /**
   * @typedef {Object} asyncDataType
   * @property {Api} $myaxios
   * @property {Object} store
   * @property {Object} params
   * @property {Object} req
   * @param {asyncDataType} value
   * https://nuxtjs.org/docs/concepts/context-helpers
   */
  async asyncData({ $myaxios, store, params, req, route, query, props }) {
    try {
      const tagId = params.id;
      if (tagId === undefined) return;
      const articleListParams = {
        nowPage: 1,
        pageSize: 3,
      };
      let articleData;
      if (tagId !== undefined) {
        const { data } = await $myaxios.tag.articleList({
          tagId,
          params: articleListParams,
        });
        articleData = data;
      }
      return {
        articleListParams,
        currentTagId: +tagId,
        articleList: articleData.rows,
        hasMore: articleData.hasMore,
        total: articleData.total,
      };
    } catch (error) {
      console.log(error);
    }
  },
  data() {
    return {
      currentTagName: '',
      articleList: [],
      articleListParams: { nowPage: 1, pageSize: 3 },
      total: 0,
      hasMore: false,
      currentTagId: -1,
    };
  },
  head() {
    let title = '';
    this.tagList?.forEach((item) => {
      if (item.id === this.currentTagId) {
        title = item.name;
      }
    });
    return {
      title: `标签 - ${title} - Billd博客`,
      meta: [
        {
          name: 'description',
          content: 'Billd博客 - 标签',
        },
        {
          name: 'keywords',
          content: 'Billd博客 - 标签',
        },
      ],
    };
  },
  computed: {
    ...mapState({
      userInfo(state) {
        return state.user.userInfo;
      },
    }),
  },
  watch: {},
  created() {},
  mounted() {
    this.getArticleList();
  },
  methods: {
    goArticle(e, article) {
      e.preventDefault();
      this.$myaxios.article.click(article?.id);
      this.$myaxios.buryingPoint.create({
        article_id: article?.id,
        user_id: this.userInfo?.id || -1,
        field_a: 'article',
        field_b: 'click',
        field_c: 'tag',
        field_d: article?.title,
      });
      this.$router.push(`/article/${article?.id}`);
    },
    // 获取当前标签下的文章
    async getArticleList() {
      const tagId = this.$props.tagId;
      this.currentTagId = +tagId;
      if (tagId === -1) {
        return;
      }
      try {
        const { data } = await this.$myaxios.tag.articleList({
          tagId,
          params: this.articleListParams,
        });
        this.articleList = data.rows;
        this.hasMore = data.hasMore;
        this.total = data.total;
      } catch (error) {
        console.log(error);
      }
    },
    async handlePage(type) {
      if (type === 'prev') {
        this.articleListParams.nowPage -= 1;
      } else {
        this.articleListParams.nowPage += 1;
      }
      try {
        const { data } = await this.$myaxios.tag.articleList({
          tagId: this.currentTagId,
          params: this.articleListParams,
        });
        this.articleList = data.rows;
        this.total = data.total;
        this.hasMore = data.hasMore;
        scrollTo({ top: 0 });
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
/* 响应式布局 - 小于 540px */
@media screen and (max-width: 540px) {
  .tag-info {
    font-size: 13px;
    .tag-item {
      margin: 8px 6px !important;
    }
  }
  .article-item {
    flex-wrap: wrap;

    .article-left {
      flex: auto !important;
      width: 100%;
    }
    .article-right {
      padding: 10px 20px !important;
    }
  }
}
.tag-wrap {
  .tag-info {
    overflow-y: scroll;
    margin-bottom: 10px;
    height: 180px;
    .tag-item {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: space-between;
      margin: 10px;
      padding: 0 10px;
      height: 30px;
      border: 1px solid rgba(93, 121, 148, 0.15);
      border-radius: 3px;
      background-color: white;

      &:hover {
        cursor: pointer;
      }
      &::after {
        position: absolute;
        top: 50%;
        left: -1px;
        width: 8px;
        height: 8px;
        border-width: 0 0 1px 1px;
        border-style: solid;
        border-color: inherit;
        background-color: inherit;
        content: '';
        transform: translateX(-50%) translateY(-50%) rotate(45deg);
      }
      .article-total {
        margin-left: 6px;
      }
      &.active-tag {
        border: 1px solid #005cc5 !important;
      }
    }
  }
  .desc {
    text-align: right;
  }
  .no-data {
    padding: 40px 0;
    text-align: center;
  }
}
.page-btn {
  display: flex;
  justify-content: space-between;
}

.a-css {
  display: block;
  color: inherit;
  text-decoration: none;
}
.article-item {
  display: flex;
  margin-bottom: 15px;
  width: 100%;
  border-radius: 5px;
  background: white;

  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.05);
  .article-left {
    overflow: hidden;
    flex: 0 0 40%;
    margin: 20px;

    .head-img {
      width: 100%;
      height: 200px;
      background-position: 50% 50%;
      background-size: cover;
      background-repeat: no-repeat;
      cursor: pointer;
      transition: all 0.3s;
      &:hover {
        transform: scale(1.1);
      }
    }
  }
  .article-right {
    overflow: hidden;
    box-sizing: border-box;
    padding: 30px;
    .article-right-txt {
      color: $theme-color5;
      text-decoration: none;

      @extend %singleEllipsis;
    }
    .summary {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 10px 0;
      font-size: 12px;
      .user-avatar {
        width: 20px;
        height: 20px;
        border-radius: 50%;
      }
    }
  }
}

.jgh::after {
  padding: 0 5px;
  content: '·';
  font-weight: 600;
}

.overwrite-el-tag {
  margin-right: 10px;
  color: white;
}
</style>
