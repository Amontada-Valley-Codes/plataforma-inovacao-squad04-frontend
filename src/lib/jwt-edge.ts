export type DecodedToken = {
  sub?: string;
  email?: string;
  type_user?: "COMMON" | "ADMINISTRATOR" | "EVALUATOR" | "MANAGER";
  companyId?: number | string | null;
  iat?: number;
  exp?: number;
  [k: string]: unknown;
};

function b64urlToJson<T = unknown>(b64url: string): T | null {
  try {
    const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
    const bin = globalThis.atob(b64);
    const bytes = Uint8Array.from(bin, c => c.charCodeAt(0));
    const jsonStr = new TextDecoder().decode(bytes);
    return JSON.parse(jsonStr) as T;
  } catch {
    return null;
  }
}

export function decodeJwtEdge<T = DecodedToken>(token: string): T | null {
  const [, payload] = token.split(".");
  return payload ? b64urlToJson<T>(payload) : null;
}
