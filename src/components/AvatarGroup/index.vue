<template>
  <div class="avatar-group-wrap">
    <ul v-if="list" class="list">
      <li
        v-for="item in list"
        :key="item.id"
        class="item"
        :style="{ width: size - 4 + 'px' }"
      >
        <img :width="size" :src="item.avatar" alt="" />
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  components: {},
  list: {
    title: {
      type: Array,
      require: true,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      size: 30,
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.avatar-group-wrap {
  display: inline-block;
  .list {
    display: flex;
    margin: 0;
    padding: 0;
    .item {
      list-style: none;
      img {
        border-radius: 50%;
        border: 2px solid #fff;
      }
    }
  }
}
</style>
