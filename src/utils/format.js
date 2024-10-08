/**
 * 获取日期当天的开始时间到结束时间
 */
export function dateStartAndEnd(date) {
  const addZero = (v) => (v < 10 ? `0${v}` : v);
  const y = date.getFullYear();
  const m = addZero(date.getMonth() + 1);
  const d = addZero(date.getDate());
  const startTime = `${y}/${m}/${d} 00:00:00`;
  const endTime = `${y}/${m}/${d} 23:59:59`;
  return {
    startTime: +new Date(startTime),
    endTime: +new Date(endTime),
  };
}
