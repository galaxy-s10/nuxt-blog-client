/**
 * 获取日期当天的开始时间到结束时间
 */
export function dateStartAndEnd(date) {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const startTime = `${y}-${m}-${d} 00:00:00`;
  const endTime = `${y}-${m}-${d} 23:59:59`;
  return {
    startTime,
    endTime,
  };
}
