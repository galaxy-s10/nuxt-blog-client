<template>
  <AsnycCollapseCpt
    v-if="userInfo"
    title="用户信息"
  >
    <template #ico>
      <i class="el-icon-user"></i>
    </template>
    <div>
      <div class="item">
        角色: {{ summary.roles.map((v) => v.role_name).join() }}
      </div>
      <div class="item">文章数: {{ summary.articlesTotal }}</div>
      <div class="item">累计发出点赞: {{ summary.sendStarsTotal }}</div>
      <div class="item">累计收到点赞: {{ summary.receiveStarsTotal }}</div>
      <div class="item">累计发出评论: {{ summary.sendCommentsTotal }}</div>
      <div class="item">累计收到回复: {{ summary.receiveCommentsTotal }}</div>
      <div class="item">
        qq绑定: {{ summary?.qq_users.length ? '已绑定' : '未绑定' }}
      </div>
      <div class="item">
        github绑定: {{ summary?.github_users.length ? '已绑定' : '未绑定' }}
      </div>
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
    ...mapState({
      summary(state) {
        return state.user.summary;
      },
      userInfo(state) {
        return state.user.userInfo;
      },
    }),
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
