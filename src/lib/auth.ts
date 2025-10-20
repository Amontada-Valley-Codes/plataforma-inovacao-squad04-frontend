// // src/lib/auth.ts
// import { usersData, type Role, type User } from "@/mocks/UserData";

// // Simulação de usuário logado (troque o índice para testar)
// const currentUser: User = usersData[2];

// export async function getUserRole(): Promise<Role> {
//     return currentUser.role;
// }

// export async function getCurrentUser(): Promise<User> {
//     return currentUser;
// }

// // (Opcional) helper se quiser usar em outros lugares
// export async function getUserCompanyId(): Promise<number> {
//     return currentUser.companyId;
// }
// src/lib/auth.ts
import { decodeJwt, type DecodedToken } from "./jwt";

// Tipagem interna de roles (frontend)
export type AppRole = "usuario" | "admin" | "avaliador" | "gestor" | "startup";

/**
 * Mapeia as roles do backend (COMMON, ADMINISTRATOR, EVALUATOR, MANAGER)
 * para os nomes usados no frontend.
 */
export function mapBackendToAppRole(
    type_user?: "COMMON" | "ADMINISTRATOR" | "EVALUATOR" | "MANAGER",
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
    return mapBackendToAppRole(decoded?.type_user);
}

/**
 * Retorna as informações básicas do usuário.
 */
export async function getCurrentUser(): Promise<{ id: string | null; email: string | null }> {
    const token = getAccessToken();
    if (!token) return { id: null, email: null };

    const decoded = decodeJwt<DecodedToken>(token);
    return {
        id: decoded?.sub ?? null,
        email: decoded?.email ?? null,
    };
}

/**
 * Retorna o ID da empresa associada ao usuário (se houver).
 */
export async function getUserCompanyId(): Promise<number | null> {
    const token = getAccessToken();
    if (!token) return null;

    const decoded = decodeJwt<DecodedToken>(token);
    return decoded?.enterpriseId ? Number(decoded.enterpriseId) : null;
}

/**
 * Verifica se o usuário está autenticado (token presente).
 */
export function isAuthenticated(): boolean {
    return !!getAccessToken();
}
