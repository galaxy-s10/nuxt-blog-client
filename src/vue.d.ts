// https://v2.cn.vuejs.org/v2/guide/typescript.html

import { MessageType } from 'element-ui/types/message';

import Vue from 'vue';
import { Api } from './api';

declare module 'vue/types/vue' {
  interface Vue {
    $myaxios: Api;
    $newmessage: (message: string, type: MessageType) => void;
  }
}
