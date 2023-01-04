<template>
  <AsnycCollapseCpt
    class="log-info"
    title="流量信息"
  >
    <template #ico>
      <i class="el-icon-data-analysis"></i>
    </template>
    <div v-loading="logLoading">
      <template v-if="ipInfo">
        <div class="item">ip: {{ ipInfo.ip }}</div>
        <div class="item">
          location:
          {{ ipInfo.gaode | parseIpInfo }}
        </div>
      </template>
      <template v-if="visitorHistoryData">
        <div class="item">
          历史总访问量: {{ visitorHistoryData.visit_total }}
        </div>
        <div class="item">
          历史总访客量: {{ visitorHistoryData.visitor_total }}
        </div>
      </template>
      <template v-if="visitorDayData">
        <div class="item">今天总访问数: {{ visitorDayData.visit_total }}</div>
        <div class="item">今天总访客数: {{ visitorDayData.visitor_total }}</div>
      </template>
      <div
        class="refresh"
        @click="refreshLog"
      >
        <i class="el-icon-refresh ico"></i>
      </div>
    </div>
  </AsnycCollapseCpt>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

import { dateStartAndEnd } from '@/utils/format';

export default {
  components: {
    AsnycCollapseCpt: () => import('@/components/Collapse/index.vue'),
  },
  props: {},
  data() {
    return { logLoading: false };
  },
  computed: {
    ...mapState({
      ipInfo(state) {
        return state.app.ipInfo;
      },
      visitorDayData() {
        return this.$store.state.visitor.dayData;
      },
      visitorHistoryData() {
        return this.$store.state.visitor.historyData;
      },
    }),
  },
  watch: {},
  created() {},
  mounted() {
    this.$store.dispatch('app/getIpInfo');
    this.$store.dispatch(
      'visitor/getVisitorDayData',
      dateStartAndEnd(new Date())
    );
    this.$store.dispatch('visitor/getVisitorHistoryData');
  },
  methods: {
    ...mapMutations({
      changeSideBarArticleOrderName: 'article/changeSideBarArticleOrderName',
      setTheme: 'app/setTheme',
      setIsWaterFall: 'app/setIsWaterFall',
      setShowPlum: 'app/setShowPlum',
      setShowMusicAudio: 'app/setShowMusicAudio',
    }),
    async refreshLog() {
      this.logLoading = true;
      await this.$store.dispatch(
        'visitor/getVisitorDayData',
        dateStartAndEnd(new Date())
      );
      await this.$store.dispatch('visitor/getVisitorHistoryData');
      this.logLoading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.log-info {
  .refresh {
    text-align: right;
    .ico {
      cursor: pointer;
    }
  }
}
</style>
