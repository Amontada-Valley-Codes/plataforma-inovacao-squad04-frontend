export type RoleEn = "COMMON" | "ADMINISTRATOR" | "EVALUATOR" | "MANAGER";

export type ShowAllUsersItem = {
    id: string;
    name: string;
    email: string;
    role?: RoleEn | null;
    type_user?: RoleEn | null;
    enterpriseId?: string | null;
    startupId?: string | null;
    createdAt?: string;
    updatedAt?: string;
    isActive?: boolean;
    active?: boolean;
    
};

export type ShowAllUsersResponse = ShowAllUsersItem[];