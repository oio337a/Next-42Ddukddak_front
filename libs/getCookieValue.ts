export default function getCookieValue(key: string) {
  if (typeof document === 'undefined') {
    return null;
  }
  const cookies = document.cookie.split(';');

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();

    if (cookie.startsWith(`${key}=`)) {
      return cookie.substring(key.length + 1);
    }
  }
  return null;
}
