<template>
  <AsnycCollapseCpt
    class="releation-info"
    title="站点信息"
    open
  >
    <template #ico>
      <i class="el-icon-setting"></i>
    </template>
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
        <div>微信</div>
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
  </AsnycCollapseCpt>
</template>

<script>
export default {
  components: {
    AsnycCollapseCpt: () => import('@/components/Collapse/index.vue'),
  },
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
    console.log('---', process.env, process.env.NUXT_BLOG_VERSION);
    this.version = process.env.NUXT_BLOG_VERSION;
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.releation-info {
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
    font-size: 15px;
    text-align: right;
  }
}
</style>
