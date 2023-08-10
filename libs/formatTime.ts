export const formatTime = (dateTimeStr: string | undefined) => {
  if (dateTimeStr !== undefined) {
    const dateObj = new Date(dateTimeStr);
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    const seconds = dateObj.getSeconds();
    const meridiem = hours >= 12 ? '오후' : '오전';
    const formattedTime = `${meridiem} ${hours % 12}:${minutes.toString().padStart(2, '0')}`;
    return formattedTime;
  }
  return '';
};
