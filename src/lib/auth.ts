// src/lib/auth.ts
import api from "@/lib/axios";

// Mantém tuas roles do front
export type Role = "admin" | "gestor" | "avaliador" | "usuario";

export type User = {
  id?: number;
  nome?: string;
  email?: string;
  role: Role;
  companyId?: number;
};

// --- util: decode JWT no client ---
function decodeJwtPayload<T = any>(token: string): T | null {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const json = typeof window !== "undefined"
      ? decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        )
      : Buffer.from(base64, "base64").toString("utf-8");
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

function mapRoleFromToken(raw?: string): Role {
  // ajuste se o payload do teu back for outro (ex.: type_user, role, perfil)
  switch (raw) {
    case "ADMINISTRATOR":
    case "ADMIN":
      return "admin";
    case "MANAGER":
      return "gestor";
    case "EVALUATOR":
      return "avaliador";
    default:
      return "usuario";
  }
}

export async function getAccessToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

// (A) Caminho 100% client: decodifica do token
export async function getCurrentUser(): Promise<User | null> {
  const token = await getAccessToken();
  if (!token) return null;
  const payload = decodeJwtPayload<any>(token) ?? {};
  return {
    id: payload.sub ? Number(payload.sub) : undefined,
    nome: payload.name ?? payload.nome ?? undefined,
    email: payload.email ?? undefined,
    role: mapRoleFromToken(payload.type_user ?? payload.role),
    companyId: payload.companyId ?? payload.enterpriseId ?? undefined,
  };
}

export async function getUserRole(): Promise<Role> {
  const u = await getCurrentUser();
  return u?.role ?? "usuario";
}

/* (B) Opcional — se teu back tiver /auth/me:
export async function fetchMe(): Promise<User | null> {
  try {
    const { data } = await api.get("/auth/me"); // precisa existir no back
    return {
      id: data.id,
      nome: data.name ?? data.nome,
      email: data.email,
      role: mapRoleFromToken(data.type_user ?? data.role),
      companyId: data.companyId ?? data.enterpriseId,
    };
  } catch {
    return null;
  }
}
*/
