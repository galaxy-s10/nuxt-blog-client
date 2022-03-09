import Vue from 'vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
import ua from 'ua-device'

dayjs.extend(relativeTime).locale('zh-cn')

/**
 * https://day.js.org/docs/zh-CN/display/format
 * dayjs('2019-01-25').format('DD/MM/YYYY') // '25/01/2019'
 * dayjs('2019-01-25').format('[YYYYescape] YYYY-MM-DDTHH:mm:ssZ[Z]') // 'YYYYescape 2019-01-25T00:00:00-02:00Z'
 * dayjs().format() // 默认返回的是 ISO8601 格式字符串 '2020-04-02T08:02:17-05:00'
 */
const formatDate = (date, str) => {
  return dayjs(date).format(str || 'YYYY-MM-DD HH:mm:ss')
}

/**
 * https://dayjs.gitee.io/docs/zh-CN/plugin/relative-time
 * dayjs().from(dayjs('1990-01-01')) // 31 年后
 * dayjs().from(dayjs('1990-01-01'), true) // 31 年
 */
const convertDate = (date) => {
  return dayjs(date).fromNow()
}

// 解析user-agent
const parseUa = (v) => {
  const osName = ua(v).os.name
  const osVersion = ua(v).os.version ? ua(v).os.version.original : ''
  return osName + ' ' + osVersion
}

Vue.filter('parseUa', parseUa)
Vue.filter('formatDate', formatDate)
Vue.filter('convertDate', convertDate)
