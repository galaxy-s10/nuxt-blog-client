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
        <p class="title">{{ userInfo ? userInfo.desc : 'hello world!' }}</p>
      </div>
    </div>

    <AsnycCollapseCpt title="联系" open>
      <template #ico>
        <i class="el-icon-setting"></i>
      </template>
      <div class="releation-info">
        <div class="item">
          <div class="wechat_logo_wrap">
            <img
              src="@/assets/img/wechat_logo.webp"
              class="wechat_logo"
              alt=""
            />
            <img src="@/assets/img/wechat_code.webp" class="code" alt="" />
          </div>
        </div>
      </div>
    </AsnycCollapseCpt>

    <AsnycCollapseCpt title="设置" open>
      <template #ico>
        <i class="el-icon-setting"></i>
      </template>
      <div>
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
      <nav class="catalog-info" :class="{ fix: catalogFix }">
        <div class="title">
          <i class="el-icon-paperclip"></i>
          <b>文章目录</b>
        </div>
        <CatalogCpt :list="catalogList"></CatalogCpt>
      </nav>
    </template>

    <template v-else>
      <div>
        <AsnycCollapseCpt title="访客信息">
          <template #ico>
            <i class="el-icon-position"></i>
          </template>
          <div>
            <template v-if="ipInfo">
              <div class="item">ip: {{ ipInfo.ip }}</div>
              <div class="item">
                location:
                {{ ipInfo | parseIpInfo }}
              </div>
            </template>
          </div>
        </AsnycCollapseCpt>

        <AsnycCollapseCpt class="log-info" title="流量信息">
          <template #ico>
            <i class="el-icon-data-analysis"></i>
          </template>
          <div v-loading="logLoading">
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

        <div class="article-info">
          <div class="title">
            <div>
              <i class="el-icon-medal"></i>
              <b>
                {{
                  sideBarArticleOrderName === 'click' ? '热门文章' : '最近更新'
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
                    <b class="b-hover" @click="navigate"> #{{ item.title }}</b>
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
      catalogFix: false,
      logLoading: false,
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
        return this.$store.state.log.dayData;
      },
      visitorHistoryData() {
        return this.$store.state.log.historyData;
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
    showCatalog(newVal, oldVal) {
      newVal &&
        this.$nextTick(() => {
          this.cataLogObserver();
        });
    },
  },
  mounted() {
    this.$store.dispatch('app/getIpInfo');
    this.$store.dispatch('log/getVisitorDayData', dateStartAndEnd(new Date()));
    this.$store.dispatch('log/getVisitorHistoryData');
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
        'log/getVisitorDayData',
        dateStartAndEnd(new Date())
      );
      await this.$store.dispatch('log/getVisitorHistoryData');
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

    // 目录监听
    cataLogObserver() {
      const intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((item) => {
          if (!item.isIntersecting) {
            this.catalogFix = true;
          } else {
            this.catalogFix = false;
          }
        });
      });
      intersectionObserver.observe(this.$refs.catalogRef);
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
  width: inherit;
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
  .article-info {
    overflow: hidden;
    margin-top: 20px;
    padding: 10px;
    border: 1px solid $theme-color4;
    border-radius: 5px;
    background: $theme-color6;
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
          transition: all 0.3s ease 0s;
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
  .catalog-ref {
    transform: translateY(-50px);
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
    :global {
      // color: red;
    }
    .wechat_logo_wrap {
      position: relative;
      .wechat_logo {
        width: 30px;
        height: 30px;
        cursor: pointer;
      }
      &:hover {
        .code {
          display: block;
        }
      }
      .code {
        width: 100px;
        height: 100px;
        position: absolute;
        top: 0;
        transform: translate(0, -100%);
        display: none;
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
      top: 50px;
      box-sizing: border-box;
      width: inherit;
    }
    .title {
      margin: 8px 0;
    }
  }
}
</style>
