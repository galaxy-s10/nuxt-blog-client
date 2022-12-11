<template>
  <div class="tag-wrap">
    <div v-if="tagList">
      <div class="tag-info">
        <div
          v-for="item in tagList"
          :key="'tag-key-' + item.id"
          class="tag-item"
          :class="{ 'active-tag': currentTagId === item.id }"
          @click="getTagArticle(item.id)"
        >
          <a
            :href="'/tag/' + item.id"
            style="display: none"
          ></a>
          <span>{{ item.name }}</span>
          <span class="article-total">({{ item.article_total }})</span>
        </div>
      </div>
      <p class="desc">目前一共：{{ tagList.length }}个标签</p>

      <article
        v-for="item in articleList"
        :key="'article-key-' + item.id"
        class="article-item"
      >
        <div class="article-left">
          <nuxt-link
            v-if="item['head_img']"
            v-slot="{ navigate }"
            :to="`/article/${item.id}`"
            custom
          >
            <img
              v-lazy="item['head_img']"
              class="head-img"
              alt=""
              @click="navigate"
            />
          </nuxt-link>
          <nuxt-link
            v-else
            v-slot="{ navigate }"
            :to="`/article/${item.id}`"
            custom
          >
            <div
              class="head-img"
              @click="navigate"
            >
              <NoHeadImgCpt></NoHeadImgCpt>
            </div>
          </nuxt-link>
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
            <span>{{ item.click }}浏览</span>
            <span class="jgh"></span>
            <span>{{ item.comment_total }}评论</span>
            <span class="jgh"></span>
            <div>{{ item.star_total }}star</div>
          </div>
        </div>
      </article>
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
            >下一页</el-button
          >
        </div>
      </div>
      <div
        v-else
        class="no-data"
      >
        {{ currentTagName }}标签下暂无文章~
      </div>
    </div>
    <div
      v-else
      class="no-data"
    >
      暂无标签~
    </div>
  </div>
</template>

<script>
import NoHeadImgCpt from 'components/NoHeadImg/index.vue';

import { init } from '@/mixin/init';

export default {
  components: { NoHeadImgCpt },
  mixins: [init],
  layout: 'blog',
  async asyncData({ $myaxios, store, params }) {
    const articleListParams = {
      nowPage: 1,
      pageSize: 3,
    };
    const tagId = params.id;
    try {
      const { data: tagData } = await $myaxios.get(`/tag/list`);
      const { data: articleData } = await $myaxios.get(
        `/tag/article_list/${tagId}`,
        {
          params: articleListParams,
        }
      );

      return {
        articleListParams,
        currentTagId: +tagId,
        articleList: articleData.rows,
        hasMore: articleData.hasMore,
        total: articleData.total,
        tagList: tagData.rows,
      };
    } catch (error) {
      console.log(error);
    }
  },
  data() {
    return {
      currentTagId: 1,
      currentTagName: '',
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
      title: `标签 - ${title} - 自然博客`,
      meta: [
        {
          name: 'description',
          content: '自然博客 - 标签',
        },
        {
          name: 'keywords',
          content: '自然博客 - 标签',
        },
      ],
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // 获取当前标签下的文章
    async getArticleList() {
      const tagId = this.$route.params.id;
      this.currentTagId = +tagId;
      try {
        const { data } = await this.$myaxios.get(`/tag/article_list/${tagId}`, {
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
        const { data } = await this.$myaxios.get(
          `/tag/article_list/${this.currentTagId}`,
          {
            params: this.articleListParams,
          }
        );
        this.articleList = data.rows;
        this.total = data.total;
        this.hasMore = data.hasMore;
        scrollTo({ top: 0 });
      } catch (error) {
        console.log(error);
      }
    },
    getTagArticle(id) {
      this.$router.push({ path: `/tag/${id}` });
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
      height: 100%;
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
