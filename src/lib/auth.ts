export type Role = "admin" | "gestor" | "avaliador" | "usuario";

export type User = {
  id?: number;
  nome?: string;
  email?: string;
  role: Role;
  companyId?: string | number;
};

function decodeJwtPayload<T = any>(token: string): T | null {
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

    return JSON.parse(json) as T;
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
    case "COMMON":
    default:
      return "usuario";
  }
}

export async function getAccessToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

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

export function redirectByRole(role?: Role, companyId?: string | number): string {
  switch (role) {
    case "admin":
      return "/admin/dashboard";
    case "gestor":
      return companyId ? `/company/${companyId}/dashboard` : "/company";
    case "avaliador":
      return companyId ? `/company/${companyId}/desafios` : "/desafios";
    default:
      return "/user/meus-desafios";
  }
}

export async function getUserCompanyId(): Promise<string | number | undefined> {
  const token = await getAccessToken();
  if (!token) return undefined;
  const payload = decodeJwtPayload<any>(token) ?? {};
  return payload.companyId ?? payload.enterpriseId ?? undefined;
}

export async function getUserId(): Promise<string | number | undefined> {
  const token = await getAccessToken();
  if (!token) return undefined;
  const payload = decodeJwtPayload<any>(token) ?? {};
  return payload.sub ?? undefined;
}