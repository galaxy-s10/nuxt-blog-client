<template>
  <aside>
    <div class="user-info">
      <div class="bgc"></div>
      <img class="avatar" :src="avatar" />
      <div class="info">
        <div class="name">
          <b> {{ name }}</b>
        </div>
        <div class="title">{{ title }}</div>
      </div>
    </div>

    <div v-if="summary && Object.keys(summary).length" class="summary-info">
      <div class="title">
        <i class="el-icon-user"></i>
        <b>用户信息</b>
      </div>
      <div class="item">
        角色: {{ summary.roles.map((v) => v.role_description).join() }}
      </div>
      <div class="item">文章数: {{ summary.articleTotal }}</div>
      <div class="item">获赞数: {{ summary.starTotal }}</div>
      <div class="item">评论数: {{ summary.commentTotal }}</div>
      <div class="item">
        qq绑定: {{ summary.qq_users.length ? '已绑定' : '未绑定' }}
      </div>
      <div class="item">
        github绑定:{{ summary.github_users.length ? '已绑定' : '未绑定' }}
      </div>
    </div>

    <div class="visitor-info">
      <div class="title">
        <i class="el-icon-position"></i>
        <b>访客信息</b>
      </div>
      <div class="item">ip: {{ ipInfo.ip }}</div>
      <div class="item">
        location:
        {{
          ipInfo.country +
          ' - ' +
          ipInfo.province +
          ' - ' +
          ipInfo.city +
          ' - ' +
          ipInfo.district
        }}
      </div>
    </div>

    <div class="log-info">
      <div class="title">
        <i class="el-icon-data-analysis"></i>
        <b>流量信息</b>
      </div>
      <div class="item">历史总访问量: {{ visitorData.allVisitorNumber }}</div>
      <div class="item">历史总访客量:{{ visitorData.allVisitorPeople }}</div>
      <div class="item">
        今天总访问数:{{ visitorData.nowDayallVisitorNumber }}
      </div>
      <div class="item">
        今天总访客数:{{ visitorData.nowDayAllVisitorPeople }}
      </div>
    </div>

    <div class="article-info">
      <div class="title">
        <div>
          <i class="el-icon-medal"></i>
          <b>{{ hotOrLastUpdate === 'hot' ? '热门文章' : '最近更新' }}</b>
        </div>
        <span @click="switchType">切换</span>
      </div>
      <div v-loading="switchTypeLoading">
        <div v-if="hotlist.length">
          <div v-for="(item, index) in hotlist" :key="index" class="item">
            <div class="head-img">
              <nuxt-link
                v-lazy="imgCdnUrl + item['head_img']"
                :to="'/article/' + item.id"
                tag="img"
              />
            </div>
            <div class="desc">
              <nuxt-link :to="'/article/' + item.id" tag="b"
                >#{{ item.title }}</nuxt-link
              >
              <div class="info">
                <span class="el-icon-view" style="margin-right: 6px">{{
                  item.click
                }}</span>
                <div v-if="hotOrLastUpdate === 'hot'">
                  <i class="el-icon-star-off"></i>{{ item.stars.length }}
                </div>
                <div v-else>
                  <i class="el-icon-date"></i>{{ format1(item.updated_at) }}更新
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else>暂无文章~</div>
      </div>
    </div>

    <div class="tag-info">
      <div class="title">
        <i class="el-icon-collection-tag"></i>
        <b>标签云</b>
      </div>
      <div v-if="tagList.length">
        <el-tooltip
          v-for="item in tagList"
          :key="item.id"
          effect="dark"
          :content="'该标签下有' + item.articles.length + '篇文章'"
          placement="top"
        >
          <el-tag
            class="tag-margin"
            :disable-transitions="false"
            :color="item.color"
            @click="tagClick(item.id)"
            >{{ item.name }}</el-tag
          >
        </el-tooltip>
      </div>
      <div v-else>暂无标签~</div>
    </div>

    <div v-if="showCatalog" class="catalog-info">
      <div class="title">
        <i class="el-icon-paperclip"></i>
        <b>文章目录</b>
      </div>
      <CatalogCpt :list="catalogList"></CatalogCpt>
    </div>
  </aside>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { format1 } from '@/utils/format.js'
import { imgCdnUrl } from '@/constant'
import CatalogCpt from '@/components/catalog'
export default {
  components: { CatalogCpt },
  data() {
    return {
      imgCdnUrl,
      switchTypeLoading: false,
    }
  },
  computed: {
    ...mapState({
      hotOrLastUpdate(state) {
        return state.article.hotOrLastUpdate
      },
      ipInfo(state) {
        return state.app.ipInfo
      },
      visitorData(state) {
        return state.app.visitorData
      },
      name(state) {
        return state.user.name === null ? 'NuxtBlog' : state.user.name
      },
      summary(state) {
        return state.user.summary
      },
      avatar(state) {
        return state.user.avatar === null
          ? require('~/assets/img/default_avatar.jpg')
          : state.user.avatar
      },
      title(state) {
        return state.user.title === null ? 'Hello world' : state.user.title
      },
    }),
    tagList() {
      return this.$store.state.tag.tagList
    },
    hotlist() {
      return this.$store.state.article.hotlist
    },
    catalogList() {
      return this.$store.state.article.catalogList
    },
    showCatalog() {
      return this.$store.state.article.showCatalog
    },
  },
  async mounted() {
    // 开发环境会报错，需要注释下面两行代码
    await this.getIpInfo()
    // await this.getVisitorData();
  },

  methods: {
    ...mapActions('app', ['getIpInfo', 'getVisitorData']),
    ...mapActions('article', ['getArticleHotList', 'getArticleLastUpdateList']),
    format1(time) {
      return format1(time)
    },
    tagClick(id) {
      this.$router.push({ path: `/tag/${id}` })
    },
    async switchType() {
      this.switchTypeLoading = true
      if (this.hotOrLastUpdate === 'hot') {
        await this.getArticleLastUpdateList({
          orderName: 'updated_at',
          orderBy: 'desc',
          nowpage: 1,
        })
      } else {
        await this.getArticleHotList({
          orderName: 'click',
          orderBy: 'desc',
          nowpage: 1,
        })
      }
      this.switchTypeLoading = false
    },
  },
}
</script>

<style lang="scss" scoped>
.user-info {
  overflow: hidden;
  padding-bottom: 10px;
  border-radius: 5px;
  background: white;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 5px;
  .bgc {
    height: 90px;
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
  .avatar {
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
    .name,
    .title {
      text-align: center;
    }
  }
}
.summary-info {
  overflow: hidden;
  margin-top: 20px;
  padding: 10px;
  border-radius: 5px;
  background: white;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 5px;

  .title {
    margin: 8px 0;
  }
  .item {
    margin-bottom: 4px;
  }
}
.visitor-info {
  overflow: hidden;
  margin-top: 20px;
  padding: 10px;
  border-radius: 5px;
  background: white;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 5px;
  .title {
    margin: 8px 0;
  }
  .item {
    margin-bottom: 4px;
  }
}
.log-info {
  overflow: hidden;
  margin-top: 20px;
  padding: 10px;
  border-radius: 5px;
  background: white;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 5px;
  .title {
    margin: 8px 0;
  }
  .item {
    margin-bottom: 4px;
  }
}
.article-info {
  overflow: hidden;
  margin-top: 20px;
  padding: 10px;
  border-radius: 5px;
  background: white;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 5px;
  .title {
    display: flex;
    justify-content: space-between;
    margin: 8px 0;
  }
  .item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    height: 60px;
    &:last-child {
      margin-bottom: 0 !important;
    }
    .head-img {
      overflow: hidden;
      width: 40%;
      img {
        max-height: 100%;
        width: 100%;
        border-radius: 5px;
        cursor: pointer;
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
        width: 100%;
      }
    }
  }
}
.tag-info {
  overflow: hidden;
  margin-top: 20px;
  padding: 10px;
  border-radius: 5px;
  background: white;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 5px;
  .title {
    margin: 8px 0;
  }
  .tag-margin {
    margin-right: 5px;
    margin-bottom: 5px;
    color: white;
  }
}
.catalog-info {
  overflow: hidden;
  margin-top: 20px;
  padding: 10px;
  border-radius: 5px;
  background: white;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 5px;
  .title {
    margin: 8px 0;
  }
  .tag-margin {
    margin-right: 5px;
    color: white;
  }
}
</style>

<style scoped>
.tag /deep/ .el-tag .el-icon-close {
  color: white;
}
.tag /deep/ .el-tag .el-icon-close:hover {
  background-color: transparent;
}
</style>
