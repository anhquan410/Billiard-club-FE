export function getWebSocketUrl() {
  const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3001/api";
  return apiUrl.replace(/\/api\/?$/, "");
}
