// Public API calls go to the website's own server (same origin in browser = relative path)
// In SSR context we need an absolute URL, but from the client a relative path works fine.
const BASE = process.env.NEXT_PUBLIC_API_URL || '';

export const api = {
  get: (path: string) => fetch(`${BASE}${path}`).then(r => r.json()),
  post: (path: string, body: object) =>
    fetch(`${BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(r => r.json()),
};
