import { Message } from 'element-ui';
import Vue from 'vue';

function newmessage(message, type) {
  Message({
    message,
    type,
    duration: 1000,
  });
}
Vue.prototype.$newmessage = newmessage;
