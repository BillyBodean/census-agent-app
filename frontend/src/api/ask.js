const BASE_URL = import.meta.env.VITE_API_URL;

export async function askQuestion(question) {
  if (!BASE_URL?.trim()) {
    throw new Error('API URL is not configured. Set VITE_API_URL in your environment.');
  }
  const res = await fetch(`${BASE_URL.replace(/\/$/, '')}/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  });

  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(
      res.ok
        ? 'Server returned invalid response.'
        : `Request failed (${res.status}). The server may be down, or CORS/API URL may be misconfigured. Check the browser Network tab for the actual response.`
    );
  }

  if (!res.ok) throw new Error(data.error || `Request failed (${res.status}).`);
  return data.answer;
}
