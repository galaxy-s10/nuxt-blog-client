<template>
  <div class="history-wrap">
    <el-timeline>
      <el-timeline-item>
        <h1>目前一共{{ total }}篇文章</h1>
      </el-timeline-item>
      <template v-if="historyArticleList">
        <el-timeline-item
          v-for="(item, index) in historyArticleList"
          :key="index"
          :timestamp="item.created_at"
        >
          <a
            :href="'/article/' + item.id"
            class="a-link"
            @click="goArticle($event, item)"
          >
            <span> {{ item.title }} </span>
          </a>
        </el-timeline-item>
      </template>
    </el-timeline>

    <pagingCpt
      :count="total"
      :now-page="nowPage"
      :page-size="pageSize"
      @currentChange="currentChange"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';

// eslint-disable-next-line
import { Api } from '@/api';
import pagingCpt from '@/components/Paging/index.vue';

export default {
  components: {
    pagingCpt,
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
      const query = {
        nowPage: 1,
        pageSize: 20,
      };
      const { data } = await $myaxios.article.list({
        orderName: 'created_at',
        orderBy: 'desc',
        ...query,
      });
      return { ...query, historyArticleList: data.rows, total: data.total };
    } catch (error) {
      console.log(error);
    }
  },
  data() {
    return {};
  },
  head() {
    return {
      title: '归档 - Billd博客',
      meta: [
        {
          name: 'description',
          content: 'Billd博客 - 归档',
        },
        {
          name: 'keywords',
          content: 'Billd博客 - 归档',
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
  created() {},
  mounted() {},
  methods: {
    goArticle(e, article) {
      e.preventDefault();
      this.$myaxios.article.click(article?.id);
      this.$myaxios.buryingPoint.create({
        article_id: article?.id,
        user_id: this.userInfo?.id || -1,
        field_a: 'article',
        field_b: 'click',
        field_c: 'history',
        field_d: article?.title,
      });
      this.$router.push(`/article/${article?.id}`);
    },
    async currentChange(nowPage) {
      const { data } = await this.$myaxios.article.list({
        orderName: 'created_at',
        orderBy: 'desc',
        pageSize: this.pageSize,
        nowPage,
      });
      this.historyArticleList = data.rows;
      this.total = data.total;
    },
  },
};
</script>

<style lang="scss" scoped>
.history-wrap {
  .a-link {
    color: $theme-color5;
    text-decoration: none;
    // text-decoration: none;
    font-size: 18px;
    &:hover {
      color: $theme-color1;
    }
  }
}
</style>
