
export const AUTH_ENDPOINTS = {
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  ACTIVATE: (token) => `/auth/activate/${token}`,
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: (token) => `/auth/reset-password/${token}`,
  RESEND_ACTIVATION: '/auth/resend-activation',
  REFRESH_TOKEN: '/auth/refresh-token',
  LOGOUT: '/auth/logout',
};