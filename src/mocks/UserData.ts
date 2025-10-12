export type Role = "admin" | "gestor" | "avaliador" | "usuario";

export type User = {
  id: number;
  nome: string;
  email: string;
  role: Role;
  companyId: number;
};

export const usersData: User[] = [
  { id: 1, nome: "Lara",     email: "usuario@email.com", role: "usuario",   companyId: 1 },
  { id: 2, nome: "Maria",    email: "gestor@email.com",  role: "gestor",    companyId: 1 },
  { id: 3, nome: "Eduardo",  email: "admin@email.com",   role: "admin",     companyId: 1 },
  { id: 4, nome: "Joao",     email: "avaliador@email.com", role: "avaliador", companyId: 1 },
];
