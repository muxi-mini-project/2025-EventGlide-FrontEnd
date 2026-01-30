const year = Array.from({ length: 26 }, (_, i) => String(2025 + i));

const month = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));

const day = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));

const hour = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));

const minute = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

export { year, month, day, hour, minute };

const judgeDate = (showTime: string, activeTime: { startTime: string; endTime: string }) => {
  // 将字符串时间转换为Date对象
  const parseDate = (time: string) => {
    return new Date(time);
  };

  const startTime = parseDate(activeTime.startTime);
  const endTime = parseDate(activeTime.endTime);

  // 获取目标星期几的索引（周日为0，周一为1，...，周六为6）
  const targetDayIndex = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'].indexOf(showTime);
  if (targetDayIndex === -1) return false;

  // 创建一个当前检查的日期，从活动开始时间的00:00:00开始
  const currentDate = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate());

  // 遍历活动时间段内的每一天
  while (currentDate <= endTime) {
    // 检查当前日期是否是目标星期几
    if (currentDate.getDay() === targetDayIndex) {
      // 检查当前日期是否在活动时间段内
      // 考虑两种情况：
      // 1. 活动开始和结束在同一天
      // 2. 活动跨越多天，当前日期是其中一天

      // 如果当前日期是活动开始的那一天
      if (currentDate.toDateString() === startTime.toDateString()) {
        // 只要活动在这一天有任何时间，就返回true
        return true;
      }
      // 如果当前日期是活动结束的那一天
      else if (currentDate.toDateString() === endTime.toDateString()) {
        // 只要活动在这一天有任何时间，就返回true
        return true;
      }
      // 如果当前日期是活动中间的某一天
      else {
        // 完整的一天都在活动时间段内，返回true
        return true;
      }
    }

    // 移动到下一天
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // 遍历完所有日期都没有找到目标星期几
  return false;
};
export { judgeDate };
