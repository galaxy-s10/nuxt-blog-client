<template>
  <div>
    <div
      class="tag"
      style="
        overflow: hidden;
        background: white;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
        padding: 30px;
      "
    >
      <div v-if="tagList.length">
        <div
          v-for="item in tagList"
          :key="item.id"
          class="newtag"
          :class="{ currenttag: currentTagId === item.id }"
          @click="getTagArticle(item.id)"
        >
          <span>{{ item.name }}</span>
          <span style="margin-left: 10px">{{ item && item.length }}</span>
        </div>
        <div>
          <article
            v-for="(item, index) in articleList"
            :key="index"
            class="article-con"
          >
            <div class="article-l">
              <nuxt-link
                v-if="item['head_img']"
                v-lazy="imgCdnUrl + item['head_img']"
                :to="`/article/${item.id}`"
                tag="img"
                class="img"
              />
              <nuxt-link
                v-else
                :to="`/article/${item.id}`"
                tag="div"
                class="no-img"
              />
            </div>
            <div class="article-r">
              <nuxt-link
                :to="'/article/' + item.id"
                tag="h2"
                class="overtext"
                >{{ item.title }}</nuxt-link
              >
              <el-divider></el-divider>
              <div>
                <el-tag
                  v-for="(tagItem, tagIndex) in item.tags"
                  :key="tagIndex"
                  class="tag-margin"
                  size="mini"
                  :disable-transitions="false"
                  :color="tagItem.color"
                  >{{ tagItem.name }}</el-tag
                >
              </div>
              <div class="xxxx">
                <img
                  style="width: 20px; height: 20px; border-radius: 50%"
                  :src="item.users[0] && item.users[0].avatar"
                  alt=""
                />
                <div class="jgh"></div>
                <div class="jgh">{{ format1(item.created_at) }}</div>
                <div class="jgh">{{ item.click }}次浏览</div>
                <div class="jgh">{{ item.comments.length }}条评论</div>
                <div>{{ item.stars.length }}个star</div>
              </div>
            </div>
          </article>
          <div v-if="count != 0" class="page-btn">
            <div>
              <el-button v-show="nowPage != 1" @click="prePage"
                >上一页</el-button
              >
            </div>
            <div>
              <el-button v-show="maxSize != nowPage" @click="nextPage"
                >下一页</el-button
              >
            </div>
          </div>
          <div v-else style="text-align: center; padding: 40px 0">
            {{ currentTagName }}标签下暂无文章~
          </div>
        </div>
      </div>
      <div v-else>暂无标签~</div>
    </div>
  </div>
</template>

<script>
import { format1 } from '@/utils/format.js'
import { imgCdnUrl } from '@/constant'

export default {
  components: {},
  layout: 'blog',
  async asyncData({ $axios1, params }) {
    const { rows } = await $axios1.get('/api/tag/list?nowPage=1&pageSize=100')
    // 分页大小
    const pageSize = 3
    const rows1 = await $axios1.get(
      `/api/tag/article_list/${params.id}?nowPage=1&pageSize=${pageSize}`
    )

    return {
      // 页数
      pageSize,
      // 所有标签
      tagList: rows,
      // 标签下的文章
      articleList: rows1.rows,
      // 标签下的文章总条数
      count: rows1.count,
      // 最大页码
      maxSize: Math.ceil(rows1.count / pageSize),
    }
  },
  data() {
    return {
      imgCdnUrl,
      tagList: null,
      currentTagId: 1,
      currentTagName: '',
      nowPage: 1,
      maxSize: null,
    }
  },
  head() {
    let title
    this.tagList.forEach((item) => {
      if (item.id === this.currentTagId) {
        title = item.name
      }
    })
    return {
      title: '标签 - ' + title + ' - 自然博客',
      meta: [{ hid: 'home', name: 'description', content: '自然 - 个人博客' }],
    }
  },
  created() {},
  mounted() {
    this.currentTagId = +this.$route.params.id
    this.tagList.forEach((item) => {
      if (item.id === this.currentTagId) {
        this.currentTagName = item.name
      }
    })
  },
  methods: {
    // 格式化时间
    format1(time) {
      return format1(time)
    },
    prePage() {
      this.nowPage--
      this.$axios1
        .get(`/api/tag/article_list/${this.currentTagId}`, {
          params: {
            nowPage: this.nowPage,
            pageSize: this.pageSize,
          },
        })
        .then((res) => {
          this.articleList = res.rows
          this.count = res.count
          scrollTo({ top: 0 })
        })
    },
    nextPage() {
      this.nowPage++
      this.$axios1
        .get(`/api/tag/article_list/${this.currentTagId}`, {
          params: {
            nowPage: this.nowPage,
            pageSize: this.pageSize,
          },
        })
        .then((res) => {
          this.articleList = res.rows
          this.count = res.count
          scrollTo({ top: 0 })
        })
    },
    getTagArticle(id) {
      this.currentTagId = id
      this.tagList.forEach((item) => {
        if (item.id === this.currentTagId) {
          this.currentTagName = item.name
        }
      })
      this.nowPage = 1
      this.$router.push({ path: `/tag/${id}` })
    },
  },
}
</script>

<style lang="scss" scoped>
@media screen and (max-width: 540px) {
  .main {
    padding: 0;
    margin: 135px auto 0;
  }
  .content {
    padding: 0 10px;
  }
  .img {
    height: 200px !important;
  }
}
.page-btn {
  display: flex;
  justify-content: space-between;
}
.article-con {
  display: flex;
  width: 100%;
  background: white;
  margin-bottom: 15px;
  border-radius: 5px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.05);
}
.article-l {
  flex: 0 0 40%;
  margin: 20px;
  overflow: hidden;
  .no-img {
    background-position: 50% 50%;
    background-size: cover;
    height: 100%;
    width: 100%;
    transition: all 0.3s ease 0s;
    background-image: url('@/assets/img/nopic.png');
    background-repeat: no-repeat;
  }
}
.article-r {
  box-sizing: border-box;
  padding: 30px;
  overflow: hidden;
}
.xxxx {
  font-size: 12px;
  display: flex;
  align-items: center;
  margin: 10px 0;
}
.img {
  background-position: 50% 50%;
  background-size: cover;
  height: 100%;
  width: 100%;
  transition: all 0.3s ease 0s;
}
.img:hover {
  transform: scale(1.1);
}
.currenttag {
  border: 1px solid #005cc5 !important;
}
.newtag {
  display: inline-block;
  background-color: white;
  border: 1px solid rgba(93, 121, 148, 0.15);
  border-radius: 3px;
  height: 30px;
  line-height: 30px;
  padding: 0 10px;
  margin: 10px;
  position: relative;
}
.newtag:hover {
  cursor: pointer;
}
.newtag::after {
  content: '';
  position: absolute;
  left: -1px;
  top: 50%;
  width: 8px;
  height: 8px;
  border-width: 0 0 1px 1px;
  border-color: inherit;
  border-style: solid;
  background-color: inherit;
  transform: translateX(-50%) translateY(-50%) rotate(45deg);
}
.jgh::after {
  content: '·';
  font-weight: 600;
  padding: 0 5px;
}
.tag {
  overflow: hidden;
  background: white;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

.tag-margin {
  display: inline-block;
  margin: 5px 10px;
}
</style>

<style scoped>
.tag /deep/ .el-tag {
  color: white;
  border: none;
}
.tag /deep/ .el-tag .el-icon-close {
  color: white;
}
.tag /deep/ .el-tag .el-icon-close:hover {
  background-color: transparent;
}
</style>
