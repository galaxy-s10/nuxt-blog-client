import Vue from 'vue'
import VueLazyLoad from 'vue-lazyload'
Vue.use(VueLazyLoad, {
  preLoad: 1,
  error: require('@/assets/img/errorpic.png'),
  loading: require('@/assets/img/lazy.gif'),
  attempt: 2,
})
