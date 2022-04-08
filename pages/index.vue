<template>
  <div class="pages-wrap">
    <div ref="waterfall-wrap" v-loading="isLoading" class="waterfall-wrap">
      <article
        v-for="(item, index) in articleList"
        :key="index"
        ref="waterfall-item"
        class="waterfall-item"
      >
        <nuxt-link :to="`/article/${item.id}`" class="a-link">
          <div
            v-lazy:background-image="
              item['head_img']
                ? IMG_CDN_URL + item['head_img']
                : require('@/assets/img/nopic.png')
            "
            class="head-img"
            :style="{
              height: item.mockImgHeight + 'px',
            }"
          ></div>
          <div class="detail">
            <h3 class="title">{{ item.title }}</h3>
            <p class="desc">{{ item.desc }}</p>
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
                  >{{ tagItem.name }}</el-tag
                >
              </div>
              <span v-else>该文章暂无标签~</span>
            </div>
            <div class="info">
              <img
                style="width: 20px; height: 20px; border-radius: 50%"
                :src="item.users[0] && item.users[0].avatar"
                alt=""
              />
              <div>
                <i class="el-icon-date"></i>
                {{ item.created_at | convertDate }}
              </div>
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
        </nuxt-link>
      </article>
      <div ref="loadMoreRef" class="load-more-ref"></div>
    </div>
    <p v-if="!hasMore" class="no-more">已加载所有文章~</p>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import { IMG_CDN_URL } from '@/constant'
import { getRandomInt } from '@/utils/index'
export default {
  components: {},
  layout: 'blog',
  async asyncData({ $axios1, store }) {
    const params = {
      orderName: 'created_at',
      orderBy: 'desc',
      type_ids: store.state.type.typeId,
      nowPage: 1,
      pageSize: 10,
    }
    try {
      const { data } = await $axios1.get(`/article/list`, { params })
      data.rows.forEach((v) => {
        const mockImgHeight = getRandomInt(100, 200) + getRandomInt(0, 50)
        v.mockImgHeight = mockImgHeight
      })
      const articleList = data.rows
      const hasMore = data.hasMore
      return { articleList, hasMore, articleParams: params }
    } catch (error) {
      console.log(error)
    }
  },
  data() {
    return {
      articleList: [],
      hasMore: false,
      articleParams: {},
      IMG_CDN_URL,
      offsetList: [],
      visible: false,
      waterfallParams: {
        column: 3,
        gap: 20,
      },
      isLoading: true,
      isBottom: false, // 是否触底
    }
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
    }
  },
  computed: {
    typeId() {
      return this.$store.state.type.typeId
    },
  },
  watch: {
    async typeId() {
      this.offsetList = []
      this.articleList = []
      this.articleParams.nowPage = 1
      const waterfallWrap = this.$refs['waterfall-wrap']
      waterfallWrap.style.height = '0px'

      this.articleParams.type_ids = this.typeId
      await this.ajaxArticleList(this.articleParams)
      this.handleWaterfall()
    },
    async isBottom(newVal) {
      if (this.isLoading) return
      if (newVal && this.hasMore) {
        this.articleParams.nowPage++
        await this.ajaxArticleList(this.articleParams)
        this.handleWaterfall()
      }
    },
  },
  created() {},
  mounted() {
    window.scrollTo({ top: 0 })
    const d = window.pageXOffset || document.documentElement.offsetWidth
    if (d <= 414) {
      this.waterfallParams.column = 2
    }
    this.handleWaterfall()
    this.isLoading = false
    this.touchBottom()
    // window.addEventListener('scroll', this.headershow)
  },
  destroyed() {
    window.removeEventListener('scroll', this.headershow)
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
        this.isLoading = true
        const { data } = await this.$axios1.get(`/article/list`, { params })
        data.rows.forEach((v) => {
          const mockImgHeight = getRandomInt(100, 200) + getRandomInt(0, 50)
          v.mockImgHeight = mockImgHeight
        })
        if (params.nowPage === 1) {
          this.articleList = data.rows
        } else {
          this.articleList = [...this.articleList, ...data.rows]
        }
        this.hasMore = data.hasMore
        this.isLoading = false
      } catch (error) {
        console.log(error)
        this.isLoading = false
      }
    },
    headershow() {
      // 头部高度为70px
      // const height = 70
      // const offsetTop = window.pageYOffset || document.documentElement.scrollTop
      // this.visible = offsetTop > height
      // if (
      //   document.documentElement.offsetHeight -
      //     (window.innerHeight + offsetTop) <
      //   300
      // ) {
      //   if (this.isLoading || this.end) return
      //   this.currentChange(this.nowPage + 1)
      // }
    },
    // 触底事件
    touchBottom() {
      this.$nextTick(() => {
        const intersectionObserver = new IntersectionObserver((entries) => {
          entries.forEach((item) => {
            if (!item.isIntersecting) {
              this.isBottom = false
            } else {
              this.isBottom = true
            }
          })
        })
        intersectionObserver.observe(this.$refs.loadMoreRef)
      })
    },
    // 瀑布流定位
    handleWaterfall() {
      // 获取数组最小值的下标
      function getMinIndex(arr) {
        return [].indexOf.call(arr, Math.min.apply(null, arr))
      }
      // 获取数组最大值的下标
      function getMaxIndex(arr) {
        return [].indexOf.call(arr, Math.max.apply(null, arr))
      }
      // 列数
      const column = this.waterfallParams.column
      // 间隙
      const gap = this.waterfallParams.gap
      const waterfallWrap = this.$refs['waterfall-wrap']
      const waterfallItem = this.$refs['waterfall-item']
      // 瀑布流容器的宽度
      const waterfallWrapWidth = window.getComputedStyle(waterfallWrap).width
      // 计算减去间隙后，每个item的平均宽度
      const waterfallItemWidth =
        (waterfallWrapWidth.replace('px', '') - (column - 1) * gap) / column
      waterfallWrap.style.position = 'relative'

      if (!waterfallItem) return

      for (
        let i = (this.articleParams.nowPage - 1) * this.articleParams.pageSize;
        i < waterfallItem.length;
        i++
      ) {
        waterfallItem[i].style.position = 'absolute'
        waterfallItem[i].style.width = waterfallItemWidth + 'px'
        if (i < column) {
          this.offsetList.push(waterfallItem[i].offsetHeight) // 第一行不用判断，直接将每个item的offsetHeight保存在数组里
          waterfallItem[i].style.top = '0' // 第一行的top都是0
          if ((i + 1) % column === 1) {
            waterfallItem[i].style.left = 0
          } else {
            const w = i * waterfallItemWidth
            const g = i * gap
            waterfallItem[i].style.left = w + g + 'px'
          }
        } else {
          const minIndex = getMinIndex(this.offsetList)
          const w = minIndex * waterfallItemWidth
          const g = minIndex * gap
          waterfallItem[i].style.top = this.offsetList[minIndex] + gap + 'px' // 计算top
          waterfallItem[i].style.left = w + g + 'px'
          this.offsetList[minIndex] += waterfallItem[i].offsetHeight + gap
        }
      }
      const maxIndex = getMaxIndex(this.offsetList)
      waterfallWrap.style.height = this.offsetList[maxIndex] + 'px'
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/constant.scss';

@keyframes loading {
  to {
    background-position-x: -50%;
  }
}

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
  .waterfall-item {
    overflow: hidden;
    border: 1px solid $theme-color4;
    border-radius: 6px;
    background-color: $theme-color6;
    transition: all 0.5s ease;
    .a-link {
      background-color: $theme-color6;
      color: $theme-color5;
      text-decoration: none;
      display: block;
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
        padding: 5px 10px;
        .title {
          margin: 10px 0;
        }
        .tag-list {
          margin: 8px 0;
        }
        .info {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 5px 0;
          width: 90%;
          font-size: 12px;
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

.v-enter {
  opacity: 0;
  transform: translateX(-10px);
}
.v-enter-active {
  transition: all 0.5s ease;
}
</style>
