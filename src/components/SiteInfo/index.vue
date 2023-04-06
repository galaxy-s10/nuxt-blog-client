<template>
  <div class="site-info">
    <div class="list">
      <div class="item">
        <div class="wechat_logo_wrap">
          <img
            src="@/assets/img/wechat_logo.webp"
            class="logo"
            alt="wechat_logo"
          />
          <img
            src="@/assets/img/wechat_code.webp"
            class="code"
            alt="wechat_code"
          />
        </div>
        <div>wechat</div>
      </div>
      <div class="item">
        <a
          class="bilibili_logo"
          href="https://live.bilibili.com/26191492"
          target="_blank"
        >
          <img
            src="@/assets/img/bilibili_logo.webp"
            class="logo"
            alt="bilibili_logo"
          />
        </a>
        <div>bilibili</div>
      </div>
      <div class="item">
        <a
          class="github_logo_wrap"
          href="https://github.com/galaxy-s10"
          target="_blank"
        >
          <img
            src="@/assets/img/github_logo.webp"
            class="logo"
            alt="github_logo"
          />
        </a>
        <div>github</div>
      </div>
      <div class="item">
        <a
          class="admin_logo_wrap"
          href="https://admin.hsslive.cn/"
          target="_blank"
        >
          <img
            src="@/assets/img/admin_logo.webp"
            class="logo"
            alt="admin_logo"
          />
        </a>
        <div>后台</div>
      </div>
    </div>
    <div class="ver">v{{ version }}</div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      version: '',
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.version = process.env.NUXT_BLOG_VERSION;
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.site-info {
  margin-top: 10px;
  .list {
    display: flex;
    align-items: center;
    .item {
      margin-right: 20px;
      width: 50px;
      text-align: center;
    }
    .logo {
      width: 30px;
      height: 30px;
      cursor: pointer;
    }
    .bilibili_logo_wrap {
      position: relative;
      display: inline-block;
      &:hover {
        .code {
          display: block;
        }
      }
      .code {
        position: absolute;
        top: 0;
        left: 50%;
        display: none;
        width: 100px;
        height: 100px;
        transform: translate(-50%, -100%);
      }
    }
    .wechat_logo_wrap {
      position: relative;
      display: inline-block;
      &:hover {
        .code {
          display: block;
        }
      }
      .code {
        position: absolute;
        top: 0;
        left: 50%;
        display: none;
        width: 100px;
        height: 100px;
        transform: translate(-50%, -100%);
      }
    }
  }
  .ver {
    text-align: right;
    font-size: 15px;
  }
}
</style>
