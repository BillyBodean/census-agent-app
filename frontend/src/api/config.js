const BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export async function getConfig() {
  if (!BASE_URL) throw new Error('API URL is not configured.');
  const res = await fetch(`${BASE_URL}/config`);
  if (!res.ok) throw new Error('Failed to load config.');
  return res.json();
}

export function getSessionUrl() {
  return `${BASE_URL}/chatkit/session`;
}

export function getChatKitApiUrl() {
  return `${BASE_URL}/chatkit`;
}
