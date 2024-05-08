<template>
  <AsnycCollapseCpt
    class="setting-info"
    title="设置"
    open
  >
    <template #ico>
      <i class="el-icon-setting"></i>
    </template>
    <div>
      <div class="item">
        <div class="switch">
          <span class="txt">黑白主题：</span>
          <el-switch
            :value="theme === 'dark'"
            :width="35"
            @change="setTheme(theme === 'dark' ? 'light' : 'dark')"
          ></el-switch>
        </div>
      </div>
      <div class="item">
        <div class="switch">
          <span class="txt">樱花特效：</span>
          <el-switch
            :value="showPlum"
            :width="35"
            @change="setShowPlum(!showPlum)"
          ></el-switch>
        </div>
      </div>
      <div class="item">
        <div class="switch">
          <span class="txt">瀑布流效果：</span>
          <el-switch
            :value="isWaterFall"
            :width="35"
            @change="setIsWaterFall(!isWaterFall)"
          ></el-switch>
        </div>
      </div>
      <div class="item">
        <div class="switch">
          <span class="txt">音乐播放器：</span>
          <el-switch
            :value="showMusicAudio"
            :width="35"
            @change="setShowMusicAudio(!showMusicAudio)"
          ></el-switch>
        </div>
      </div>
    </div>
  </AsnycCollapseCpt>
</template>

<script>
import { mapMutations, mapState } from 'vuex';

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
      theme(state) {
        return state.app.theme;
      },
      showPlum(state) {
        return state.app.showPlum;
      },
      showMusicAudio(state) {
        return state.app.showMusicAudio;
      },
      isWaterFall(state) {
        return state.app.isWaterFall;
      },
    }),
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    ...mapMutations({
      changeSideBarArticleOrderName: 'article/changeSideBarArticleOrderName',
      setTheme: 'app/setTheme',
      setIsWaterFall: 'app/setIsWaterFall',
      setShowPlum: 'app/setShowPlum',
      setShowMusicAudio: 'app/setShowMusicAudio',
    }),
  },
};
</script>

<style lang="scss" scoped>
.setting-info {
  .list {
    display: flex;
    align-items: center;
    .item {
      display: flex;
      overflow: hidden;
      align-items: center;
      margin-bottom: 10px;
      height: 60px;
      &:last-child {
        margin-bottom: 0 !important;
      }
      .head-img {
        overflow: hidden;
        width: 40%;
        cursor: pointer;

        :deep(.no-head-img) {
          // ::v-deep .no-head-img {
          font-size: 12px !important;
          &:hover {
            transform: scale(1.1);
          }
        }

        img {
          display: block;
          width: 100%;
          border-radius: 5px;
          transition: all 0.3s;
          &:hover {
            transform: scale(1.1);
          }
        }
      }
      .desc {
        display: flex;
        flex: 1;
        flex-wrap: wrap;
        padding-left: 4px;

        justify-items: center;
        .info {
          display: flex;
          margin-top: 4px;
          width: 100%;
          font-size: 12px;
          .view {
            margin-right: 6px;
          }
        }
        .b-hover {
          color: inherit;
          text-decoration: none;
          @include multiEllipsis(2);
          &:hover {
            transform: translateX(4px);
          }
        }
      }
    }
  }
}
</style>
