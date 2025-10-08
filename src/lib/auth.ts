// src/lib/auth.ts
// Mock simples para testar roles e usuário localmente
import { usersData } from "@/mocks/UserData"; // importa teu novo mock

// Pega o usuário logado (podes trocar o índice para testar)
const currentUser = usersData[0]; // ← aqui simulas quem está logado

// Mantém a tua função original, só adiciona o tipo "usuario"
export async function getUserRole(): Promise<"gestor" | "avaliador" | "admin" | "usuario"> {
    return currentUser.role;
}

// Nova função: retorna os dados completos do usuário logado
export async function getCurrentUser() {
    return currentUser;
}
