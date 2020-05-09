<template>
  <div
    class="content"
    style="overflow:hidden;background:white;box-shadow:0 0 5px rgba(0,0,0,.1);padding:30px"
  >
    <h1 style="text-align:center;padding:10px">友链</h1>
    <hr class="hrclass" />
    <ul style="padding:0;margin:0;overflow:hidden;margin:40px 0">
      <li class="liitem">
        <a href="http://lsyblog.com" class="alink" target="_bank">
          <div class="linkborder">
            <div style="flex:1">
              <div style="color:#ffa7a6">玉捷博客</div>
              <div class="ellipsis">不做后悔事，做了不后悔。</div>
            </div>
            <div>
              <img src="../../assets/imgs/link.jpg" class="img" style="border:2px solid #eee" />
            </div>
          </div>
        </a>
      </li>
      <li class="liitem">
        <a href="http://47.95.198.156" class="alink" target="_bank">
          <div class="linkborder">
            <div style="flex:1">
              <div style="color:#ffa7a6">元不留行</div>
              <div class="ellipsis">不怕千万人阻挡，只怕自己投降</div>
            </div>
            <div>
              <img src="../../assets/imgs/link1.jpg" class="img" style="border:2px solid #eee" />
            </div>
          </div>
        </a>
      </li>
      <li class="liitem">
        <a href="http://121.199.15.224" class="alink" target="_bank">
          <div class="linkborder">
            <div style="flex:1">
              <div style="color:#ffa7a6">cat</div>
              <div class="ellipsis">道阻且长，行则将至，行而不辍，未来可期</div>
            </div>
            <div>
              <img src="../../assets/imgs/link2.jpg" class="img" style="border:2px solid #eee" />
            </div>
          </div>
        </a>
      </li>
      <li class="liitem">
        <a href="https://www.zhengbeining.com/xcx/" class="alink" target="_bank">
          <div class="linkborder">
            <div style="flex:1">
              <div style="color:#ffa7a6">网易云Api</div>
              <div class="ellipsis">进度：1%</div>
            </div>
            <div>
              <img
                src="https://img.cdn.zhengbeining.com/%E6%AF%94%E5%BE%B7%E5%B0%94.jpg"
                class="img"
                style="border:2px solid #eee"
              />
            </div>
          </div>
        </a>
      </li>
    </ul>
    <div style="text-align:center;margin:30px 0">
      <h2>欢迎大家交换友链~</h2>
    </div>
    <el-input
      type="textarea"
      resize="none"
      :rows="5"
      show-word-limit
      maxlength="200"
      v-model="content"
    ></el-input>
    <p style="text-align:right">
      <el-button type="primary" disabled>申请</el-button>
    </p>
    <div></div>
  </div>
</template>

<script>
export default {
  layout: "blog",
  data() {
    return {
      content: ""
    };
  },
  head() {
    return {
      title: "友链"
    };
  },
  methods: {},
  mounted() {}
};
</script>


<style scoped>
@media screen and (max-width: 720px) {
  .liitem {
    width: 45% !important;
  }
}
@media screen and (max-width: 540px) {
  .liitem {
    width: 90% !important;
    margin: 15px auto !important;
    float: none !important;
  }
}
.liitem::before {
  content: "";
  background-color: rgba(255, 174, 173, 0.3);
  height: 100%;
  width: 0;
  left: -60px;
  position: absolute;
  transform: skewX(45deg);
  transition: all 0.5s;
  z-index: -1;
}
.liitem:hover {
  z-index: 2;
}
.liitem:hover:before {
  width: 160%;
}
.liitem:hover .linkborder {
  border-color: #ffaead;
}
.liitem:hover .img {
  transform: rotate(360deg);
  transition: all 0.5s;
}
.alink {
  color: #666;
  text-decoration: none;
}
.ellipsis {
  font-size: 13px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  border-top: 2px dashed #eee;
  padding-top: 10px;
  margin-top: 10px;
}
.liitem {
  width: 30%;
  float: left;
  margin: 5px;
  position: relative;
  list-style: none;
  overflow: hidden;
}
.linkborder {
  padding: 10px 18px;
  display: flex;
  justify-content: space-between;
  border: 1px solid #eee;
  border-radius: 5px;
}
.img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  left: 25px;
  transition: all 0.5s;
}
</style>