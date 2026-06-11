export function getProductImageUrl(imageUrl?: string | null): string | null {
  if (!imageUrl) return null;
  if (imageUrl.startsWith("http")) return imageUrl;
  const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3001/api";
  const base = apiUrl.replace(/\/api\/?$/, "");
  return `${base}${imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`}`;
}
