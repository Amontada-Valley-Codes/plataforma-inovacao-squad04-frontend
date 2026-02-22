
import type { Role } from "./roles";


export type DecodedToken = {
  sub: string;               
  type_user: Role;           
  email: string;
  enterpriseId: string | null;
  startupId: string | null;    
  iat: number;
  exp: number;
};



function b64urlToJson<T = unknown>(b64url: string): T | null {
  try {
    const b64 = b64url
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(b64url.length / 4) * 4, "=");

    const bin = globalThis.atob(b64);
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    const jsonStr = new TextDecoder().decode(bytes);
    return JSON.parse(jsonStr) as T;
  } catch {
    return null;
  }
}

export function decodeJwtEdge(token: string): DecodedToken | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const payload = b64urlToJson<DecodedToken>(parts[1]);
  if (!payload) return null;


  if (!payload.sub || !payload.type_user) return null;

  return payload;
}