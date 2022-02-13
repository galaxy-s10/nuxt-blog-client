export function format(time) {
  const date = new Date(time)
  const year = date.getFullYear()
  /* 在日期格式中，月份是从0开始的，因此要加0
   * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
   * */
  const month =
    date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  const hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
  const minutes =
    date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  const seconds =
    date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  // 拼接
  return (
    year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
  )
}
export function format1(time) {
  const nowdate = new Date()
  const date = new Date(time)
  // 将返回的毫秒数转化为秒
  const res = (nowdate - date) / 1000
  const days = res / (24 * 60 * 60)
  if (days > 365) {
    return '1年前'
  } else if (days > 180) {
    return '半年前'
  } else if (days > 90) {
    return '3个月前'
  } else if (days > 60) {
    return '2个月前'
  } else if (days > 30) {
    return '1个月前'
  } else if (days > 21) {
    return '3周前'
  } else if (days > 14) {
    return '2周前'
  } else if (days > 7) {
    return '1周前'
  } else if (days > 3) {
    return '3天前'
  } else if (days > 1) {
    return '1天前'
  } else {
    return '今天'
  }
}
