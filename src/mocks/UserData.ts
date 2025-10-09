// src/mocks/UserData.ts
export type Role = "admin" | "gestor" | "avaliador" | "usuario";

    export type User = {
    id: number;
    nome: string;
    email: string;
    role: Role;
    companyId: number; // agora tipado "certinho"
    };

    export const usersData: User[] = [
    {
        id: 1,
        nome: "Lara",
        email: "isaac@email.com",
        role: "usuario",
        companyId: 1,
    },
    {
        id: 2,
        nome: "Maria Souza",
        email: "admin@email.com",
        role: "gestor",
        companyId: 2,
    },
    {
        id: 3,
        nome: "Eduardo",
        email: "admin@email.com",
        role: "admin",
        companyId: 2,
    },
    {
        id: 4,
        nome: "Joao",
        email: "admin@email.com",
        role: "avaliador",
        companyId: 2,
    },

];
