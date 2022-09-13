<template>
  <div class="collapse-wrap">
    <div class="header">
      <div class="title">
        <slot name="ico"></slot>
        <b>{{ title }}</b>
      </div>
      <div class="ico-wrap" @click="isOpen = isOpen ? false : true">
        <i
          :class="{
            ico: true,
            'el-icon-arrow-up': true,
            down: !isOpen ? true : false,
          }"
        ></i>
      </div>
    </div>
    <div class="content">
      <div v-show="isOpen">
        <slot></slot>
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
    open: {
      type: Boolean,
      require: true,
    },
  },
  data() {
    return {
      isOpen: false,
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.isOpen = Boolean(this.open);
  },
  methods: {
    handleClick() {},
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/css/constant.scss';
@import '@/assets/css/mixin.scss';

.collapse-wrap {
  // overflow: hidden;
  margin-top: 20px;
  padding: 10px;
  border: 1px solid $theme-color4;
  border-radius: 5px;
  background: $theme-color6;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .title {
      margin: 8px 0;
    }
    .ico-wrap {
      width: 20px;
      height: 20px;
      transform: translateY(2px);
      cursor: pointer;
      .ico {
        transition: all 0.3s ease;
        transform: rotate(0deg);
        &.down {
          transform: rotate(180deg);
        }
      }
    }
  }
  .content {
    transition: height 0.5s ease;
    height: 100%;
    .item {
      margin-bottom: 4px;
    }
  }
}
</style>
