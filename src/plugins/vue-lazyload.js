import Vue from 'vue';
import VueLazyLoad from 'vue-lazyload';

export default () => {
  if (Vue._is_use_vue_lazyload) {
    return;
  }

  Vue.use(VueLazyLoad, {
    preLoad: 1,
    error: require('@/assets/img/error_pic.webp'),
    loading: require('@/assets/img/lazy.webp'),
    attempt: 2,
  });

  Vue._is_use_vue_lazyload = true;
};
