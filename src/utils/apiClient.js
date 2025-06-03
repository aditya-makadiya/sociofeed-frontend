import axios from "axios";
import { showErrorToast } from "../components/notifications/toastUtils";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: Add JWT if available
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor: Return data only
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let message = "An unexpected error occurred";
    if (error.response) {
      if (error.response.status === 400 && error.response.data.errors) {
        message = Object.values(error.response.data.errors).join(", ");
      } else {
        message = error.response.data.message || message;
      }
    } else if (error.request) {
      message = "Network error. Please check your connection.";
    }
    showErrorToast(message);
    return Promise.reject(error);
  },
);

export default apiClient;
