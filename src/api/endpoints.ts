export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register' 
  },

  ENTERPRISE: {
    CREATE: '/enterprise',
    SHOW_ALL: '/enterprise'
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
    SHOW_ONE_CHALLENGE: '/challenge/',
    UPDATE_CHALLENGE: '/challenge/'
  },

  CHECKLIST: {
    CREATE_CHECKLIST: '/checklist/',
    SHOW_CHECKLIST: '/checklist/',
    UPDATE_STATUS_CHECKLIST: '/checklist/',
    DELETE_CHECKLIST: '/checklist/',
    UPDATE_ITEM_CHECKLIST: '/checklist/' 
  }
}