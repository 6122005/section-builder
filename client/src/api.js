// In dev: BASE_URL is empty string → Vite proxy handles /api → localhost:4000
// In production (Vercel): VITE_API_URL is set to the Render backend URL
const BASE_URL = import.meta.env.VITE_API_URL || '';

async function request(path, options) {
  const response = await fetch(`${BASE_URL}/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.error?.message || `Request failed (${response.status})`);

  return data;
}

export const api = {
  generate: (prompt) => request('/sections/generate', { method: 'POST', body: JSON.stringify({ prompt }) }),
  save: (id, tree) => request(`/sections/${id}`, { method: 'PUT', body: JSON.stringify({ tree }) }),
};
