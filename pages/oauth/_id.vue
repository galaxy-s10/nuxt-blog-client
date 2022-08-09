<template>
  <div>{{ login_method }}登录成功！</div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      login_method: '',
    };
  },
  mounted() {
    const { code } = this.$route.query;
    const qqLogin = this.$route.params.id === 'qq_login';
    const githubLogin = this.$route.params.id === 'github_login';

    if (qqLogin) {
      this.login_method = 'QQ';
      window.opener.postMessage(
        {
          type: 'qq_login',
          data: code,
        },
        '*'
      );
      window.close();
    }
    if (githubLogin) {
      this.login_method = 'GitHub';
      window.opener.postMessage(
        {
          type: 'github_login',
          data: code,
        },
        '*'
      );
      window.close();
    }
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/css/constant.scss';
</style>
