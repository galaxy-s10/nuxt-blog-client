<template>
  <ul v-if="list.length" class="catalog-cpt-wrap">
    <li
      v-for="(item, index) in list"
      :key="index"
      :class="{ 'catalog-item': 1 }"
    >
      <a
        :href="'#' + item.id"
        :class="{
          'a-link': true,
          left1: formatLeft(item, 1),
          left2: formatLeft(item, 2),
          left3: formatLeft(item, 3),
          left4: formatLeft(item, 4),
          left5: formatLeft(item, 5),
          left6: formatLeft(item, 6),
        }"
        :style="{
          paddingLeft: (item.type.slice(1) * 1 - 1) * 15 + 18 + 'px',
        }"
        :title="item.text"
      >
        {{ item.text }}
      </a>
    </li>
  </ul>
  <div v-else>暂无目录~</div>
</template>

<script>
export default {
  components: {},
  props: {
    list: {
      type: Array,
      default() {
        return [];
      },
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
    formatLeft(v, num) {
      return v.type.slice(1) === num;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/css/constant.scss';

.catalog-cpt-wrap {
  position: relative;
  margin: 0;
  padding: 0;
  font-size: 16px;
  max-height: 80vh;
  overflow-y: scroll;
  @extend .hideScrollbar;
  &::before {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 7px;
    width: 2px;
    background-color: $theme-color10;
    content: '';
  }
  .catalog-item {
    position: relative;
    margin: 0;
    padding: 4px;
    list-style: none;
    font-size: 14px;
    &:hover {
      background: $theme-color10;
      color: $theme-color1;
    }

    .a-link {
      display: block;
      padding: 3px 0 3px 0px;
      width: 100%;
      width: inherit;
      color: $theme-color5;
      text-decoration: none;

      @extend .singleEllipsis;
      &:hover {
        color: $theme-color1;
      }
      &::before {
        position: absolute;
        top: 50%;
        left: 5px;
        margin-top: -4px;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: $theme-color5;
        content: '';
      }

      &.left2::before {
        left: 20px;
        margin-top: -2px;
        width: 4px;
        height: 4px;
      }
      &.left3::before {
        left: 36px;
        margin-top: -2px;
        width: 4px;
        height: 4px;
      }
      &.left4::before {
        left: 52px;
        margin-top: -2px;
        width: 4px;
        height: 4px;
      }
      &.left5::before {
        left: 68px;
        margin-top: -2px;
        width: 4px;
        height: 4px;
      }
      &.left6::before {
        left: 84px;
        margin-top: -2px;
        width: 4px;
        height: 4px;
      }
    }
  }
}
</style>
