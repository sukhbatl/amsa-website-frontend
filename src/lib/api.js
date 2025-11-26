// src/lib/api.js
// Remove trailing slash from base URL to prevent double slashes
const BASE = (import.meta.env.VITE_API_URL ?? "http://localhost:4000").replace(/\/$/, '');

export const api = (path, opts = {}) => {
  // Merge default headers with any provided headers without losing Content-Type
  const headers = {
    "Content-Type": "application/json",
    ...(opts.headers || {}),
  };

  return fetch(`${BASE}${path}`, {
    ...opts,
    headers,
  }).then(async (r) => {
    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      return Promise.reject(data);
    }
    return data;
  });
};
