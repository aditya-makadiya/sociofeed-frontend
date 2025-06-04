import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  register,
  login,
  activate,
  forgotPassword,
  resetPassword,
  resendActivation,
  refreshToken,
  logout,
  clearError,
  getMe,
} from "../app/slices/authSlice";
import {
  showSuccessToast,
  showErrorToast,
} from "../components/notifications/toastUtils";

const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated, loading, error } = useSelector(
    (state) => state.auth,
  );

  const registerUser = async (data) => {
    try {
      const registerData = {
        email: data.email,
        username: data.username,
        password: data.password,
        confirmPassword: data.confirmPassword,
      };
      const result = await dispatch(register(registerData));
      if (register.fulfilled.match(result)) {
        showSuccessToast(
          "Registration successful! Please check your email to activate your account.",
        );
        // navigate('/login');
      }
      return result;
    } catch (error) {
      showErrorToast(error.message || "Registration failed. Please try again.");
      throw error;
    }
  };

  const loginUser = async (data) => {
    try {
      const loginData = {
        identifier: data.identifier,
        password: data.password,
      };
      const result = await dispatch(login(loginData));
      console.log(user);

      if (login.fulfilled.match(result)) {
        showSuccessToast("Login successful!");
        navigate("/");
        console.log(result);
      }
      return result;
    } catch (error) {
      showErrorToast(error.message || "Login failed. Please try again.");
      throw error;
    }
  };

  const activateAccount = async (token) => {
    try {
      const result = await dispatch(activate(token));
      if (activate.fulfilled.match(result)) {
        showSuccessToast("Account activated successfully!");
      }
      return result;
    } catch (error) {
      showErrorToast(error.message || "Activation failed. Please try again.");
      throw error;
    }
  };

  const forgotPasswordRequest = async (data) => {
    try {
      const result = await dispatch(forgotPassword(data));
      if (forgotPassword.fulfilled.match(result)) {
        showSuccessToast("Reset password link sent! Please check your email.");
      }
      return result;
    } catch (error) {
      showErrorToast(error.message || "Failed to send reset password link.");
      throw error;
    }
  };

  const resetPasswordRequest = async ({ token, data }) => {
    try {
      const result = await dispatch(resetPassword({ token, data }));
      if (resetPassword.fulfilled.match(result)) {
        showSuccessToast("Password reset successful! You can now log in.");
      }
      return result;
    } catch (error) {
      showErrorToast(error.message || "Failed to reset password.");
      throw error;
    }
  };

  const logoutUser = async () => {
    try {
      const result = await dispatch(logout());
      if (logout.fulfilled.match(result)) {
        showSuccessToast("Logged out successfully!");
        navigate("/login");
      }
    } catch (error) {
      showErrorToast(error.message || "Failed to Logout.");
      throw error;
    }
  };

  const getUser = async () => {
    try {
      const result = await dispatch(getMe());
      if (getMe.fulfilled.match(result)) {
        return result.payload;
      }
      throw new Error(result.payload || "Failed to fetch user");
    } catch (error) {
      showErrorToast(error.message || "Failed to fetch user");
      throw error;
    }
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    registerUser,
    loginUser,
    logoutUser,
    activateAccount,
    forgotPassword: forgotPasswordRequest,
    resetPassword: resetPasswordRequest,
    getUser,
    resendActivation: async (data) => {
      const result = await dispatch(resendActivation(data));
      if (resendActivation.fulfilled.match(result)) {
        showSuccessToast("Activation email resent! Please check your email.");
      }
      return result;
    },
    refreshToken: async () => {
      const result = await dispatch(refreshToken());
      if (refreshToken.fulfilled.match(result)) {
        showSuccessToast("Token refreshed successfully!");
      }
      return result;
    },

    clearError: () => dispatch(clearError()),
  };
};

export default useAuth;
