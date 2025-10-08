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
    nome: "Isaac Silva",
    email: "isaac@email.com",
    role: "usuario",
    companyId: 1,
  },
  {
    id: 2,
    nome: "Admin",
    email: "admin@email.com",
    role: "admin",
    companyId: 2,
  },
  // ...outros usuários (se quiser)
];
