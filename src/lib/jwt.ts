// src/lib/jwt.ts

/**
 * Estrutura base do payload do token JWT.
 * Esses campos vêm direto do backend (JwtStrategy).
 */
export type DecodedToken = {
    sub: string; // ID do usuário
    email: string;
    type_user: "COMMON" | "ADMINISTRATOR" | "EVALUATOR" | "MANAGER";
    enterpriseId?: string | null;
    iat?: number;
    exp?: number;
    [key: string]: unknown;
};

/**
 * Função para decodificar o token JWT no front (client-side).
 */
export function decodeJwt<T = DecodedToken>(token: string): T | null {
    try {
        const [, payload] = token.split(".");
        if (!payload) return null;

        const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
        return JSON.parse(decodeURIComponent(escape(json)));
    } catch (err) {
        console.error("Erro ao decodificar token JWT:", err);
        return null;
    }
}
