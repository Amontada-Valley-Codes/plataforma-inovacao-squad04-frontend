export type Role =
  | "ADMINISTRATOR"
  | "MANAGER"
  | "INNOVATION_TEAM"
  | "TRANSFORMATION_OFFICE"
  | "STEERING_COMMITTEE"
  | "COLLABORATOR"
  | "OBSERVER"
  | "STARTUP";


export const GLOBAL_ROLES: Role[] = ["ADMINISTRATOR"];

export const COMPANY_ROLES: Role[] = [
  "MANAGER",
  "INNOVATION_TEAM",
  "TRANSFORMATION_OFFICE",
  "STEERING_COMMITTEE",
  "COLLABORATOR",
  "OBSERVER",
];

export const STARTUP_ROLES: Role[] = ["STARTUP"];


export const CAN_MANAGE_STRATEGIC_OBJECTIVES: Role[] = [
  "ADMINISTRATOR",
  "MANAGER",
  "TRANSFORMATION_OFFICE",
];

export const CAN_MANAGE_CHALLENGES: Role[] = [
  "ADMINISTRATOR",
  "MANAGER",
  "INNOVATION_TEAM",
  "TRANSFORMATION_OFFICE",
  "STEERING_COMMITTEE",
];

export const READ_AND_COMMENT_ONLY: Role[] = ["OBSERVER"];


export const OWN_RESOURCES_ONLY: Role[] = ["COLLABORATOR"];



export function isGlobalRole(role: Role): boolean {
  return GLOBAL_ROLES.includes(role);
}

export function isCompanyRole(role: Role): boolean {
  return COMPANY_ROLES.includes(role);
}

export function isStartupRole(role: Role): boolean {
  return STARTUP_ROLES.includes(role);
}

export function hasPermission(role: Role, allowed: Role[]): boolean {
  return allowed.includes(role);
}

export function normalizeRole(raw: unknown): Role | null {
  const v = String(raw ?? "").trim().toUpperCase();

  switch (v) {
    case "ADMINISTRATOR":
    case "ADMIN":
      return "ADMINISTRATOR";
    case "MANAGER":
    case "GESTOR":
      return "MANAGER";
    case "INNOVATION_TEAM":
      return "INNOVATION_TEAM";
    case "TRANSFORMATION_OFFICE":
      return "TRANSFORMATION_OFFICE";
    case "STEERING_COMMITTEE":
      return "STEERING_COMMITTEE";
    case "COLLABORATOR":
      return "COLLABORATOR";
    case "OBSERVER":
      return "OBSERVER";
    case "STARTUP":
      return "STARTUP";
    default:
      return null;
  }
}

export function getDefaultRoute(
  role: Role,
  ids: { enterpriseId?: string | null; startupId?: string | null }
): string {
  switch (role) {
    case "ADMINISTRATOR":
      return "/admin/dashboard";

    case "MANAGER":
    case "INNOVATION_TEAM":
    case "TRANSFORMATION_OFFICE":
    case "STEERING_COMMITTEE":
    case "COLLABORATOR":
    case "OBSERVER":
      return ids.enterpriseId
        ? `/company/${ids.enterpriseId}/dashboard`
        : "/sem-permissao";

    case "STARTUP":
      return ids.startupId
        ? `/startup/${ids.startupId}/dashboard`
        : "/sem-permissao";
  }
}