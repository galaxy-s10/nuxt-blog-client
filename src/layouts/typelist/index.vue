<template>
  <nav
    class="fix-type-wrap"
    :class="{ show: hiddenHeader }"
  >
    <ul class="type-wrap">
      <li
        :class="{ active: typeId === '' ? true : false }"
        @click="all()"
      >
        全部
      </li>
      <li
        v-for="(item, index) in typeList"
        :key="index"
        :class="{ active: item.id === typeId ? true : false }"
        @click="changeType(item.id)"
      >
        {{ item.name }}
      </li>
    </ul>
    <div
      v-if="isMobileEnv"
      class="switch"
    >
      <span class="txt">樱花:</span>
      <el-switch
        :value="showPlum"
        :width="35"
        @change="setShowPlum(!showPlum)"
      ></el-switch>
    </div>
  </nav>
</template>

<script>
import { isMobile, throttle } from 'billd-utils';
import { mapActions, mapMutations, mapState } from 'vuex';

// eslint-disable-next-line

export default {
  data() {
    return {
      visible: false,
      isMobileEnv: false,
      handleResize: throttle(this.resizeFn, 50, true),
    };
  },
  computed: {
    ...mapState({
      showPlum(state) {
        return state.app.showPlum;
      },
    }),
    typeList() {
      return this.$store.state.type.typeList;
    },
    typeId() {
      return this.$store.state.type.typeId;
    },
    hiddenHeader() {
      return this.$store.state.app.hiddenHeader;
    },
  },
  mounted() {
    this.getTypeList();
    this.resizeFn();
    window.addEventListener('resize', this.handleResize);
  },
  destroyed() {},
  methods: {
    ...mapMutations({
      setShowPlum: 'app/setShowPlum',
    }),
    ...mapActions('type', ['getTypeList']),
    resizeFn() {
      this.isMobileEnv = isMobile();
    },
    changeType(typeId) {
      this.$store.commit('type/changeTypeId', typeId);
      if (this.$route.path !== '/') {
        this.$router.push('/');
      }
    },
    all() {
      if (this.$store.state.type.typeId) {
        this.$store.commit('type/changeTypeId', '');
      }
      if (this.$route.path !== '/') {
        this.$router.push('/');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
/* 响应式布局,大于540px */
@media screen and (min-width: 540px) {
  .show {
    transform: translateY(-60px);
  }
}

.dark {
  .fix-type-wrap {
    background: $theme-color3;
  }
}
.active {
  position: relative;
  &::after {
    position: absolute;
    top: 0;
    right: 0;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: rgba($color: #604bc3, $alpha: 0.6);
    content: '';
    transform: translate(90%, -50%);
  }
}
.fix-type-wrap {
  position: fixed;
  top: 60px;
  left: 0;
  z-index: 99;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  border-bottom: 1px solid $theme-color4;
  background-color: $theme-color6;
  transition: all 0.3s;
  transform: translateZ(0);

  &.show {
    transform: translate3d(0, -60px, 0);
  }
  .type-wrap {
    display: flex;
    align-items: center;
    margin: 0 auto;
    padding: 0;
    height: 40px;
    color: $theme-color1;
    li {
      display: block;
      margin-right: 10px;
      cursor: pointer;

      user-select: none;
    }
  }
}
/* 响应式布局,小于540px */
@media screen and (max-width: 540px) {
  .fix-type-wrap {
    .type-wrap {
      margin: 0;
    }
  }
}
</style>
