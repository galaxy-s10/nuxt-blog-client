<template>
  <ModalCpt
    :visiable="visiable"
    :title="'回复@' + username"
    @update:visiable="closeModal"
  >
    <template #content>
      <TextareaInputCpt @contentChange="contentChange"></TextareaInputCpt>
    </template>
    <template #footer>
      <el-button
        type="primary"
        :loading="loading"
        round
        @click="reply"
      >
        回复
      </el-button>
    </template>
  </ModalCpt>
</template>

<script>
import { mapMutations } from 'vuex';

import ModalCpt from '@/components/Modal/index.vue';
import TextareaInputCpt from '@/components/TextareaInput/index.vue';

export default {
  components: { TextareaInputCpt, ModalCpt },
  props: {
    username: {
      type: String,
      require: true,
      default: '',
    },
  },
  data() {
    return {
      visiable: true,
      loading: false,
      content: '',
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    ...mapMutations({
      setShowLoginModal: 'app/setShowLoginModal',
    }),
    contentChange(newVal, oldVal) {
      this.content = newVal;
    },
    reply() {
      if (!this.$store.state.user.userInfo) {
        this.setShowLoginModal(true);
        this.$newmessage('暂未登录，请登录！', 'warning');
        return;
      }
      if (this.content.length < 5) {
        this.$newmessage('回复内容至少5个字符~', 'warning');
        return;
      }
      this.loading = !this.loading;
      this.$emit('reply', this.content);
    },
    closeModal(v) {
      this.loading = false;
      this.visiable = v;
      this.$emit('closeReply');
    },
  },
};
</script>

<style lang="scss" scoped>
.mask-wrap {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
  background-color: $theme-color8;
  .reply-wrap {
    position: absolute;
    top: 50%;
    left: 50%;
    padding: 20px;
    width: 600px;
    border: 1px solid $theme-color4;
    border-radius: 12px;
    background: $theme-color6;
    transform: translate(-50%, -50%);
    .title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .username {
        font-weight: bold;
      }
    }
    .content {
      margin-top: 26px;
    }
    .btn {
      margin-top: 20px;
      text-align: right;
    }
  }
}
</style>
