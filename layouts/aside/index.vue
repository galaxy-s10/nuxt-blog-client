<template>
  <!-- 右侧-->
  <aside class="navb">
    <div class="user">
      <div class="bgc"></div>
      <div style="position: relative">
        <img :src="avatar" class="img" alt />
        <span class="username">{{ name }}</span>
        <p class="usertitle">{{ title }}</p>
      </div>
    </div>
    <div class="ip-info">
      <div style="padding: 10px 0 10px 10px">
        <h1 style="display: inline-block; font-size: 18px; margin: 5px 0">
          <span
            class="el-icon-location-outline"
            style="font-size: 18px; font-weight: blod; margin-right: 4px"
          ></span>
          访客信息
        </h1>
        <div v-loading="!ipInfo">
          <div style="padding: 10px 0">IP：{{ ipInfo.ip }}</div>
          <div>
            位置：{{ ipInfo.country + " - " + ipInfo.region + " - " + ipInfo.city }}
          </div>
        </div>
      </div>
    </div>
    <div class="ip-info" style="font-size: 14px; font-weight: bold; padding-right: 10px">
      <div style="padding: 10px 0 10px 10px">
        <h1 style="display: inline-block; font-size: 18px; margin: 5px 0">
          <span
            class="el-icon-s-data"
            style="font-size: 18px; font-weight: blod; margin-right: 4px"
          ></span>
          流量信息
        </h1>
        <div v-loading="!visitorData">
          <div style="display: flex; justify-content: space-between; align-items: center">
            <div style="padding: 10px 0">
              历史总访问量：{{ visitorData.allVisitorNumber }}
            </div>
            <div style="padding: 10px 0">
              历史总访客量：{{ visitorData.allVisitorPeople }}
            </div>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center">
            <div style="padding: 10px 0">
              今天总访问数：{{ visitorData.nowDayallVisitorNumber }}
            </div>
            <div>今天总访客数：{{ visitorData.nowDayAllVisitorPeople }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="hotart">
      <div style="padding: 10px 0 10px 10px">
        <span
          class="el-icon-trophy"
          style="font-size: 18px; font-weight: blod; margin-right: 4px"
        ></span>
        <h1 style="display: inline-block; font-size: 18px; margin: 5px 0">热门文章</h1>
      </div>
      <div style="padding-left: 10px; overflow: hidden">
        <div
          v-for="(item, index) in hotlist"
          :key="index"
          style="margin-bottom: 10px; max-height: 60px; display: flex"
        >
          <div class="aside-l">
            <nuxt-link
              :to="'/article/' + item.id"
              tag="img"
              v-lazy="item.img"
              class="img1"
            />
          </div>

          <div class="aside-r">
            <nuxt-link :to="'/article/' + item.id" tag="h4" class="tcss"
              >#{{ item.title }}</nuxt-link
            >
            <div style="margin: 2px 0">
              <span class="el-icon-date tcss1" style="padding: 0 2px">{{
                format1(item.date)
              }}</span>
              <span class="el-icon-view tcss1" style="padding: 0 2px">{{
                item.click
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="hotart tag">
      <div style="padding: 10px 0 10px 10px">
        <!-- <span class="el-icon-trophy" style="font-size:18px;font-weight:blod;margin-right:4px"></span> -->
        <h1 style="display: inline-block; font-size: 18px; margin: 5px 0">标签云</h1>
      </div>
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
  </aside>
</template>

<script>
import { format1 } from "@/utils/format.js";
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      // tagList: null
      // isLoading:false,
    };
  },
  methods: {
    ...mapActions("app", ["getIpInfo", "getVisitorData"]),
    format1(time) {
      return format1(time);
    },
    tagClick(id) {
      this.$router.push({ path: `/tag/${id}` });
    },
  },
  computed: {
    ...mapState({
      ipInfo(state) {
        return state.app.ipInfo;
      },
      visitorData(state) {
        return state.app.visitorData;
      },
      name(state) {
        return state.user.name == null ? "VueBlog" : state.user.name;
      },
      avatar(state) {
        require("../../assets/imgs/3.jpg");
        return state.user.avatar == null
          ? require("../../assets/imgs/3.jpg")
          : state.user.avatar;
      },
      title(state) {
        return state.user.title == null ? "A Single Page App" : state.user.title;
      },
    }),
    tagList() {
      return this.$store.state.tag.tagList;
    },
    hotlist() {
      return this.$store.state.article.hotlist;
    },
  },
  mounted() {
    this.getIpInfo();
    this.getVisitorData();
  },
};
</script>

<style scoped>
.tcss {
  cursor: pointer;
  padding: 0;
  margin: 0;
  transition: all 0.3s ease-in-out;
}
.tcss1 {
  font-size: 10px;
}
.tcss:hover {
  margin-left: 5px;
  color: #53a8ff;
}
.bgc {
  background: url("../../assets/imgs/bgc.jpg") no-repeat 50%;
  height: 120px;
  background-size: cover;
}
.img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  position: absolute;
  top: -40px;
  left: 25px;
  transition: all 0.5s;
}
.img:hover {
  transform: rotate(360deg);
  transition: all 0.5s;
}
.aside-l img {
  width: 100%;
  height: 100%;
  border-radius: 5px;
  cursor: pointer;
  /* background-size: cover; */
}
.img1 {
  transition: all 0.3s ease 0s;
}
.img1:hover {
  transform: scale(1.1);
}
.username {
  margin: 0;
  padding: 0;
  padding-left: 120px;
  font-size: 18px;
  font-weight: 800;
}
.usertitle {
  margin: 0;
  padding: 30px;
  font-size: 18px;
}
.aside-l {
  /* width: 40%; */
  flex: 0 0 30%;
  overflow: hidden;
}
.aside-r {
  box-sizing: border-box;
  overflow: hidden;
  margin-left: 10px;
  font-size: 14px;
}
.tag /deep/ .el-tag {
  color: white;
}
.tag /deep/ .el-tag:hover {
  cursor: pointer;
}
.tag /deep/ .el-tag .el-icon-close {
  color: white;
}
.tag /deep/ .el-tag .el-icon-close:hover {
  background-color: transparent;
}
.tag-margin {
  display: inline-block;
  margin: 5px 10px;
}
</style>
