<template>
  <div>
    <ul v-if="list.length" class="format-ul">
      <li
        v-for="(item, index) in list"
        :key="index"
        :class="{ 'format-li': 1 }"
      >
        <a
          :href="'#' + item.id"
          :class="{
            slh: true,
            'format-a': true,
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
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    list: {
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      list1: [
        { id: '重写call_95', type: 'H1', text: '重写call' },
        { id: '原生call_61', type: 'H2', text: '原生call' },
        { id: 'aaa_86', type: 'H3', text: 'aaa' },
        { id: '重写call_50', type: 'H2', text: '重写call' },
        { id: '重写apply_81', type: 'H1', text: '重写apply' },
        { id: '重写bind_88', type: 'H1', text: '重写bind' },
        { id: '重写foreach_79', type: 'H1', text: '重写foreach' },
        { id: '重写map_34', type: 'H1', text: '重写map' },
        { id: '重写filter_49', type: 'H1', text: '重写filter' },
        { id: '重写reduce_87', type: 'H1', text: '重写reduce' },
        { id: '重写some_39', type: 'H1', text: '重写some' },
        { id: '重写every_78', type: 'H1', text: '重写every' },
      ],
    }
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    formatLeft(v, num) {
      return v.type.slice(1) === num
    },
  },
}
</script>

<style scoped>
.format-ul {
  position: relative;
  margin: 0;
  padding: 0;
  font-size: 16px;
}
.format-li {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
}
.format-li:hover {
  color: #007fff;
  background: rgba(236, 245, 255, 0.6);
}
.format-a::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 5px;
  margin-top: -4px;
  width: 6px;
  height: 6px;
  background-color: currentColor;
  border-radius: 50%;
}
.format-a.left2::before {
  width: 4px;
  height: 4px;
  left: 20px;
  margin-top: -2px;
}
.format-a.left3::before {
  width: 4px;
  height: 4px;
  left: 36px;
  margin-top: -2px;
}
.format-a.left4::before {
  width: 4px;
  height: 4px;
  left: 52px;
  margin-top: -2px;
}
.format-a.left5::before {
  width: 4px;
  height: 4px;
  left: 68px;
  margin-top: -2px;
}
.format-a.left6::before {
  width: 4px;
  height: 4px;
  left: 84px;
  margin-top: -2px;
}
.format-ul::before {
  content: '';
  position: absolute;
  top: 0;
  left: 7px;
  bottom: 0;
  width: 2px;
  background-color: #ebedef;
  opacity: 0.5;
}
.format-a {
  display: block;
  padding: 3px 0 3px 0px;
  width: 100%;
  box-sizing: border-box;
  color: inherit;
  text-decoration: none;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
}
.slh {
  box-sizing: border-box;
  width: 100%;
  display: inline-block;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-all;
}
</style>
