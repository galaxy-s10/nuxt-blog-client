<template>
  <div class="pages-wrap">
    <div ref="waterfall-wrap" v-loading="isLoading" class="waterfall-wrap">
      <nuxt-link
        v-for="(item, index) in articleList"
        :key="index"
        ref="waterfall-item"
        v-slot="{ navigate }"
        class="waterfall-item"
        :to="`/article/${item.id}`"
        custom
      >
        <article @click="navigate">
          <div class="head-img-wrap">
            <div v-if="item.priority === 99" class="top">置顶</div>
            <NoHeadImgCpt v-if="!item.head_img"></NoHeadImgCpt>
            <div
              v-else
              v-lazy:background-image="item.head_img"
              class="head-img"
              :mockImgHeight="item.mockImgHeight"
            ></div>
          </div>

          <div class="detail">
            <h3 class="title" :title="item.title">{{ item.title }}</h3>
            <p v-if="item.desc" class="desc" :title="item.desc">
              {{ item.desc }}
            </p>
            <p v-else>该文章暂无简介~</p>

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
        </article>
      </nuxt-link>
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
        v.mockImgHeight = getRandomInt(220, 260);
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
      doneNums: 0, // 已经定位了几个元素
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
    isWaterFall() {
      return this.$store.state.app.isWaterFall;
    },
  },
  watch: {
    isWaterFall() {
      if (this.isWaterFall) {
        this.doneNums = 0;
        this.offsetList = [];
        this.handleWaterfall();
      } else {
        const waterfallItem = this.$refs['waterfall-item'];
        const waterfallWrap = this.$refs['waterfall-wrap'];
        waterfallWrap.style.height = 'initial';
        waterfallItem.forEach((v) => {
          v.$el.setAttribute('style', 'width:100%');
        });
      }
    },
    async typeId() {
      this.offsetList = [];
      this.articleList = [];
      this.articleParams.nowPage = 1;
      this.articleParams.types = this.typeId;
      await this.ajaxArticleList(this.articleParams);
      this.handlePage();
    },
    async isBottom(newVal) {
      if (this.isLoading) return;
      if (newVal && this.hasMore) {
        this.articleParams.nowPage += 1;
        await this.ajaxArticleList(this.articleParams);
        this.handlePage();
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
    window.addEventListener('resize', () => {
      const d = window.pageXOffset || document.documentElement.offsetWidth;
      if (d <= 425) {
        this.waterfallParams.column = 2;
      }
      this.handlePage();
    });
    window.scrollTo({ top: 0 });

    this.handlePage();
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
      setIsWaterFall: 'app/setIsWaterFall',
    }),
    switchShowMethod() {
      this.setIsWaterFall(!this.isWaterFall);
    },
    handlePage() {
      if (this.isWaterFall) {
        this.doneNums = 0;
        this.offsetList = [];
        this.handleWaterfall();
      }
    },
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
        this.doneNums =
          (this.articleParams.nowPage - 1) * this.articleParams.pageSize;
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
      const column = this.waterfallParams.column; // 列数
      const gap = this.waterfallParams.gap; // 间隙
      const waterfallWrap = this.$refs['waterfall-wrap'];
      const waterfallItem = this.$refs['waterfall-item'];
      // 瀑布流容器的宽度
      const waterfallWrapWidth = waterfallWrap.getBoundingClientRect().width;
      // 计算减去间隙后，每个item的平均宽度
      const waterfallItemWidth =
        (waterfallWrapWidth - (column - 1) * gap) / column;
      if (!waterfallItem) return;
      // 优化性能，根据页数进行瀑布流定位，只对新的页数dom进行定位
      for (let i = this.doneNums; i < waterfallItem.length; i += 1) {
        const el = waterfallItem[i].$el;
        el.style.position = 'absolute';
        el.style.width = `${waterfallItemWidth}px`;
        el.style.height = `initial`;
        el.style.marginBottom = `0px`;
        el.style.display = 'block';
        if (el.querySelector('.head-img')?.$el) {
          el.querySelector('.head-img').$el.style.height = `${waterfallItem[i]
            .querySelector('.head-img')
            .getAttribute('mockImgHeight')}px`;
        }

        if (i < column) {
          this.offsetList.push(el.offsetHeight); // 第一行不用判断，直接将每个item的offsetHeight保存在数组里
          el.style.top = '0'; // 第一行的top都是0
          if ((i + 1) % column === 1) {
            el.style.left = 0;
          } else {
            const w = i * waterfallItemWidth;
            const g = i * gap;
            el.style.left = `${w + g}px`;
          }
        } else {
          const minIndex = getMinIndex(this.offsetList);
          const w = minIndex * waterfallItemWidth;
          const g = minIndex * gap;
          el.style.top = `${this.offsetList[minIndex] + gap}px`; // 计算top
          el.style.left = `${w + g}px`;
          this.offsetList[minIndex] += el.offsetHeight + gap;
        }
      }
      this.isFirst = false;
      const maxIndex = getMaxIndex(this.offsetList);
      waterfallWrap.style.position = 'relative';
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
  transition: all 0.5s ease-in-out;
}

/* 响应式布局 - 小于 720px */
@media screen and (max-width: 720px) {
  .pages-wrap {
    .waterfall-wrap {
      .waterfall-item {
        height: initial !important;
        display: block !important;
      }
    }
  }
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
          flex: auto !important;
          justify-content: center !important;
          margin-top: 5px;
          width: 100%;
          & > div {
            margin-right: 10px;
          }
        }
      }
    }
    .waterfall-wrap {
      .waterfall-item {
        height: initial !important;
        display: block !important;
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
      border: none;
      color: $theme-color6;
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
      box-sizing: border-box;
      margin-bottom: 20px;
      border: 1px solid $theme-color4;
      border-radius: 6px;
      background-color: $theme-color6;
      position: relative;
      display: flex;
      cursor: pointer;
      height: 250px;

      &:hover {
        transition: all 0.3s ease-in-out;
        transform: scale(1.02);
      }
      // .a-link {
      // position: relative;
      // display: flex;
      // cursor: pointer;
      .head-img-wrap {
        position: relative;
        overflow: hidden;
        flex: 0 0 40%;

        .top {
          position: absolute;
          top: 8px;
          right: -50px;
          z-index: 1;
          display: inline;
          width: 140px;
          height: 25px;
          background: #c551af;
          color: white;
          text-align: center;
          line-height: 25px;
          transform: rotate(45deg);
        }
        .no-head-img {
          width: 100%;
          height: 250px;
          line-height: 250px;
          &:hover {
            transition: all 0.3s ease-in-out;
            transform: scale(1.1);
          }
        }
        .head-img {
          display: inline-block;
          height: 250px;
          width: 100%;
          background-position: center;
          background-size: cover;
          background-repeat: no-repeat;
          &:hover {
            transition: all 0.3s ease-in-out;
            transform: scale(1.1);
          }
        }
      }

      .detail {
        flex: 1;
        padding: 0 5px 10px;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
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
            display: flex;
            align-items: center;
            flex: 0.8;
            justify-content: space-around;
          }
        }
      }
      // }
    }
    .load-more-ref {
      position: absolute;
      bottom: 300px;
    }
  }
  .no-more {
    text-align: center;
  }
}
</style>
