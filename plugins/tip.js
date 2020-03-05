import Vue from 'vue'
import { MessageBox, Message } from 'element-ui'

function newmessage(message, type) {
  Message({
    message,
    type,
    duration: 1000
  });
}
Vue.prototype.$newmessage = newmessage;


