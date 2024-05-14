<template>
  <div class="reply-wrap">
    <ModalCpt
      :visiable="visiable"
      :title="'回复@' + username"
      :width="width"
      @update:visiable="closeModal"
    >
      <template #content>
        <TextareaInputCpt @contentChange="contentChange"></TextareaInputCpt>
      </template>
      <template #footer>
        <div class="btn">
          <div class="err">{{ errMsg }}</div>
          <el-button
            type="primary"
            :loading="loading"
            round
            @click="reply"
          >
            回复
          </el-button>
        </div>
      </template>
    </ModalCpt>
  </div>
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
      width: '50%',
      visiable: true,
      loading: false,
      content: '',
      errMsg: '',
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    if (document.documentElement.clientWidth < 600) {
      this.width = '80%';
    }
  },
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
      if (this.content.length < 2) {
        this.errMsg = '回复内容至少2个字符~';
        this.$newmessage(this.errMsg, 'warning');
        return;
      }
      this.errMsg = '';
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
.reply-wrap {
  .btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 20px;
    .err {
      color: $theme-color7;
    }
  }
}
</style>
