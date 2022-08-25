<template>
  <div class="sort-wrap">
    <div
      class="date"
      :class="{ curr: sort === 'date' }"
      @click="sortChange('date')"
    >
      按时间
    </div>
    <div
      class="hot"
      :class="{ curr: sort === 'hot' }"
      @click="sortChange('hot')"
    >
      按热度
    </div>
    <div class="hr"></div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    sort: {
      type: String,
      require: true,
      default: 'date',
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
    sortChange(val) {
      this.$emit('sortChange', val);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/css/constant.scss';

.sort-wrap {
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 40px;
  .hot,
  .date {
    margin: 12px 10px;
    cursor: pointer;
    &.curr {
      color: $theme-color1;
    }
  }
  .hr {
    flex: 1;
    height: 2px;
    background-color: $theme-color2;
  }
}
</style>
