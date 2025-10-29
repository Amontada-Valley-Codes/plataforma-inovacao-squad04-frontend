export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
  },

  ENTERPRISE: {
    CREATE: "/enterprise",
    SHOW_ALL: "/enterprise",
    SHOW_ONE_ENTERPRISE: (id: string) => `/enterprise/${id}`,
    GET_MY_ENTERPRISE: "/enterprise/user/enterpriseMe",
  },

  INVITE: {
    SEND: "/invite",
  },

    STARTUP: {
    SHOW_ALL: "/startup",
    SHOW_ONE: (id: string) => `/startup/${id}`,
    CREATE: "/startup",
  },

  CHALLENGE: {
    CREATE: "/challenge",
    SHOW_ENTERPRISE_CHALLENGE: "/challenge",
    SHOW_ALL_PUBLIC_CHALLENGE: "/challenge/public",
    SHOW_CHALLENGE_HISTORICAL_ENTERPRISE: "/challenge/historical",
    SHOW_ONE_PUBLIC_CHALLENGE: (id: string) => `/challenge/${id}/public`,
    SHOW_ONE_CHALLENGE: (id: string) => `/challenge/${id}`,
    UPDATE_CHALLENGE: (id: string) => `/challenge/${id}`,
    UPDATE_STATUS: (id: string) => `/challenge/${id}/status`,
    UPDATE_VISIBILITY: (id: string) => `/challenge/${id}/visibility`,
    VOTE_PRE_SCREENING: (id: string) => `/challenge/vote/${id}/pre-screening`,
    SHOW_PRE_SCREENING_VOTES: (id: string) => `/challenge/result/${id}/pre-screening`,
    HISTORICAL: {
      MY_HISTORY: "/challenge/historical/myhistory",
    },
  },

  CHECKLIST: {
    CREATE_CHECKLIST: (id: string) => `/checklist/${id}`,
    SHOW_CHECKLIST: (id: string) => `/checklist/${id}`,
    UPDATE_STATUS_CHECKLIST: (id: string) => `/checklist/${id}`,
    DELETE_CHECKLIST: (id: string) => `/checklist/${id}`,
    UPDATE_ITEM_CHECKLIST: (id: string) => `/checklist/${id}`,
  },

  DETAILED_SCREENING: {
    CREATE_DETAILED_SCREENING: (id: string) => `/detailed-screening/${id}`,
    SHOW_DETAILED_SCREENING: (id: string) => `/detailed-screening/${id}`,
    UPDATE_DETAILED_SCREENING: (id: string) => `/detailed-screening/${id}`,
    DELETE_DETAILED_SCREENING: (id: string) => `/detailed-screening/${id}`,
    VOTE_DETAILED_SCREENING: (id: string) => `/detailed-screening/${id}/vote`
  },

  EXPERIMENTATION: {
    CREATE_EXPERIMENTATION: (id: string) => `/experimentation/${id}`,
    SHOW_EXPERIMENTATION: (id: string) => `/experimentation/${id}`,
    UPDATE_EXPERIMENTATION: (id: string) => `/experimentation/${id}`,
  },

  KPIS: {
    CREATE_KPI: (id: string) => `/kp/${id}/KPIs`,
    SHOW_KPI: (id: string) => `/kp/${id}`,
    UPDATE_KPI: (id: string) => `kp/${id}`,
    DELETE_KPI: (id: string) => `kp/${id}`,
  },

  TAGS: {
    CREATE_TAG: (id: string) => `/tags/${id}`,
    SHOW_ALL_TAGS: (id: string) => `/tags/${id}/challenge`,
    SHOW_ONE_TAG: (id: string) => `/tags/${id}`,
    UPDATE_TAG: (id: string) => `/tags/${id}`,
    DELETE_TAG: (id: string) => `/tags/${id}`
  },

  IDEIA: {
    CREATE_IDEIA: (id: string) => `/ideia/${id}`,
    UPDATE_IDEIA: (id: string) => `/ideia/${id}`,
    DELETE_IDEIA: (id: string) => `/ideia/${id}`,
    LIKE_IDEIA: (id: string) => `/ideia/${id}/like`,
    SHOW_IDEIAS: (id: string) => `/ideia/${id}/ideias`,
    APPROVE_IDEIA: (id: string) => `/ideia/approved/${id}`,
    REJECT_IDEIA: (id: string) => `/ideia/rejected/${id}`
  },

  DASHBOARD: {
    ADMIN: "/admin/dashboard",
    GESTOR: "/dashboard/gestor",
  },

  USER: {
    SHOW_ALL: "/user",
  },

} as const;
