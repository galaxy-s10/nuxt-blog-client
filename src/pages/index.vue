<template>
  <div class="pages-wrap">
    <div
      ref="article-list"
      v-loading="isLoading"
      :class="{ 'article-list': true }"
    >
      <nuxt-link
        v-for="(item, index) in articleList"
        :key="index"
        ref="article-item"
        :class="{ 'article-item-a': true, 'water-fall': isWaterFall }"
        :to="`/article/${item.id}`"
      >
        <article :class="{ 'article-item': true }">
          <div
            v-if="item.priority === 99"
            class="top"
          >
            置顶
          </div>
          <div class="head-img-wrap">
            <NoHeadImgCpt
              v-if="!item.head_img"
              :mock-img-height="item.mockImgHeight"
            ></NoHeadImgCpt>
            <div
              v-else
              v-lazy:background-image="item.head_img"
              class="head-img"
              :mock-img-height="item.mockImgHeight"
            ></div>
          </div>

          <div class="detail">
            <h3
              class="title"
              :title="item.title"
            >
              {{ item.title }}
            </h3>
            <p
              v-if="item.desc"
              class="desc"
              :title="item.desc"
            >
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
      <div
        ref="loadMoreRef"
        class="load-more-ref"
      ></div>
    </div>
    <p
      v-if="!hasMore"
      class="no-more"
    >
      已加载所有文章~
    </p>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';

import NoHeadImgCpt from '@/components/NoHeadImg/index.vue';
import { getRandomInt } from '@/utils/index';
export default {
  components: {
    NoHeadImgCpt,
  },
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
        v.mockImgHeight = getRandomInt(200, 250) + getRandomInt(0, 50);
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
      isLoading: false,
      isBottom: false, // 是否触底
      isFirst: true, // 是否初次加载
      doneNums: 0, // 已经定位了几个元素
      dndRef: null,
    };
  },
  head() {
    return {
      title: '自然博客',
      meta: [
        {
          name: 'description',
          content: '自然博客 - 首页',
        },
        {
          name: 'keywords',
          content: '自然博客 - 首页',
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
        const waterfallItem = this.$refs['article-item'];
        const waterfallWrap = this.$refs['article-list'];
        waterfallWrap.style.height = 'initial';

        waterfallItem.forEach((v) => {
          v.$el.setAttribute('style', 'width:100%');
          const articleItem = v.$el.querySelector('.article-item');
          const headImg = v.$el.querySelector('.head-img');
          const noHeadImg = v.$el.querySelector('.no-head-img');
          if (articleItem) {
            articleItem.style.removeProperty('display');
            articleItem.style.removeProperty('height');
          }
          if (headImg) {
            headImg.style.removeProperty('height');
            headImg.style.removeProperty('line-height');
          }
          if (noHeadImg) {
            noHeadImg.style.removeProperty('height');
            noHeadImg.style.removeProperty('line-height');
          }
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
    window.scrollTo({ top: 0 });
    window.addEventListener('resize', this.handleResize);
    this.handlePage();
    this.touchBottom();
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    ...mapActions({
      userLogin: 'user/login',
      getUserInfo: 'user/getUserInfo',
    }),
    ...mapMutations({
      setIsWaterFall: 'app/setIsWaterFall',
    }),
    handleResize() {
      const width = window.pageXOffset || document.documentElement.offsetWidth;
      if (width <= 425) {
        this.waterfallParams.column = 2;
      }
      this.handlePage();
    },
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
          v.mockImgHeight = getRandomInt(200, 250) + getRandomInt(0, 50);
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
            if (item.isIntersecting) {
              this.isBottom = true;
            } else {
              this.isBottom = false;
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
      const waterfallWrap = this.$refs['article-list'];
      const waterfallItem = this.$refs['article-item'];
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
        const headImg = el.querySelector('.head-img');
        const noHeadImg = el.querySelector('.no-head-img');
        const waterFall = el.querySelector('.article-item');
        waterFall.style.display = 'block';
        waterFall.style.height = 'auto';
        if (headImg) {
          headImg.style.height = `${headImg.getAttribute('mock-img-height')}px`;
        }
        if (noHeadImg) {
          noHeadImg.style.height = `${noHeadImg.getAttribute(
            'mock-img-height'
          )}px`;
          noHeadImg.style.lineHeight = `${noHeadImg.getAttribute(
            'mock-img-height'
          )}px`;
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
/* 响应式布局 - 小于 720px */
@media screen and (max-width: 720px) {
  .pages-wrap {
    .article-list {
      .article-item {
        display: block !important;
        height: initial !important;
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
    .article-list {
      .article-item {
        display: block !important;
        height: initial !important;
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

  .article-list {
    position: relative;
    .article-item-a {
      display: block;
      color: inherit;
      text-decoration: none;
      margin-bottom: 20px;
      &.water-fall {
        margin-bottom: 0px;
      }
      .article-item {
        position: relative;
        display: flex;
        overflow: hidden;
        box-sizing: border-box;
        height: 250px;
        border: 1px solid $theme-color4;
        border-radius: 6px;
        background-color: white;
        &:hover {
          transition: all 0.2s;
          transform: scale(1.02);
        }
        .head-img-wrap {
          position: relative;
          overflow: hidden;
          flex: 0 0 45%;

          .no-head-img {
            width: 100%;
            height: 250px;
            line-height: 250px;
          }
          .head-img {
            display: inline-block;
            width: 100%;
            height: 250px;
            background-position: center;
            background-size: cover;
            background-repeat: no-repeat;
          }
        }
        .top {
          position: absolute;
          top: 12px;
          right: -45px;
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

        .detail {
          display: flex;
          flex: 1;
          flex-direction: column;
          justify-content: flex-end;
          padding: 0 5px 10px;
          p {
            margin: 6px 0;
          }
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
      }
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
