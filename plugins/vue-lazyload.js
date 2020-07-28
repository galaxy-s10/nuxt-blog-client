import Vue from 'vue'
import VueLazyLoad from 'vue-lazyload'
Vue.use(VueLazyLoad, {
  preLoad: 1,
  error: require('../assets/imgs/nopic.png'),
  loading: require('../assets/imgs/lazy.gif'),
  attempt: 2,
})
