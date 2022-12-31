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
          <nuxt-link
            :to="'/article/' + item.id"
            class="a-link"
          >
            <span> {{ item.title }} </span>
          </nuxt-link>
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
    const query = {
      nowPage: 1,
      pageSize: 20,
    };
    const { data } = await $myaxios.article.list({
      params: {
        orderName: 'created_at',
        orderBy: 'desc',
        ...query,
      },
    });
    return { ...query, historyArticleList: data.rows, total: data.total };
  },
  data() {
    return {};
  },
  head() {
    return {
      title: '归档 - 自然博客',
      meta: [
        {
          name: 'description',
          content: '自然博客 - 归档',
        },
        {
          name: 'keywords',
          content: '自然博客 - 归档',
        },
      ],
    };
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
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
    // text-decoration: none;
    font-size: 18px;
    text-decoration: none;
    &:hover {
      color: $theme-color1;
    }
  }
}
</style>
