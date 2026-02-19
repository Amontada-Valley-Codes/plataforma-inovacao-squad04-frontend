/* eslint-disable @typescript-eslint/no-explicit-any */

export type Role =
  | "admin"
  | "gestor"
  | "avaliador"
  | "usuario"
  | "startup"
  | "collaborator"
  | "observer"
  | "organizer"
  | "innovation_team"
  | "steering_committee";

export type User = {
  id?: number;
  nome?: string;
  email?: string;
  role: Role;
  companyId?: string | number;
  startupId?: string | number;
  type_user?: string;
};

export function setFrontendCookie(
  name: string,
  value: string,
  maxAgeSeconds: number
) {
  if (typeof document === "undefined") return;

  const secure = location.protocol === "https:" ? "; Secure" : "";

  document.cookie =
    `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax${secure}`;
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;

  // 2) fallback: cookie (como você está setando via JS, ele é legível)
  const match = document.cookie.match(/(?:^|;\s*)access_token=([^;]+)/);
  if (match) return decodeURIComponent(match[1]);

  // 2) fallback: localStorage
  return localStorage.getItem("access_token");
}

type JwtPayload = {
  sub?: string | number;
  name?: string;
  nome?: string;
  email?: string;
  role?: string;
  type_user?: string;
  companyId?: string | number;
  enterpriseId?: string | number;
  startupId?: string | number;
};

function decodeJwtPayload<T = any>(token: string): JwtPayload | null {
  try {
    const part = token.split(".")[1];
    if (!part) return null;

    // Base64URL -> Base64 + padding
    const b64 = part.replace(/-/g, "+").replace(/_/g, "/")
      .padEnd(Math.ceil(part.length / 4) * 4, "=");

    // Usa atob quando houver (browser e Edge Runtime têm), senão usa Buffer (Node)
    const hasAtob = typeof atob === "function";
    const json = hasAtob
      ? atob(b64)
      : (typeof Buffer !== "undefined"
        ? Buffer.from(b64, "base64").toString("utf-8")
        : (() => { throw new Error("No atob/Buffer available"); })());

    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

function mapRoleFromToken(raw?: string): Role {
  const v = (raw ?? "").toString().trim().toUpperCase();

  switch (v) {
    case "ADMINISTRATOR":
    case "ADMIN":
      return "admin";

    case "MANAGER":
    case "GESTOR":
      return "gestor";

    case "EVALUATOR":
    case "AVALIADOR":
      return "avaliador";

    case "STARTUP":
      return "startup";

    case "ORGANIZER":
      return "organizer";

    case "INNOVATION_TEAM":
      return "innovation_team";

    case "STEERING_COMMITTEE":
      return "steering_committee";

    case "OBSERVER":
      return "observer";

    case "COLLABORATOR":
      return "collaborator";

    case "COMMON":
    default:
      return "usuario";
  }
}


export async function getCurrentUser(): Promise<User | null> {
  const token = getAccessToken();
  if (!token) return null;

  const payload = decodeJwtPayload<any>(token);
  if (!payload) return null;

  return {
    id: payload.sub ? Number(payload.sub) : undefined,
    nome: payload.name ?? payload.nome ?? undefined,
    email: payload.email ?? undefined,
    role: mapRoleFromToken(payload.type_user ?? payload.role),
    companyId: payload.companyId ?? payload.enterpriseId ?? undefined,
    startupId: payload.startupId ?? undefined,
  };
}

export async function getUserRole(): Promise<Role> {
  const u = await getCurrentUser();
  return u?.role ?? "usuario";
}


export async function getUserCompanyId(): Promise<string | number | undefined> {
  const token = getAccessToken();
  if (!token) return undefined;
  const payload = decodeJwtPayload<any>(token);
  return payload?.companyId ?? payload?.enterpriseId ?? undefined;
}


export async function getUserStartupId(): Promise<string | number | undefined> {
  const token = getAccessToken();
  if (!token) return undefined;
  const payload = decodeJwtPayload<any>(token);
  return payload?.startupId ?? undefined;
}


export async function getUserId(): Promise<string | number | undefined> {
  const token = getAccessToken();
  if (!token) return undefined;
  const payload = decodeJwtPayload<any>(token);
  return payload?.sub ?? undefined;
}
export function redirectByRole(role?: Role, companyId?: string | number): string {
  switch (role) {
    case "admin":
      return "/admin/dashboard";

    case "gestor":
      return companyId ? `/company/${companyId}/dashboard` : "/company";

    case "startup":
      return "/startup/desafios";

    case "avaliador":
    case "organizer":
    case "innovation_team":
    case "steering_committee":
    case "observer":
      return companyId ? `/company/${companyId}/desafios` : "/company";

    case "collaborator":
    case "usuario":
    default:
      return "/user/meus-desafios";
  }
}
