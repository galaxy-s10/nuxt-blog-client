import Vue from 'vue';
import VueLazyLoad from 'vue-lazyload';
Vue.use(VueLazyLoad, {
  preLoad: 1,
  error: require('@/assets/img/error_pic.webp'),
  loading: require('@/assets/img/lazy.webp'),
  attempt: 2,
});
