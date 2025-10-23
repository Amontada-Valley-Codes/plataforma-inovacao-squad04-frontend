export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register' 
  },

  ENTERPRISE: {
    CREATE: '/enterprise',
    SHOW_ALL: '/enterprise',
    SHOW_ONE_ENTERPRISE: (id: string) => `/enterprise/${id}`,
  },

  INVITE: {
    SEND: '/invite'
  },

  STARTUP: {
    CREATE: '/startup',
    SHOW_ALL: '/startup'
  },

  CHALLENGE: {
    CREATE: '/challenge',
    SHOW_ENTERPRISE_CHALLENGE: '/challenge',
    SHOW_ALL_PUBLIC_CHALLENGE: '/challenge/public',
    SHOW_CHALLENGE_HISTORICAL_ENTERPRISE: '/challenge/historical',
    SHOW_ONE_CHALLENGE: (id: string) => `/challenge/${id}`,
    UPDATE_CHALLENGE: (id: string) => `/challenge/${id}`,
    UPDATE_STATUS: (id: string) => `/challenge/${id}/status`,
    UPDATE_VISIBILITY: (id: string) => `/challenge/${id}/visibility`
  },

  CHECKLIST: {
    CREATE_CHECKLIST: (id: string) => `/checklist/${id}`,
    SHOW_CHECKLIST: (id: string) => `/checklist/${id}`,
    UPDATE_STATUS_CHECKLIST: (id: string) => `/checklist/${id}`,
    DELETE_CHECKLIST: (id: string) => `/checklist/${id}`,
    UPDATE_ITEM_CHECKLIST: (id: string) => `/checklist/${id}`
  },

  DASHBOARD: {
    ADMIN: '/admin/dashboard',
    GESTOR: '/dashboard/gestor'
  }
}