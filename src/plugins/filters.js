import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import UAParser from 'ua-parser-js';
import Vue from 'vue';

import 'dayjs/locale/zh-cn';

dayjs.extend(relativeTime).locale('zh-cn');

/**
 * https://day.js.org/docs/zh-CN/display/format
 * dayjs('2019-01-25').format('DD/MM/YYYY') // '25/01/2019'
 * dayjs('2019-01-25').format('[YYYYescape] YYYY-MM-DDTHH:mm:ssZ[Z]') // 'YYYYescape 2019-01-25T00:00:00-02:00Z'
 * dayjs().format() // 默认返回的是 ISO8601 格式字符串 '2020-04-02T08:02:17-05:00'
 */
const formatDate = (date, str) => {
  return dayjs(date).format(str || 'YYYY-MM-DD HH:mm:ss');
};

/**
 * https://dayjs.gitee.io/docs/zh-CN/plugin/relative-time
 * dayjs().from(dayjs('1990-01-01')) // 31 年后
 * dayjs().from(dayjs('1990-01-01'), true) // 31 年
 */
const convertDate = (date) => {
  return dayjs(date).fromNow();
};

// 解析user-agent
const parseUa = (v) => {
  const parser = new UAParser();
  const uaParser = parser.setUA(v);
  const uaResult = uaParser.getResult();
  const osName = uaResult.os.name;
  const osVersion = uaResult.os.version;
  return `${osName} ${osVersion}`;
};

// 解析ipInfo
const parseIpInfo = (ipInfo) => {
  if (ipInfo.province.length <= 0) {
    return '';
  }
  const str = `${ipInfo.province} - ${ipInfo.city}`;
  return str;
};

Vue.filter('parseUa', parseUa);
Vue.filter('formatDate', formatDate);
Vue.filter('convertDate', convertDate);
Vue.filter('parseIpInfo', parseIpInfo);
