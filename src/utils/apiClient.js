import axios from "axios";
import { showErrorToast } from "../components/notifications/toastUtils";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
      console.log(token);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// Request Interceptor (optional - add token if needed)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => apiClient(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await apiClient.get("/auth/refresh-token");
        processQueue(null);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        window.location.href = "/login"; // Optional: force logout
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

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

    console.error("API error:", {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
    });

    return Promise.reject(error);
  },
);

export default apiClient;
