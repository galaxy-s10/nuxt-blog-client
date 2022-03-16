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
          <router-link :to="'/article/' + item.id" class="a-link">
            {{ item.title }}
          </router-link>
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
import pagingCpt from '@/components/Paging'
export default {
  components: {
    pagingCpt,
  },
  layout: 'blog',
  async asyncData({ $axios1, store, params }) {
    const query = {
      nowPage: 1,
      pageSize: 20,
    }
    const { data } = await $axios1.get(`/api/article/list`, {
      params: {
        orderName: 'created_at',
        orderBy: 'desc',
        ...query,
      },
    })
    return { ...query, historyArticleList: data.rows, total: data.count }
  },
  data() {
    return {}
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
    }
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    async currentChange(nowPage) {
      const { data } = await this.$axios1.get(`/api/article/list`, {
        params: {
          orderName: 'created_at',
          orderBy: 'desc',
          pageSize: this.pageSize,
          nowPage,
        },
      })
      this.historyArticleList = data.rows
      this.total = data.count
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/constant.scss';

.history-wrap {
  overflow: hidden;
  padding: 30px;
  border: 1px solid $theme-color4;
  border-radius: 5px;
  background: $theme-color6;
  .a-link {
    color: $theme-color5;
    text-decoration: none;
    font-size: 18px;
    &:hover {
      color: $theme-color1;
    }
  }
}
</style>
