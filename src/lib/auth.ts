

import { type Role, normalizeRole, getDefaultRoute } from "./roles";
import { type DecodedToken, decodeJwtEdge } from "./jwt-edge";


export type AuthUser = {
  id: string;
  email: string;
  role: Role;
  enterpriseId: string | null;
  startupId: string | null;
};


export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;

  
  const match = document.cookie.match(/(?:^|;\s*)access_token=([^;]+)/);
  if (match) return decodeURIComponent(match[1]);

 
  return localStorage.getItem("access_token");
}


export function getCurrentUser(): AuthUser | null {
  const token = getAccessToken();
  if (!token) return null;

  const payload: DecodedToken | null = decodeJwtEdge(token);
  if (!payload) return null;

  const role = normalizeRole(payload.type_user);
  if (!role) return null; 

  return {
    id: payload.sub,
    email: payload.email,
    role,
    enterpriseId: payload.enterpriseId ?? null,
    startupId: payload.startupId ?? null,
  };
}


export function getUserRole(): Role | null {
  return getCurrentUser()?.role ?? null;
}



export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}



export function setAccessTokenCookie(token: string, maxAgeSeconds = 86400): void {
  if (typeof document === "undefined") return;
  const secure = location.protocol === "https:" ? "; Secure" : "";
  const sameSite = location.protocol === "https:" ? "None" : "Lax";
  document.cookie = `access_token=${encodeURIComponent(token)}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=${sameSite}${secure}`;
}

export function clearAccessTokenCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = "access_token=; Path=/; Max-Age=0; SameSite=Lax";
  localStorage.removeItem("access_token");
}


export function getRedirectRoute(user: AuthUser): string {
  return getDefaultRoute(user.role, {
    enterpriseId: user.enterpriseId,
    startupId: user.startupId,
  });
}