import apiClient from "../utils/apiClient";

const authService = {
  registerUser: async (data) => {
    console.log("Register payload:", data);
    const response = await apiClient.post("/auth/register", data);
    console.log("Register response:", response);
    return response; // response.data from interceptor
  },
  loginUser: async (data) => {
    console.log("Login Payload:", data);

    const response = await apiClient.post("/auth/login", data);
    return response;
  },
  activateAccount: async (token) => {
    const response = await apiClient.get(`/auth/activate/${token}`);
    return response;
  },
  forgotPassword: async (data) => {
    const response = await apiClient.post("/auth/forgot-password", data);
    return response;
  },
  resetPassword: async (token, data) => {
    const response = await apiClient.post(
      `/auth/reset-password/${token}`,
      data,
    );
    return response;
  },
  resendActivation: async (data) => {
    const response = await apiClient.post("/auth/resend-activation", data);
    return response;
  },
  refreshToken: async () => {
    const response = await apiClient.get("/auth/refresh-token");
    return response;
  },
  logoutUser: async () => {
    const response = await apiClient.post("/auth/logout");
    return response;
  },
  getMe: async () => {
    console.log("Fetching current user");
    const response = await apiClient.get("/auth/getMe");
    console.log("getMe response:", response);
    return response;
  },
};

export default authService;
