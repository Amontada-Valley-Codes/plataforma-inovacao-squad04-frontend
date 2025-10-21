import { decodeJwt, type DecodedToken } from "./jwt";

// Tipagem interna de roles usadas no frontend
export type AppRole = "usuario" | "admin" | "avaliador" | "gestor" | "startup";

// Tipos possíveis vindos do backend
export type BackendRole = "COMMON" | "ADMINISTRATOR" | "EVALUATOR" | "MANAGER";

/**
 * Mapeia as roles do backend (COMMON, ADMINISTRATOR, EVALUATOR, MANAGER)
 * para os nomes usados no frontend.
 */
export function mapBackendToAppRole(
  type_user?: BackendRole,
  isStartup?: boolean
): AppRole {
  if (isStartup) return "startup";
  switch (type_user) {
    case "ADMINISTRATOR":
      return "admin";
    case "EVALUATOR":
      return "avaliador";
    case "MANAGER":
      return "gestor";
    case "COMMON":
    default:
      return "usuario";
  }
}

/**
 * Obtém o token salvo no localStorage.
 */
export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

/**
 * Retorna a role do usuário logado (decodificada do token).
 */
export async function getUserRole(): Promise<AppRole | null> {
  const token = getAccessToken();
  if (!token) return null;

  const decoded = decodeJwt<DecodedToken>(token);
  return mapBackendToAppRole(decoded?.type_user as BackendRole);
}

/**
 * Retorna as informações básicas do usuário logado.
 */
export async function getCurrentUser(): Promise<{
  id: string | null;
  email: string | null;
  name: string | null;
  companyId: number | null;
}> {
  const token = getAccessToken();
  if (!token) return { id: null, email: null, name: null, companyId: null };

  const decoded = decodeJwt<DecodedToken>(token);

  return {
    id: typeof decoded?.sub === "string" ? decoded.sub : null,
    email: typeof decoded?.email === "string" ? decoded.email : null,
    name: typeof decoded?.name === "string" ? decoded.name : null,
    companyId:
      typeof decoded?.enterpriseId === "number"
        ? decoded.enterpriseId
        : decoded?.enterpriseId
        ? Number(decoded.enterpriseId)
        : null,
  };
}

/**
 * Retorna o ID da empresa associada ao usuário (se houver).
 */
export async function getUserCompanyId(): Promise<number | null> {
  const token = getAccessToken();
  if (!token) return null;

  const decoded = decodeJwt<DecodedToken>(token);
  if (!decoded?.enterpriseId) return null;

  return typeof decoded.enterpriseId === "number"
    ? decoded.enterpriseId
    : Number(decoded.enterpriseId);
}

/**
 * Verifica se o usuário está autenticado (token presente).
 */
export function isAuthenticated(): boolean {
  return !!getAccessToken();
}
