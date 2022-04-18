/**
 * 使用json进行深克隆
 */
export const deepCloneByJson = (obj) => JSON.parse(JSON.stringify(obj))

/**
 * 随机获取[n-m]之间的随机整数
 */
export const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
export const randomString = (length) => {
  const str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let res = ''
  for (let i = 0; i < length; i += 1) {
    res += str.charAt(getRandomInt(0, str.length - 1))
  }
  return res
}
