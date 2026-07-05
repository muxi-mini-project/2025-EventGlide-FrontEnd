const formatTime = (timeStr: string) => {
  const time = new Date(timeStr);
  const now = new Date();

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const timeHM = `${hours}:${minutes}`;

  const timeDate = time.getDate();
  const timeMonth = time.getMonth() + 1;
  const timeYear = time.getFullYear();

  const nowDate = now.getDate();
  const nowMonth = now.getMonth() + 1;
  const nowYear = now.getFullYear();

  if (timeYear === nowYear && timeMonth === nowMonth && timeDate === nowDate) {
    return timeHM;
  }

  const yesterday = new Date(now);
  yesterday.setDate(nowDate - 1);
  const yesterdayDate = yesterday.getDate();
  const yesterdayMonth = yesterday.getMonth() + 1;

  if (timeYear === nowYear && timeMonth === yesterdayMonth && timeDate === yesterdayDate) {
    return `昨天 ${timeHM}`;
  }

  if (timeYear === nowYear) {
    return `${timeMonth.toString().padStart(2, '0')}-${timeDate.toString().padStart(2, '0')}`;
  }

  return `${timeYear}-${timeMonth.toString().padStart(2, '0')}-${timeDate.toString().padStart(2, '0')}`;
};
export default formatTime;
