import axios from './axiosConfig';
import { AUTH_ENDPOINTS } from '../../constants/api';

export default {
  register: (data) => axios.post(AUTH_ENDPOINTS.REGISTER, data),
  login: (data) => axios.post(AUTH_ENDPOINTS.LOGIN, data),
  activate: (token) => axios.get(AUTH_ENDPOINTS.ACTIVATE(token)),
  forgotPassword: (data) => axios.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, data),
  resetPassword: (token, data) => axios.post(AUTH_ENDPOINTS.RESET_PASSWORD(token), data),
  resendActivation: (data) => axios.post(AUTH_ENDPOINTS.RESEND_ACTIVATION, data),
  refreshToken: () => axios.get(AUTH_ENDPOINTS.REFRESH_TOKEN),
  logout: () => axios.post(AUTH_ENDPOINTS.LOGOUT),
};
