<template>
  <AsnycCollapseCpt
    class="tag-info"
    title="标签云"
    :open="true"
  >
    <template #ico>
      <i class="el-icon-collection-tag"></i>
    </template>
    <div>
      <div v-if="sideBarTagList && sideBarTagList.length">
        <el-tooltip
          v-for="item in sideBarTagList"
          :key="item.id"
          effect="dark"
          :content="'该标签下有' + item.article_total + '篇文章'"
          placement="top"
        >
          <nuxt-link :to="'/tag/' + item.id">
            <el-tag
              class="tag-margin"
              :disable-transitions="false"
              :color="item.color"
              @click="tagClick(item.id)"
            >
              {{ item.name }}
            </el-tag>
          </nuxt-link>
        </el-tooltip>
      </div>
      <div v-else>暂无标签~</div>
    </div>
  </AsnycCollapseCpt>
</template>

<script>
import { mapState } from 'vuex';

export default {
  components: {
    AsnycCollapseCpt: () => import('@/components/Collapse/index.vue'),
  },
  props: {},
  data() {
    return {};
  },
  computed: {
    ...mapState({}),
    sideBarTagList() {
      return this.$store.state.tag.sideBarTagList;
    },
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    tagClick(id) {
      this.$router.push({ path: `/tag/${id}` });
    },
  },
};
</script>

<style lang="scss" scoped>
.tag-info {
  .el-tag {
    border: none;
    color: $theme-color6;
  }
  .title {
    margin: 8px 0;
  }
  .tag-margin {
    margin-right: 5px;
    margin-bottom: 5px;
    color: $theme-color6;
  }
}
</style>
