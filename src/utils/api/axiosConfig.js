import axios from 'axios';
import { showErrorToast } from '../../components/notifications/toastUtils';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'An unexpected error occurred';
    if (error.response) {
      if (error.response.status === 400 && error.response.data.errors) {
        message = Object.values(error.response.data.errors).join(', ');
      } else {
        message = error.response.data.message || message;
      }
    } else if (error.request) {
      message = 'Network error. Please check your connection.';
    }
    // showErrorToast(message);

    return Promise.reject(error);
  }
);

export default instance;
