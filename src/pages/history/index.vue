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
          <nuxt-link v-slot="{ navigate }" :to="'/article/' + item.id" custom>
            <span class="a-link" @click="navigate"> {{ item.title }} </span>
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
import pagingCpt from 'components/Paging/index.vue';

import { init } from '@/mixin/init';

export default {
  components: {
    pagingCpt,
  },
  mixins: [init],
  layout: 'blog',
  async asyncData({ $myaxios, store, params }) {
    const query = {
      nowPage: 1,
      pageSize: 20,
    };
    const { data } = await $myaxios.get(`/article/list`, {
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
          hid: 'description',
          name: 'description',
          content: 'Natural Blog - History',
        },
      ],
    };
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    async currentChange(nowPage) {
      const { data } = await this.$myaxios.get(`/article/list`, {
        params: {
          orderName: 'created_at',
          orderBy: 'desc',
          pageSize: this.pageSize,
          nowPage,
        },
      });
      this.historyArticleList = data.rows;
      this.total = data.total;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/css/constant.scss';

.history-wrap {
  .a-link {
    color: $theme-color5;
    // text-decoration: none;
    font-size: 18px;
    cursor: pointer;
    &:hover {
      color: $theme-color1;
    }
  }
}
</style>
