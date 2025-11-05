const TimeTranslation = (time: string) => {
  if (!time) return '未知时间';

  const timeWithoutZone = time.replace(/ [A-Z]{3,5}$/, '').replace(/ [+-]\d{4}$/, '');

  const date = new Date(timeWithoutZone);
  if (isNaN(date.getTime())) return '未知时间';
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  return `${month}月${day}日 ${hour}:${minute}`;
};

export default TimeTranslation;
