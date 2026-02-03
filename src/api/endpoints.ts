
export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    RESET_PASSWORD: '/auth/reset'
  },

  USER: {
    CREATE: "/user",
    SHOW_ALL: "/user",
    UPDATE: "/user",
    SHOW_ONE: (id: string) => `/user/${id}`,
    DELETE: (id: string) => `/user/${id}`,
    PROFILE: "/user/profile/myProfile"
  },

  ENTERPRISE: {
    CREATE: "/enterprise",
    SHOW_ALL: "/enterprise",
    SHOW_ONE_ENTERPRISE: (id: string) => `/enterprise/${id}`,
    GET_MY_ENTERPRISE: "/enterprise/user/enterpriseMe",
  },

  INVITE: {
    SEND: "/invite",
    FORGOT_PASSWORD: "/invite/request"
  },

  STARTUP: {
    CREATE: "/startup",
    SHOW_ALL: "/startup",
    SHOW_ONE: (id: string) => `/startup/${id}`,
    UPDATE_ONE: (id: string) => `/startup/${id}`,
    DELETE_ONE: (id: string) => `/startup/${id}`,

    PENDING_APPROVE: "/startup/pending/approve",
    APPROVE: (id: string) => `/startup/${id}/approve`,
    PUBLIC_CREATE: "/startup/public",

    PATCH_COVER: "/startup/coverImage",
    PATCH_PROFILE: "/startup/profileImage",

    SEARCH_NAME: (q: string) => `/startup/search/name/startup?q=${encodeURIComponent(q)}`,
    FILTER_SEGMENT: (s: string) => `/startup/filter/segment?value=${encodeURIComponent(s)}`,
    FILTER_TECH: (t: string) => `/startup/filter/technology?value=${encodeURIComponent(t)}`,
    FILTER_PROBLEM: (p: string) => `/startup/filter/problem?value=${encodeURIComponent(p)}`,

    ME: "/startup/user/startupMe",
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
    START_DETAILED_SCREENING: (id: string) => `/detailed-screening/${id}`,
    SHOW_DETAILED_SCREENING_BY_ID: (id: string) => `/detailed-screening/${id}`,
    SHOW_DETAILED_SCREENING: `/detailed-screening`,
    DELETE_DETAILED_SCREENING: (id: string) => `/detailed-screening/${id}`,
  },

    CONCEPTION_DOCUMENT: {
    CREATE: (screeningId: string) => `/detailed-screening/conception-document/${screeningId}`,
    DELETE: (id: string) => `/detailed-screening/conception-document/${id}`,
    UPDATE: (id: string) => `/detailed-screening/conception-document/${id}`,
    SHOW_ONE: (id: string) => `/detailed-screening/conception-document/findById/${id}`,
  },

  IMMERSION_DOCUMENT: {
    CREATE: (screeningId: string) => `/detailed-screening/immersion-document/${screeningId}`,
    UPDATE: (id: string) => `/detailed-screening/immersion-document/${id}`,
    DELETE: (id: string) => `/detailed-screening/immersion-document/${id}`,
    SHOW_ONE: (id: string) => `/detailed-screening/immersion-document/${id}`,
    CREATE_PROBLEM_TREE: (immersionId: string) => `/detailed-screening/immersion-document/problemTreen/${immersionId}`,
    SHOW_PROBLEM_TREE: (immersionId: string) => `/detailed-screening/immersion-document/problemTreen/${immersionId}`,
    DELETE_PROBLEM_TREE_NODE: (id: string) => `/detailed-screening/immersion-document/problemTreen/${id}`,
    UPDATE_PROBLEM_TREE_NODE: (id: string) => `/detailed-screening/immersion-document/problemTreen/${id}`,
    CREATE_MAP_EMPATHY: (immersionId: string) => `/detailed-screening/immersion-document/mapEmpathy/${immersionId}`,
    UPDATE_MAP_EMPATHY: (id: string) => `/detailed-screening/immersion-document/mapEmpathy/${id}`,
    DELETE_MAP_EMPATHY: (id: string) => `/detailed-screening/immersion-document/mapEmpathy/${id}`,
    SHOW_MAP_EMPATHY: (id: string) => `/detailed-screening/immersion-document/mapEmpathy/${id}`,
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

  COMMENTS_FUNNEL: {
    CREATE_COMMENT: (id: string) => `/comments-funnel/${id}`,
    UPDATE_COMMENT: (id: string) => `/comments-funnel/${id}`,
    DELETE_COMMENT: (id: string) => `/comments-funnel/${id}`,
    LIKED_COMMENT: (id: string) => `/comments-funnel/${id}/like`,
    FILTERED_COMMENT: (id: string, context: string) => `/comments-funnel/filter/context/${id}?context=${encodeURIComponent(context)}`
  },

  STRATEGIC_OBJECTIVES: {
    CREATE_OBJECTIVE: "/strategic-objectives",
    SHOW_ALL_OBJECTIVES: "/strategic-objectives",
    SHOW_ONE_OBJECTIVE: (id: string) => `/strategic-objectives/${id}`,
    UPDATE_OBJECTIVE: (id: string) => `/strategic-objectives/${id}`,
    DELETE_OBJECTIVE: (id: string) => `/strategic-objectives/${id}`
  }
} 