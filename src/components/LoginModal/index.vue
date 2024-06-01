<template>
  <div>
    <ModalCpt
      :visiable="visiable"
      title="登录"
      top="40%"
      class="login-modal-wrap"
      :hidden-footer="true"
      @update:visiable="closeModal"
    >
      <template #content>
        <div class="logo-list">
          <div class="item">
            <img
              v-if="frontendData?.allow_qq_login?.value === '1'"
              class="logo"
              src="@/assets/img/qq_logo.svg"
              alt=""
              @click="qqLogin"
            />
            <div>qq登录</div>
          </div>
          <div class="item">
            <img
              v-if="frontendData?.allow_github_login?.value === '1'"
              class="logo"
              src="@/assets/img/github_logo.svg"
              alt=""
              @click="githubLogin"
            />
            <div>github登录</div>
          </div>
        </div>
      </template>
      <template #footer></template>
    </ModalCpt>
  </div>
</template>

<script>
import ModalCpt from '@/components/Modal/index.vue';
import { loginMixin } from '@/mixin/login';

export default {
  components: { ModalCpt },
  mixins: [loginMixin],
  model: {
    prop: 'visiable',
    event: 'close666',
  },
  props: {
    visiable: {
      type: Boolean,
      require: true,
      default: false,
    },
  },
  data() {
    return {};
  },
  computed: {
    frontendData() {
      return this.$store.state.app.frontendData;
    },
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    closeModal() {
      this.$emit('close666', false);
    },
  },
};
</script>

<style lang="scss" scoped>
.login-modal-wrap {
  .logo-list {
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding-bottom: 10px;
    .item {
      width: 80px;
      text-align: center;
      cursor: pointer;

      .logo {
        width: 50px;
      }
    }
  }
}
</style>
