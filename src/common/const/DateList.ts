const year = Array.from({ length: 26 }, (_, i) => String(2025 + i));

const month = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));

const day = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));

const hour = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));

const minute = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

export { year, month, day, hour, minute };

const judgeDate = (showTime: string, activeTime: { startTime: string; endTime: string }) => {
  const parseDate = (time: string) => {
    return new Date(time);
  };

  const now = new Date();

  // 计算本周的开始时间（周日）和结束时间（周六）
  const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
  const endOfWeek = new Date(startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000);

  const startTime = parseDate(activeTime.startTime);
  const endTime = parseDate(activeTime.endTime);

  // 根据 showTime 计算对应的日期范围
  const getDayRange = (day: string) => {
    const dayIndex = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'].indexOf(day);
    if (dayIndex === -1) return null;

    const startOfDay = new Date(startOfWeek.getTime() + dayIndex * 24 * 60 * 60 * 1000);
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

    return { startOfDay, endOfDay };
  };

  const { startOfDay, endOfDay } = getDayRange(showTime) || { startOfDay: null, endOfDay: null };

  if (!startOfDay || !endOfDay) return false;

  // 判断时间段是否包含本周的某一天
  return (
    (startTime <= startOfDay && endTime >= startOfDay) || // 包含开始时间
    (startTime <= endOfDay && endTime >= endOfDay) || // 包含结束时间
    (startTime >= startOfDay && endTime <= endOfDay) // 完全包含在当天内
  );
};

export { judgeDate };
