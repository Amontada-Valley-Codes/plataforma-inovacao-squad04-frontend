/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const baseURL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

function getCookieToken(name = "access_token"): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function getAccessTokenClient(): string | null {
  if (typeof window === "undefined") return null;

  // 1) prioridade: cookie (alinha com middleware)
  const cookieToken = getCookieToken("access_token");
  if (cookieToken) return cookieToken;

  // 2) fallback: localStorage
  return localStorage.getItem("access_token");
}

api.interceptors.request.use(
  (config) => {
    const token = getAccessTokenClient();
    if (token) {
      config.headers = config.headers ?? {};
      (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined") {
      const status = error?.response?.status;

      if (status === 401) {
        try {
          localStorage.removeItem("access_token");
          document.cookie = "access_token=; Path=/; Max-Age=0; SameSite=Lax";
        } catch {
          // noop
        }

        const path = window.location.pathname;
        if (!path.startsWith("/auth/login")) {
          const next = encodeURIComponent(path + window.location.search);
          window.location.href = `/login?next=${next}`;
        }
      }

      if (status === 403) {
        const path = window.location.pathname;
        if (!path.startsWith("/sem-permissao")) {
          window.location.href = "/sem-permissao";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
