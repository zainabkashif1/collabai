import axios from "axios";

// Relative baseURL — Vite's dev server proxy (see vite.config.ts) forwards
// /api/* to the Express backend, and in production this will be served
// from the same origin as the API, so no absolute URL is needed either way.
export const api = axios.create({
  baseURL: "/api",
  withCredentials: true, // send/receive the httpOnly refresh-token cookie
});

// Module-level holder for the current access token. AuthContext updates
// this via setAccessToken() whenever the session changes; the interceptor
// below reads it fresh on every request. A plain variable (not React
// state) because axios interceptors run outside React's render cycle.
let currentAccessToken: string | null = null;

export function setAccessToken(token: string | null) {
  currentAccessToken = token;
}

api.interceptors.request.use((config) => {
  if (currentAccessToken) {
    config.headers.Authorization = `Bearer ${currentAccessToken}`;
  }
  return config;
});
