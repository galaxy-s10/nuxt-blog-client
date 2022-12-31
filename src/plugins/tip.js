import { Message } from 'element-ui';
import Vue from 'vue';

/**
 * @param {string} message
 * @param {import('element-ui/types/message').MessageType} type
 */
export function newmessage(message, type) {
  Message({
    message,
    type,
    duration: 1000,
  });
}

Vue.prototype.$newmessage = newmessage;
