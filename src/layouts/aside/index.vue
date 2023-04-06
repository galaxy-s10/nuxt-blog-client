<template>
  <aside class="aside-wrap">
    <HeadInfoCpt></HeadInfoCpt>

    <SiteInfoCpt></SiteInfoCpt>

    <SettingInfoCpt></SettingInfoCpt>

    <UserInfoCpt></UserInfoCpt>

    <CatalogInfoCpt></CatalogInfoCpt>

    <template v-if="!showCatalog">
      <LogInfoCpt></LogInfoCpt>

      <div
        ref="mainFolatWrapRef"
        class="main-folat-wrap"
      >
        <div
          ref="mainFolatRef"
          class="main-folat-ref"
        ></div>
        <div :class="{ fix: sidebarFixed }">
          <div
            class="article-info"
            title="文章排行"
          >
            <div class="title">
              <div>
                <i class="el-icon-medal"></i>
                <b>
                  {{
                    sideBarArticleOrderName === 'click'
                      ? '热门文章'
                      : '最近更新'
                  }}
                </b>
              </div>
              <span
                class="switch-btn"
                @click="switchSideBarArticleOrderName"
              >
                切换
              </span>
            </div>
            <div v-loading="switchLoading">
              <div v-if="sideBarArticleList && sideBarArticleList.length">
                <!-- 信息流广告---侧边文章广告 -->
                <div
                  v-if="GOOGLE_AD"
                  class="item ad"
                >
                  <client-only>
                    <ins
                      class="adsbygoogle"
                      style="display: block"
                      data-ad-format="fluid"
                      data-ad-layout-key="-fr+4t+7h-41-gv"
                      data-ad-client="ca-pub-6064454674933772"
                      data-ad-slot="6936609719"
                    ></ins>
                  </client-only>
                </div>
                <div
                  v-for="(item, index) in sideBarArticleList"
                  :key="index"
                  class="item"
                >
                  <div class="head-img">
                    <nuxt-link
                      v-if="item['head_img']"
                      v-slot="{ navigate }"
                      :to="'/article/' + item.id"
                      custom
                    >
                      <img
                        v-lazy="item['head_img']"
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
                      <NoHeadImgCpt @click="navigate"></NoHeadImgCpt>
                    </nuxt-link>
                  </div>
                  <div class="desc">
                    <nuxt-link
                      :to="'/article/' + item.id"
                      class="b-hover"
                    >
                      <b> #{{ item.title }} </b>
                    </nuxt-link>
                    <div class="info">
                      <span class="view">
                        <i class="el-icon-view"></i>
                        {{ item.click }}
                      </span>
                      <div v-if="sideBarArticleOrderName === 'click'">
                        <i class="el-icon-star-off"></i>{{ item.star_total }}
                      </div>
                      <div v-else>
                        <i class="el-icon-date"></i>
                        {{ item.updated_at | convertDate }}更新
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else>暂无文章~</div>
            </div>
          </div>

          <TagInfoCpt></TagInfoCpt>
          <AdInfoCpt></AdInfoCpt>
        </div>
      </div>
    </template>
  </aside>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';

import NoHeadImgCpt from '@/components/NoHeadImg/index.vue';
import { GOOGLE_AD } from '@/constant';

import AdInfoCpt from './ad-info/index.vue';
import CatalogInfoCpt from './catalog-info/index.vue';
import HeadInfoCpt from './head-info/index.vue';
import LogInfoCpt from './log-info/index.vue';
import SettingInfoCpt from './setting-info/index.vue';
import SiteInfoCpt from './site-info/index.vue';
import TagInfoCpt from './tag-info/index.vue';
import UserInfoCpt from './user-info/index.vue';

// eslint-disable-next-line
import { Api } from '@/api';

export default {
  components: {
    AdInfoCpt,
    HeadInfoCpt,
    SiteInfoCpt,
    SettingInfoCpt,
    TagInfoCpt,
    UserInfoCpt,
    CatalogInfoCpt,
    LogInfoCpt,
    NoHeadImgCpt,
  },
  /**
   * @typedef {Object} asyncDataType
   * @property {Api} $myaxios
   * @property {Object} store
   * @property {Object} params
   * @property {Object} req
   * @param {asyncDataType} value
   * https://nuxtjs.org/docs/concepts/context-helpers
   * nuxt2不支持在layout使用asyncData:https://github.com/nuxt/nuxt.js/issues/3510
   */
  async asyncData({ $myaxios, store, params, req }) {},
  data() {
    return {
      switchLoading: false,
      catalogFixed: false,
      sidebarFixed: false,
      catalogObserver: null,
      sidebarObserver: null,
      GOOGLE_AD,
    };
  },
  head() {
    return {
      script: [
        GOOGLE_AD && {
          crossorigin: true,
          async: true,
          src: `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6064454674933772`,
        },
      ].filter(Boolean),
    };
  },
  computed: {
    ...mapState({
      sideBarArticleOrderName(state) {
        return state.article.sideBarArticleOrderName;
      },
    }),
    sideBarTagList() {
      return this.$store.state.tag.sideBarTagList;
    },
    sideBarArticleList() {
      return this.$store.state.article.sideBarArticleList;
    },
    showCatalog() {
      return this.$store.state.app.showCatalog;
    },
  },
  watch: {
    $route(to, from) {
      // if (to.name === 'article-id') {
      //   this.$refs.mainFolatRef &&
      //     this.catalogObserver.unobserve(this.$refs.mainFolatRef);
      // }
      if (to.name !== 'article-id') {
        this.$nextTick(() => {
          this.$refs.mainFolatRef &&
            this.handleSidebarObserver(this.$refs.mainFolatRef);
        });
      }
    },
    showCatalog(newVal, oldVal) {
      if (newVal) {
        this.catalogFixed = false;
        this.$nextTick(() => {
          this.$refs.catalogRef &&
            this.handleCataLogObserver(this.$refs.catalogRef);
        });
      }
    },
  },
  mounted() {
    this.handleSidebarObserver(this.$refs.mainFolatRef);
  },
  methods: {
    ...mapActions('article', ['getSideBarArticleList']),
    ...mapMutations({
      changeSideBarArticleOrderName: 'article/changeSideBarArticleOrderName',
    }),
    async ajaxArticleList(orderName) {
      try {
        const params = {
          nowPage: 1,
          pageSize: 5,
          orderName,
          orderBy: 'desc',
        };
        const { data } = await this.$myaxios.article.list(params);
        return data;
      } catch (error) {
        console.log(error);
      }
    },

    // 文章目录监听
    // handleCataLogObserver(ref) {
    //   const rootMargin = { top: -40, right: 0, bottom: 0, left: 0 };
    //   this.catalogObserver = new IntersectionObserver(
    //     (entries) => {
    //       entries.forEach((item) => {
    //         const height = window.innerHeight + rootMargin.top;
    //         if (height <= item.boundingClientRect.top) return;
    //         // if (!this.showCatalog) return;
    //         if (
    //           this.$refs.catalogInfoRef.getBoundingClientRect().height >=
    //           document.querySelector('.main-wrap .left').getBoundingClientRect()
    //             .height
    //         ) {
    //           return;
    //         }
    //         if (item.isIntersecting) {
    //           this.catalogFixed = false;
    //           this.sidebarFixed = false; // 文章目录出现的时候，直接去掉侧边栏目录
    //         } else {
    //           this.catalogFixed = true;
    //         }
    //       });
    //     },
    //     {
    //       rootMargin: `${rootMargin.top}px ${rootMargin.right}px ${rootMargin.bottom}px ${rootMargin.left}px`,
    //     }
    //   );
    //   this.catalogObserver.observe(ref);
    // },
    // 侧边栏监听
    handleSidebarObserver(ref) {
      const rootMargin = { top: -40, right: 0, bottom: 0, left: 0 };
      this.sidebarObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((item) => {
            // 因为需求是entries出现的位置到超过屏幕的顶部，就固定位置，
            // 但是IntersectionObserver是不管在屏幕顶部还是左右底部的，只要出现在屏幕就会触发
            // 所以，根据当前的场景，是有可能entries出现到屏幕底部的（联系、设置、访客信息、流量信息这些折叠面板展开后，entries就会被超出屏幕底部），
            // 我们需要排除这种情况。不能使用IntersectionObserver的第二个option参数，添加root属性，因为root得为entries的祖先
            const height = window.innerHeight + rootMargin.top;
            if (height <= item.boundingClientRect.top) return;
            if (this.showCatalog) return;
            if (
              this.$refs.mainFolatWrapRef.getBoundingClientRect().height >=
              document.querySelector('.main-wrap .left').getBoundingClientRect()
                .height
            ) {
              return;
            }

            if (item.isIntersecting) {
              // console.log('entries和屏幕有交叉，即出现在了屏幕');
              this.sidebarFixed = false;
              this.catalogFixed = false; // 侧边栏目录出现的时候，直接去掉文章目录
            } else {
              // console.log('entries和屏幕没有交叉，即没出现在屏幕');
              this.sidebarFixed = true;
              this.catalogFixed = true;
            }
          });
        },
        {
          rootMargin: `${rootMargin.top}px ${rootMargin.right}px ${rootMargin.bottom}px ${rootMargin.left}px`,
        }
      );
      this.sidebarObserver.observe(ref);
    },
    async switchSideBarArticleOrderName() {
      const orderName =
        this.sideBarArticleOrderName === 'click' ? 'updated_at' : 'click';
      this.switchLoading = true;
      this.changeSideBarArticleOrderName(orderName);
      await this.getSideBarArticleList({
        nowPage: 1,
        pageSize: 5,
        orderName,
        orderBy: 'desc',
      });
      this.switchLoading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.aside-wrap {
  .main-folat-wrap {
    .fix {
      position: fixed;
      top: 40px;
      box-sizing: border-box;
      width: 300px;
    }
    .main-folat-ref {
      width: 1px;
      height: 1px;
    }
    .article-info {
      overflow: hidden;
      margin-top: 20px;
      padding: 10px;
      border: 1px solid $theme-color4;
      border-radius: 5px;
      background: $theme-color6;
      // background-color: red;

      .title {
        display: flex;
        justify-content: space-between;
        margin: 8px 0;
        .switch-btn {
          cursor: pointer;
        }
      }
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
      .ad {
        width: 250px;
        height: 80px;
      }
    }
  }
}
</style>
