// src/lib/roles.ts
export type RolePt = "admin" | "gestor" | "avaliador" | "usuario";
export type RoleEn = "ADMINISTRATOR" | "MANAGER" | "EVALUATOR" | "COMMON";

export const enToPt: Record<RoleEn, RolePt> = {
  ADMINISTRATOR: "admin",
  MANAGER: "gestor",
  EVALUATOR: "avaliador",
  COMMON: "usuario",
};
