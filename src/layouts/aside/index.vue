<template>
  <aside class="aside-wrap">
    <div class="user-info">
      <div class="bgc"></div>
      <img
        class="user-avatar"
        :src="
          userInfo
            ? userInfo.avatar
            : require('@/assets/img/default_avatar.webp')
        "
      />
      <div class="info">
        <div class="name">
          {{ userInfo ? userInfo.username : '未登录' }}
        </div>
        <p class="title">{{ userInfo ? userInfo.desc : 'hello world！' }}</p>
      </div>
    </div>

    <AsnycCollapseCpt class="releation-info" title="联系" open>
      <template #ico>
        <i class="el-icon-setting"></i>
      </template>
      <div class="releation-info">
        <div class="item">
          <div class="wechat_logo_wrap">
            <img src="@/assets/img/wechat_logo.webp" class="logo" alt="" />
            <img src="@/assets/img/wechat_code.webp" class="code" alt="" />
          </div>
          <a
            class="github_logo_wrap"
            href="https://github.com/galaxy-s10"
            target="_blank"
          >
            <img src="@/assets/img/github_logo.webp" class="logo" alt="" />
          </a>
        </div>
      </div>
    </AsnycCollapseCpt>

    <AsnycCollapseCpt class="setting-info" title="设置" open>
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
            <span class="txt">梅花特效：</span>
            <el-switch
              :value="showPlum"
              :width="35"
              @change="setShowPlum(!showPlum)"
            ></el-switch>
          </div>
        </div>
        <div class="item">
          <div class="switch">
            <span class="txt">瀑布流展示：</span>
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

    <AsnycCollapseCpt v-if="userInfo" title="用户信息">
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
          qq绑定: {{ summary.qq_users.length ? '已绑定' : '未绑定' }}
        </div>
        <div class="item">
          github绑定: {{ summary.github_users.length ? '已绑定' : '未绑定' }}
        </div>
      </div>
    </AsnycCollapseCpt>

    <template v-if="showCatalog">
      <div ref="catalogRef" class="catalog-ref"></div>
      <nav class="catalog-info" :class="{ fix: catalogFixed }">
        <div class="title">
          <i class="el-icon-paperclip"></i>
          <b>文章目录</b>
        </div>
        <CatalogCpt :list="catalogList"></CatalogCpt>
      </nav>
    </template>

    <template v-else>
      <AsnycCollapseCpt class="log-info" title="流量信息">
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
            <div class="item">
              今天总访问数: {{ visitorDayData.visit_total }}
            </div>
            <div class="item">
              今天总访客数: {{ visitorDayData.visitor_total }}
            </div>
          </template>
          <div class="refresh" @click="refreshLog">
            <i class="el-icon-refresh ico"></i>
          </div>
        </div>
      </AsnycCollapseCpt>

      <div class="main-folat-wrap">
        <div ref="mainFolatRef" class="main-folat-ref"></div>
        <div :class="{ fix: sidebarFixed }">
          <div class="article-info" title="文章排行">
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
              <span class="switch-btn" @click="switchSideBarArticleOrderName">
                切换
              </span>
            </div>
            <div v-loading="switchLoading">
              <div v-if="sideBarArticleList && sideBarArticleList.length">
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
                      <img v-lazy="item['head_img']" alt="" @click="navigate" />
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
                      v-slot="{ navigate }"
                      :to="'/article/' + item.id"
                      custom
                    >
                      <b class="b-hover" @click="navigate">
                        #{{ item.title }}
                      </b>
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

          <AsnycCollapseCpt class="tag-info" title="标签云" :open="true">
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
                  <el-tag
                    class="tag-margin"
                    :disable-transitions="false"
                    :color="item.color"
                    @click="tagClick(item.id)"
                  >
                    {{ item.name }}
                  </el-tag>
                </el-tooltip>
              </div>
              <div v-else>暂无标签~</div>
            </div>
          </AsnycCollapseCpt>
        </div>
      </div>
    </template>
  </aside>
</template>

<script>
import CatalogCpt from 'components/Catalog/index.vue';
import NoHeadImgCpt from 'components/NoHeadImg/index.vue';
import { mapState, mapActions, mapMutations } from 'vuex';

import { dateStartAndEnd } from '@/utils/format';

export default {
  components: {
    CatalogCpt,
    NoHeadImgCpt,
    AsnycCollapseCpt: () => import('components/Collapse/index.vue'),
  },
  // nuxt2不支持在layout使用asyncData:https://github.com/nuxt/nuxt.js/issues/3510
  asyncData({ $myaxios, store }) {},
  data() {
    return {
      switchLoading: false,
      catalogFixed: false,
      sidebarFixed: false,
      logLoading: false,
      catalogObserver: null,
      sidebarObserver: null,
    };
  },
  computed: {
    ...mapState({
      sideBarArticleOrderName(state) {
        return state.article.sideBarArticleOrderName;
      },
      ipInfo(state) {
        return state.app.ipInfo;
      },
      visitorDayData() {
        return this.$store.state.visitor.dayData;
      },
      visitorHistoryData() {
        return this.$store.state.visitor.historyData;
      },
      summary(state) {
        return state.user.summary;
      },
      userInfo(state) {
        return state.user.userInfo;
      },
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
    sideBarTagList() {
      return this.$store.state.tag.sideBarTagList;
    },
    sideBarArticleList() {
      return this.$store.state.article.sideBarArticleList;
    },
    catalogList() {
      return this.$store.state.article.catalogList;
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
          this.$refs.catalogRef &&
            this.catalogObserver.unobserve(this.$refs.catalogRef);
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
    this.$store.dispatch('app/getIpInfo');
    this.$store.dispatch(
      'visitor/getVisitorDayData',
      dateStartAndEnd(new Date())
    );
    this.$store.dispatch('visitor/getVisitorHistoryData');
  },
  methods: {
    ...mapActions('article', ['getSideBarArticleList']),
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
    async ajaxArticleList(orderName) {
      try {
        const params = {
          nowPage: 1,
          pageSize: 5,
          orderName,
          orderBy: 'desc',
        };
        const { data } = await this.$myaxios.get(`/article/list`, {
          params,
        });
        return data;
      } catch (error) {
        console.log(error);
      }
    },

    // 文章目录监听
    handleCataLogObserver(ref) {
      const rootMargin = { top: -40, right: 0, bottom: 0, left: 0 };
      this.catalogObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((item) => {
            const height = window.innerHeight + rootMargin.top;
            if (height <= item.boundingClientRect.top) return;
            if (!this.showCatalog) return;
            if (item.isIntersecting) {
              this.catalogFixed = false;
              this.sidebarFixed = false; // 文章目录出现的时候，直接去掉侧边栏目录
            } else {
              this.catalogFixed = true;
            }
          });
        },
        {
          rootMargin: `${rootMargin.top}px ${rootMargin.right}px ${rootMargin.bottom}px ${rootMargin.left}px`,
        }
      );
      this.catalogObserver.observe(ref);
    },
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
    tagClick(id) {
      this.$router.push({ path: `/tag/${id}` });
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
@import '@/assets/css/constant.scss';
@import '@/assets/css/mixin.scss';

.aside-wrap {
  // width: inherit;
  .user-info {
    overflow: hidden;
    padding-bottom: 10px;
    border: 1px solid $theme-color4;
    border-radius: 5px;
    background: $theme-color6;
    .bgc {
      height: 80px;
      background-image: -webkit-linear-gradient(
        43deg,
        #4158d0 0%,
        #c850c0 46%,
        #ffcc70 100%
      );
      background-image: -moz-linear-gradient(
        43deg,
        #4158d0 0%,
        #c850c0 46%,
        #ffcc70 100%
      );
      background-image: -o-linear-gradient(
        43deg,
        #4158d0 0%,
        #c850c0 46%,
        #ffcc70 100%
      );
      background-image: linear-gradient(
        43deg,
        #4158d0 0%,
        #c850c0 46%,
        #ffcc70 100%
      );
    }
    .user-avatar {
      position: relative;
      left: 50%;
      width: 80px;
      height: 80px;
      border-radius: 50%;
      transition: all 0.5s;
      transform: rotate(0) translate(-50%, -50%);
      transform-origin: 0 0;
      &:hover {
        transform: rotate(1turn) translate(-50%, -50%);
      }
    }
    .info {
      margin-top: -30px;
      .name {
        text-align: center;
        font-weight: bold;
      }
      .title {
        margin: 4px;
        text-align: center;
      }
    }
  }
  .main-folat-wrap {
    // background-color: red;
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
            cursor: pointer;
            &:hover {
              transform: translateX(4px);
            }
          }
        }
      }
    }
    .tag-info {
      /* 覆盖默认样式，加了/deep/或者>>>反而覆盖不了？ */
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
  }

  .catalog-ref {
    width: 1px;
    height: 1px;
  }
  .log-info {
    .refresh {
      text-align: right;
      .ico {
        cursor: pointer;
      }
    }
  }
  .releation-info {
    .item {
      display: flex;
    }
    .logo {
      width: 30px;
      height: 30px;
      cursor: pointer;
    }
    .github_logo_wrap {
      margin-left: 10px;
    }
    .wechat_logo_wrap {
      position: relative;
      display: inline-block;

      &:hover {
        .code {
          display: block;
        }
      }
      .code {
        position: absolute;
        top: 0;
        display: none;
        width: 100px;
        height: 100px;
        transform: translate(0, -100%);
      }
    }
  }
  .catalog-info {
    overflow: hidden;
    margin-top: 20px;
    padding: 10px;
    border: 1px solid $theme-color4;
    border-radius: 5px;
    background: $theme-color6;
    &.fix {
      position: fixed;
      top: 40px;
      box-sizing: border-box;
      width: inherit;
    }
    .title {
      margin: 8px 0;
    }
  }
}
</style>
