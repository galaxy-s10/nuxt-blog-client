<template>
  <div class="tag-wrap">
    <div v-if="tagList.length">
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
    </div>
    <div
      v-else
      class="no-data"
    >
      暂无标签~
    </div>
    <nuxt-child v-if="tagList.length" />
  </div>
</template>

<script>
// eslint-disable-next-line
import { Api } from '@/api';

export default {
  components: {},
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
      const { data: tagData } = await $myaxios.tag.list({
        orderName: 'priority',
        orderBy: 'desc',
      });
      return {
        tagList: tagData.rows,
      };
    } catch (error) {
      console.log(error);
    }
  },
  data() {
    return {
      currentTagId: 1,
    };
  },
  head() {
    return {
      title: `标签 - Billd博客`,
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
  computed: {},
  watch: {},
  created() {},
  mounted() {
    if (this.tagList.length) {
      this.getTagArticle(this.tagList[0].id);
    }
  },
  methods: {
    getTagArticle(id) {
      console.log(id, 'iddd');
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
