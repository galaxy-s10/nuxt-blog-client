<template>
  <div class="tag-wrap">
    <div v-if="tagList">
      <div
        v-for="item in tagList"
        :key="'tag-key-' + item.id"
        class="tag-item"
        :class="{ 'active-tag': currentTagId === item.id }"
        @click="getTagArticle(item.id)"
      >
        <span>{{ item.name }}</span>
        <span class="article-total">({{ item.article_total }})</span>
      </div>
      <article
        v-for="item in articleList"
        :key="'article-key-' + item.id"
        class="article-item"
      >
        <div class="article-l">
          <nuxt-link
            v-if="item['head_img']"
            v-lazy="IMG_CDN_URL + item['head_img']"
            :to="`/article/${item.id}`"
            tag="img"
            class="head-img"
          />
          <nuxt-link
            v-else
            :to="`/article/${item.id}`"
            tag="div"
            class="head-img"
          />
        </div>
        <div class="article-r">
          <nuxt-link
            :to="'/article/' + item.id"
            tag="h2"
            class="singleEllipsis"
          >
            {{ item.title }}
          </nuxt-link>
          <el-divider></el-divider>
          <el-tag
            v-for="tagItem in item.tags"
            :key="'article-tag-key-' + tagItem.id"
            class="overwrite-el-tag"
            size="mini"
            :disable-transitions="false"
            :color="tagItem.color"
            >{{ tagItem.name }}</el-tag
          >
          <div class="summary">
            <img
              class="user-avatar"
              :src="item.users[0] && item.users[0].avatar"
              alt=""
            />
            <span class="jgh"></span>
            <span>{{ item.created_at | convertDate }}</span>
            <span class="jgh"></span>
            <span>{{ item.click }}次浏览</span>
            <span class="jgh"></span>
            <span>{{ item.comment_total }}条评论</span>
            <span class="jgh"></span>
            <div>{{ item.star_total }}个star</div>
          </div>
        </div>
      </article>
      <div v-if="total" class="page-btn">
        <div>
          <el-button
            v-show="articleListParams && articleListParams.nowPage !== 1"
            @click="prePage"
          >
            上一页
          </el-button>
        </div>
        <div>
          <el-button v-show="hasMore" @click="nextPage">下一页</el-button>
        </div>
      </div>
      <div v-else class="no-data">{{ currentTagName }}标签下暂无文章~</div>
    </div>
    <div v-else class="no-data">暂无标签~</div>
  </div>
</template>

<script>
import { IMG_CDN_URL } from '@/constant'

export default {
  components: {},
  layout: 'blog',
  async asyncData({ $axios1, store, params }) {
    const articleListParams = {
      nowPage: 1,
      pageSize: 3,
    }
    const tagListParams = {
      nowPage: 1,
      pageSize: 100,
    }
    const tagId = params.id
    try {
      const { data: tagData } = await $axios1.get(`/api/tag/list`, {
        params: tagListParams,
      })
      const { data: articleData } = await $axios1.get(
        `/api/tag/article_list/${tagId}`,
        {
          params: articleListParams,
        }
      )
      return {
        articleListParams,
        currentTagId: +tagId,
        articleList: articleData.rows,
        hasMore: articleData.hasMore,
        total: articleData.count,
        tagList: tagData.rows,
      }
    } catch (error) {
      console.log(error)
    }
  },
  data() {
    return {
      IMG_CDN_URL,
      currentTagId: 1,
      currentTagName: '',
    }
  },
  head() {
    let title = ''
    this.tagList?.forEach((item) => {
      if (item.id === this.currentTagId) {
        title = item.name
      }
    })
    return {
      title: '标签 - ' + title + ' - 自然博客',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Natural Blog - Tag',
        },
      ],
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // 获取当前标签下的文章
    async getArticleList() {
      const tagId = this.$route.params.id
      this.currentTagId = +tagId
      try {
        const { data } = await this.$axios1.get(
          `/api/tag/article_list/${tagId}`,
          { params: this.articleListParams }
        )
        this.articleList = data.rows
        this.hasMore = data.hasMore
        this.total = data.count
      } catch (error) {
        console.log(error)
      }
    },
    prePage() {
      this.articleListParams.nowPage--
      this.$axios1
        .get(`/api/tag/article_list/${this.currentTagId}`, {
          params: this.articleListParams,
        })
        .then(({ data }) => {
          this.articleList = data.rows
          this.total = data.count
          scrollTo({ top: 0 })
        })
    },
    async nextPage() {
      this.articleListParams.nowPage++
      try {
        const { data } = await this.$axios1.get(
          `/api/tag/article_list/${this.currentTagId}`,
          {
            params: this.articleListParams,
          }
        )
        this.articleList = data.rows
        this.total = data.count
        scrollTo({ top: 0 })
      } catch (error) {
        console.log(error)
      }
    },
    getTagArticle(id) {
      this.$router.push({ path: `/tag/${id}` })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/constant.scss';

@media screen and (max-width: 540px) {
  .main {
    margin: 135px auto 0;
    padding: 0;
  }
  .content {
    padding: 0 10px;
  }
  .img {
    height: 200px !important;
  }
}
.tag-wrap {
  overflow: hidden;
  padding: 30px;
  border: 1px solid $theme-color4;
  border-radius: 5px;
  background: $theme-color6;
  .no-data {
    padding: 40px 0;
    text-align: center;
  }
}
.page-btn {
  display: flex;
  justify-content: space-between;
}

.article-item {
  display: flex;
  margin-bottom: 15px;
  width: 100%;
  border-radius: 5px;
  background: white;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.05);
}
.article-l {
  overflow: hidden;
  flex: 0 0 40%;
  margin: 20px;
  .head-img {
    width: 100%;
    height: 100%;
    background-image: url('@/assets/img/nopic.png');
    background-position: 50% 50%;
    background-size: cover;
    background-repeat: no-repeat;
    cursor: pointer;
    transition: all 0.3s ease 0s;
  }
}
.article-r {
  overflow: hidden;
  box-sizing: border-box;
  padding: 30px;
}
.summary {
  display: flex;
  align-items: center;
  margin: 10px 0;
  font-size: 12px;
  .user-avatar {
    width: 20px;
    height: 20px;
    border-radius: 50%;
  }
}
.head_img {
  width: 100%;
  height: 100%;
  background-position: 50% 50%;
  background-size: cover;
  transition: all 0.3s ease 0s;
}
.head_img:hover {
  transform: scale(1.1);
}

.tag-item {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px;
  padding: 0 10px;
  height: 30px;
  border: 1px solid rgba(93, 121, 148, 0.15);
  border-radius: 3px;
  background-color: white;

  &:hover {
    cursor: pointer;
  }
  &::after {
    position: absolute;
    top: 50%;
    left: -1px;
    width: 8px;
    height: 8px;
    border-width: 0 0 1px 1px;
    border-style: solid;
    border-color: inherit;
    background-color: inherit;
    content: '';
    transform: translateX(-50%) translateY(-50%) rotate(45deg);
  }
  .article-total {
    margin-left: 6px;
  }
  &.active-tag {
    border: 1px solid #005cc5 !important;
  }
}

.jgh::after {
  padding: 0 5px;
  content: '·';
  font-weight: 600;
}
.tag {
  overflow: hidden;
  padding: 30px;
  background: white;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

.overwrite-el-tag {
  /* margin: 5px 10px; */
  color: white;
}
</style>

<style scoped>
.tag /deep/ .el-tag {
  border: none;
  color: white;
}
.tag /deep/ .el-tag .el-icon-close {
  color: white;
}
.tag /deep/ .el-tag .el-icon-close:hover {
  background-color: transparent;
}
</style>
