<template>
  <div class="mask-cpt-wrap" @click.self="closeModal($event)">
    <div class="modal-wrap" :style="{ top: top }">
      <div class="title-wrap">
        <span class="title">{{ title }}</span>
        <i
          class="el-icon-close"
          style="cursor: pointer"
          @click="closeModal()"
        ></i>
      </div>
      <div class="content">
        <slot name="content"></slot>
      </div>
      <div class="footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    title: {
      type: String,
      require: true,
      default: '',
    },
    top: {
      type: Boolean,
      require: true,
    },
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    closeModal() {
      this.loading = false;
      this.$emit('closeModal');
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/css/constant.scss';

.mask-cpt-wrap {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 102;
  background-color: $theme-color8;
  .modal-wrap {
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translateX(-50%);
    width: 600px;
    background: $theme-color6;
    border: 1px solid $theme-color4;

    border-radius: 12px;
    .title-wrap {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid $theme-color2;
      .title {
        font-size: 16px;
        font-weight: bold;
      }
    }
    .content {
      padding: 0 20px;
    }
    .footer {
      padding: 20px;
      margin-top: 20px;
      text-align: right;
    }
  }
}
</style>
