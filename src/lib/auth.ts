// src/lib/auth.ts
// Mock simples para testar roles localmente

export async function getUserRole(): Promise<"gestor" | "avaliador" | "admin"> {
    // Aqui podes trocar manualmente para testar:
    // return "gestor";
    return "gestor";
}