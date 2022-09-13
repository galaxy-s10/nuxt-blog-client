<template>
  <div class="pages-wrap">
    <p v-if="isFirst">loading...</p>
    <div
      ref="waterfall-wrap"
      v-loading="isLoading"
      class="waterfall-wrap"
      :style="{ opacity: isFirst ? 0 : 1 }"
    >
      <article
        v-for="(item, index) in articleList"
        :key="index"
        ref="waterfall-item"
        class="waterfall-item"
      >
        <nuxt-link v-slot="{ navigate }" :to="`/article/${item.id}`" custom>
          <div class="a-link" @click="navigate">
            <div v-if="item.priority === 99" class="top">置顶</div>
            <NoHeadImgCpt v-if="!item.head_img"></NoHeadImgCpt>
            <div
              v-else
              v-lazy:background-image="item.head_img"
              class="head-img"
              :style="{
                height: item.mockImgHeight + 'px',
              }"
            ></div>
            <div class="detail">
              <h3 class="title" :title="item.title">{{ item.title }}</h3>
              <p v-if="item.desc" class="desc" :title="item.desc">
                {{ item.desc }}
              </p>
              <div class="tag-list">
                <div v-if="item.tags.length">
                  <el-tag
                    v-for="tagItem in item.tags"
                    :key="tagItem.id"
                    class="hss-el-tag"
                    size="mini"
                    :disable-transitions="false"
                    :color="tagItem.color"
                    @close="closeTag(tagItem.id)"
                  >
                    {{ tagItem.name }}
                  </el-tag>
                </div>
                <span v-else>该文章暂无标签~</span>
              </div>
              <div class="info">
                <img
                  :src="item.users[0] && item.users[0].avatar"
                  class="avatar"
                  alt=""
                />
                <div>
                  <i class="el-icon-date"></i>
                  {{ item.created_at | convertDate }}
                </div>
                <div class="relation">
                  <div>
                    <i class="el-icon-view"></i>
                    {{ item.click }}
                  </div>
                  <div>
                    <i class="el-icon-chat-line-round"></i>
                    {{ item.comment_total }}
                  </div>
                  <div>
                    <i class="el-icon-star-off"></i>
                    {{ item.star_total }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nuxt-link>
      </article>
      <div ref="loadMoreRef" class="load-more-ref"></div>
    </div>
    <p v-if="!hasMore" class="no-more">已加载所有文章~</p>
  </div>
</template>

<script>
import NoHeadImgCpt from 'components/NoHeadImg/index.vue';
import { mapActions, mapMutations } from 'vuex';

import { init } from '@/mixin/init';
import { getRandomInt, generaterStyle } from '@/utils/index';
export default {
  components: {
    NoHeadImgCpt,
  },
  mixins: [init],
  layout: 'blog',
  async asyncData({ $myaxios, store }) {
    const params = {
      orderName: 'created_at',
      orderBy: 'desc',
      types: store.state.type.typeId,
      nowPage: 1,
      pageSize: 20,
    };
    try {
      const { data } = await $myaxios.get(`/article/list`, { params });
      data.rows.forEach((v) => {
        const mockImgHeight = getRandomInt(100, 200) + getRandomInt(0, 50);
        v.mockImgHeight = mockImgHeight;
      });
      const articleList = data.rows;
      const hasMore = data.hasMore;
      return { articleList, hasMore, articleParams: params };
    } catch (error) {
      console.log(error);
    }
  },
  data() {
    return {
      articleList: [],
      hasMore: false,
      articleParams: {},
      offsetList: [],
      visible: false,
      waterfallParams: {
        column: 3,
        gap: 20,
      },
      isLoading: true,
      isBottom: false, // 是否触底
      isFirst: true, // 是否初次加载
    };
  },
  head() {
    return {
      title: '首页 - 自然博客',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Natural Blog - Home',
        },
      ],
    };
  },
  computed: {
    typeId() {
      return this.$store.state.type.typeId;
    },
  },
  watch: {
    async typeId() {
      this.offsetList = [];
      this.articleList = [];
      this.articleParams.nowPage = 1;
      const waterfallWrap = this.$refs['waterfall-wrap'];
      waterfallWrap.style.height = '0px';

      this.articleParams.types = this.typeId;
      await this.ajaxArticleList(this.articleParams);
      this.handleWaterfall();
    },
    async isBottom(newVal) {
      if (this.isLoading) return;
      if (newVal && this.hasMore) {
        this.articleParams.nowPage += 1;
        await this.ajaxArticleList(this.articleParams);
        this.handleWaterfall();
      }
    },
  },
  created() {},
  mounted() {
    this.$myaxios
      .get(`/theme/list`, { nowPage: 1, pageSize: 100 })
      .then((res) => {
        const { data } = res;
        const obj = {};
        data.rows.forEach((v) => {
          obj[v.key] = v.value;
        });
        generaterStyle(obj);
      });
    // window.addEventListener('resize', () => {
    //   console.log('重置瀑布流');
    // });
    window.scrollTo({ top: 0 });
    const d = window.pageXOffset || document.documentElement.offsetWidth;
    if (d <= 414) {
      this.waterfallParams.column = 2;
    }
    this.handleWaterfall();
    this.isLoading = false;
    this.touchBottom();
  },
  destroyed() {
    window.removeEventListener('scroll', this.headershow);
  },
  methods: {
    ...mapActions({
      userLogin: 'user/login',
      getUserInfo: 'user/getUserInfo',
    }),
    ...mapMutations({
      setToken: 'user/setToken',
      logout: 'user/logout',
    }),

    async ajaxArticleList(params) {
      try {
        this.isLoading = true;
        const { data } = await this.$myaxios.get(`/article/list`, { params });
        data.rows.forEach((v) => {
          const mockImgHeight = getRandomInt(100, 200) + getRandomInt(0, 50);
          v.mockImgHeight = mockImgHeight;
        });
        if (params.nowPage === 1) {
          this.articleList = data.rows;
        } else {
          this.articleList = [...this.articleList, ...data.rows];
        }
        this.hasMore = data.hasMore;
        this.isLoading = false;
      } catch (error) {
        console.log(error);
        this.isLoading = false;
      }
    },
    // 触底事件
    touchBottom() {
      this.$nextTick(() => {
        const intersectionObserver = new IntersectionObserver((entries) => {
          entries.forEach((item) => {
            if (!item.isIntersecting) {
              this.isBottom = false;
            } else {
              this.isBottom = true;
            }
          });
        });
        intersectionObserver.observe(this.$refs.loadMoreRef);
      });
    },
    // 瀑布流定位
    handleWaterfall() {
      // 获取数组最小值的下标
      function getMinIndex(arr) {
        return [].indexOf.call(arr, Math.min.apply(null, arr));
      }
      // 获取数组最大值的下标
      function getMaxIndex(arr) {
        return [].indexOf.call(arr, Math.max.apply(null, arr));
      }
      // 列数
      const column = this.waterfallParams.column;
      // 间隙
      const gap = this.waterfallParams.gap;
      const waterfallWrap = this.$refs['waterfall-wrap'];
      const waterfallItem = this.$refs['waterfall-item'];
      // 瀑布流容器的宽度
      const waterfallWrapWidth = window.getComputedStyle(waterfallWrap).width;
      // 计算减去间隙后，每个item的平均宽度
      const waterfallItemWidth =
        (waterfallWrapWidth.replace('px', '') - (column - 1) * gap) / column;
      waterfallWrap.style.position = 'relative';

      if (!waterfallItem) return;

      for (
        let i = (this.articleParams.nowPage - 1) * this.articleParams.pageSize;
        i < waterfallItem.length;
        i += 1
      ) {
        waterfallItem[i].style.position = 'absolute';
        waterfallItem[i].style.width = `${waterfallItemWidth}px`;
        if (i < column) {
          this.offsetList.push(waterfallItem[i].offsetHeight); // 第一行不用判断，直接将每个item的offsetHeight保存在数组里
          waterfallItem[i].style.top = '0'; // 第一行的top都是0
          if ((i + 1) % column === 1) {
            waterfallItem[i].style.left = 0;
          } else {
            const w = i * waterfallItemWidth;
            const g = i * gap;
            waterfallItem[i].style.left = `${w + g}px`;
          }
        } else {
          const minIndex = getMinIndex(this.offsetList);
          const w = minIndex * waterfallItemWidth;
          const g = minIndex * gap;
          waterfallItem[i].style.top = `${this.offsetList[minIndex] + gap}px`; // 计算top
          waterfallItem[i].style.left = `${w + g}px`;
          this.offsetList[minIndex] += waterfallItem[i].offsetHeight + gap;
        }
      }
      this.isFirst = false;
      const maxIndex = getMaxIndex(this.offsetList);
      waterfallWrap.style.height = `${this.offsetList[maxIndex]}px`;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/css/constant.scss';
@import '@/assets/css/mixin.scss';

.v-enter {
  opacity: 0;
  transform: translateX(-10px);
}
.v-enter-active {
  transition: all 0.5s ease;
}

/* 响应式布局 - 小于 540px */
@media screen and (max-width: 540px) {
  .pages-wrap {
    .detail {
      .info {
        flex-wrap: wrap;
        justify-content: center !important;
        .avatar {
          margin-right: 10px;
        }
        .relation {
          width: 100%;
          flex: auto !important;
          justify-content: center !important;
          margin-top: 5px;
          & > div {
            margin-right: 10px;
          }
        }
      }
    }
  }
}

@keyframes loading {
  to {
    background-position-x: -50%;
  }
}
.left {
  padding: 0;
}

.pages-wrap {
  .tag-list {
    .el-tag {
      color: $theme-color6;
      border: none;
    }
    .hss-el-tag {
      margin-right: 5px;
      margin-bottom: 3px;
    }
  }

  .waterfall-wrap {
    position: relative;
    .waterfall-item {
      overflow: hidden;
      border: 1px solid $theme-color4;
      border-radius: 6px;
      background-color: $theme-color6;
      .a-link {
        cursor: pointer;
        .top {
          width: 140px;
          height: 25px;
          top: 8px;
          display: inline;
          right: -50px;
          text-align: center;
          line-height: 25px;
          transform: rotate(45deg);
          position: absolute;
          color: white;
          background: #c551af;
          z-index: 1;
        }
        .head-img {
          display: inline-block;
          width: 100%;
          background-position: center;
          background-size: cover;
          background-repeat: no-repeat;
          transition: all 0.3s ease 0s;
          &:hover {
            transform: scale(1.1);
          }
        }
        .detail {
          padding: 0 5px 10px;
          .title {
            margin: 10px 0;
            @include multiEllipsis(2);
          }
          .desc {
            @include multiEllipsis(2);
          }
          .tag-list {
            margin: 8px 0;
          }
          .info {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 5px 0;
            font-size: 12px;
            .avatar {
              width: 20px;
              height: 20px;
              border-radius: 50%;
            }
            .relation {
              flex: 0.8;
              display: flex;
              align-items: center;
              justify-content: space-around;
            }
          }
        }
      }
    }
    .load-more-ref {
      position: absolute;
      bottom: 200px;
    }
  }
  .no-more {
    text-align: center;
  }
}
</style>
