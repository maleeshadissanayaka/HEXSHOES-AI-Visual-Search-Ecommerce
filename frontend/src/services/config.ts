const localPreview = import.meta.env.DEV || ["localhost", "127.0.0.1", "::1", "[::1]"].includes(window.location.hostname);
export const API_URL = (import.meta.env.VITE_API_URL || (localPreview ? "http://localhost:4000" : "")).replace(/\/$/, "");
export const AI_API_URL = (import.meta.env.VITE_AI_API_URL || (localPreview ? "http://127.0.0.1:8000" : "")).replace(/\/$/, "");
