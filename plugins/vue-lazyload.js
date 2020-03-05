import Vue from 'vue'
import VueLazyLoad from 'vue-lazyload'
Vue.use(VueLazyLoad, {
  preLoad: 1,
  error: require('../assets/imgs/无图.png'),
  loading: require('../assets/imgs/dc18d4e.gif'),
  attempt: 2,
})
