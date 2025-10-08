// src/mocks/UserData.ts
export type User = {
    id: number;
    name: string;
    email: string;
    role: "usuario" | "gestor" | "avaliador" | "admin";
    empresaId?: number;
    };

    export const usersData: User[] = [
    {
        id: 1,
        name: "Lara",
        email: "lara@example.com",
        role: "usuario",
        empresaId: 2,
    },
    {
        id: 2,
        name: "Eduardo Albuquerque",
        email: "eduardo@techwave.com",
        role: "admin",
        empresaId: 1,
    },
    {
        id: 3,
        name: "João Silva",
        email: "joao@techwave.com",
        role: "avaliador",
        empresaId: 1,
    },

    {
        id: 4,
        name: "Maria Souza",
        email: "MariaSouza@techwave.com",
        role: "gestor",
        empresaId: 1,
    },
];
