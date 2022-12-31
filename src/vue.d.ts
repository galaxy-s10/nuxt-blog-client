// https://v2.cn.vuejs.org/v2/guide/typescript.html

import Vue from 'vue';
import { Api } from './api/index';

declare module 'vue/types/vue' {
  interface Vue {
    $myaxios: Api;
  }
}
