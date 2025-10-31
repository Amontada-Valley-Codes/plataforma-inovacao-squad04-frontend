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

export type ShowLoggedUserResponse = {
  id: string,
  name: string,
  email: string,
  phone: string,
  googleId: null,
  lastAccessAt: null,
  type_user: string,
  createdAt: string,
  enterpriseId: string,
  image: null,
  startupId: null,
  Enterprise: {
    name: string,
  },
  Startup: null
}

export type ShowAllUsersResponse = ShowAllUsersItem[];