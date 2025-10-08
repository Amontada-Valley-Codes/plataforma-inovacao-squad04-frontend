// src/lib/auth.ts
import { usersData, type Role, type User } from "@/mocks/UserData";

// Simulação de usuário logado (troque o índice para testar)
const currentUser: User = usersData[0];

export async function getUserRole(): Promise<Role> {
    return currentUser.role;
}

export async function getCurrentUser(): Promise<User> {
    return currentUser;
}

// (Opcional) helper se quiser usar em outros lugares
export async function getUserCompanyId(): Promise<number> {
    return currentUser.companyId;
}
