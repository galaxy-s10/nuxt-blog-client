<template>
  <div
    v-if="visiable"
    class="mask-cpt-wrap"
    @click.self="closeModal($event)"
  >
    <div
      class="modal-wrap"
      :style="{ top: top }"
    >
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
    visiable: {
      type: Boolean,
      require: true,
      default: false,
    },
    title: {
      type: String,
      require: true,
      default: '',
    },
    top: {
      type: String,
      require: true,
      default: '20%',
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
      // this.loading = false;
      // this.$emit('closeModal');
      this.$emit('update:visiable', !this.visiable);
    },
  },
};
</script>

<style lang="scss" scoped>
.mask-cpt-wrap {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 102;
  background-color: $theme-color8;
  .modal-wrap {
    position: absolute;
    top: 30%;
    left: 50%;
    width: 600px;
    border: 1px solid $theme-color4;
    border-radius: 12px;
    background: $theme-color6;
    transform: translateX(-50%);
    .title-wrap {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px;
      border-bottom: 1px solid $theme-color2;
      .title {
        font-weight: bold;
        font-size: 16px;
      }
    }
    .content {
      padding: 0 20px;
    }
    .footer {
      margin-top: 20px;
      padding: 20px;
      text-align: right;
    }
  }
}
</style>
