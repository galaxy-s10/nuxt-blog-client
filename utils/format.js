export function format(time) {
    var date = new Date(time);
    var year = date.getFullYear();
    /* 在日期格式中，月份是从0开始的，因此要加0
     * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
     * */
    var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    // 拼接
    return (year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds);
}
export function format1(time) {
    var nowdate = new Date()
    var date = new Date(time);
    // 将返回的毫秒数转化为秒
    var res = (nowdate - date) / 1000
    var days = res / (24 * 60 * 60)
    if (days > 365) {
        return '一年前'
    } else if (days > 180) {
        return '半年前'
    } else if (days > 90) {
        return '三个月前'
    } else if (days > 60) {
        return '两个月前'
    } else if (days > 30) {
        return '一个月前'
    } else if (days > 21) {
        return '三周前'
    } else if (days > 14) {
        return '两周前'
    } else if (days > 7) {
        return '一周前'
    } else {
        return '一周内'
    }
}