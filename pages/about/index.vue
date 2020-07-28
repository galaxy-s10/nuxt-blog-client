<template>
  <div
    class="content"
    style="overflow:hidden;background:white;box-shadow:0 0 5px rgba(0,0,0,.1);padding:30px"
  >
    <h1 style="text-align:center;padding:10px">About</h1>
    <hr class="hrclass" />
    <div>
      <h2>关于我</h2>
      <p style="text-indent:2em">
        喜欢计算机有关的新事物，即使自己是个菜鸡，也有一个远大的目标：将来成为可以独当一面的程序猿。虽然暂时遥不可及，
        但相信不久的将来会实现滴，目前主力web方向，正努力扩展知识面，争取早日达成目标~
      </p>
      <h2>关于本站</h2>
      <p style="text-indent:2em">
        写了本站经历了两个月多，过程收获满满，再此之前也曾用过typecho、wordpress等出色的博客开源系统，
        但作为前端开发人员，总得觉得自己能够写一个出来，因此，这个博客就诞生了！
      </p>
      <h2>技术栈</h2>
      <ul>
        <li>
          <b class="font">Client:</b>
          <span>
            <s>Vue +</s>
            <s>Vue-Router +</s>
            Vuex + ElementUI + Nuxtjs
          </span>
        </li>
        <li>
          <b class="font">Admin:</b>
          Vue-element-template
        </li>
        <li>
          <b class="font">Serve:</b>
          Node + Express + Sequelize + Mysql
        </li>
      </ul>
      <div>
        Ps：后台地址：
        <a
          href="http://admin.zhengbeining.com"
          target="_blank"
          class="alink"
        >http://admin.zhengbeining.com</a>
      </div>
      <h2>联系方式</h2>
      <ul>
        <li>
          <b class="font">QQ:</b>
          2274751790
        </li>
        <li>
          <b class="font">邮箱:</b>
          2274751790@qq.com
        </li>
        <li>
          <b class="font">Github:</b>
          <a
            href="https://github.com/galaxy-s10"
            target="_blank"
            class="alink"
          >https://github.com/galaxy-s10</a>
        </li>
      </ul>
      <h2>本站发展历史</h2>
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :icon="activity.icon"
          :type="activity.type"
          :color="activity.color"
          :size="activity.size"
          :timestamp="activity.timestamp"
        >{{activity.content}}</el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script>
export default {
  layout: "blog",
  data() {
    return {
      activities: [
        {
          content: "第一次尝试写博客并上线",
          timestamp: "2019-9-10",
          color: "#f9f5c7"
        },
        {
          content: "重写前端ui,后台使用vue-element-template",
          timestamp: "2019-10-12",
          color: "#0bbd87"
        },
        {
          content: "重写后端,使用sequelize",
          timestamp: "2019-12-1",
          color: "pink"
        },
        {
          content: "改成ssr利于seo,使用nuxt框架",
          timestamp: "2020-1-20",
          color: "#275cc7"
        },
        {
          content: "修复若干bug,新增jwt验证权限",
          timestamp: "2020-3-1",
          color: "skyblue"
        }
      ]
    };
  },
  head() {
    return {
      title: "关于"
    };
  }
};
</script>


<style scoped>
.font {
  display: inline-block;
  margin-right: 15px;
  font-size: 18px;
  height: 40px;
  line-height: 40px;
}
.alink {
  color: #666;
  text-decoration: none;
}
</style>