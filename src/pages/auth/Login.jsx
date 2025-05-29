// src/pages/auth/Login.jsx
import React, { useState } from "react";
import LoginForm from "../../components/auth/LoginForm";
import endpoints from "../../utils/api/endpoints";
import {
  showSuccessToast,
  showErrorToast,
} from "../../components/notifications/toastUtils";

const LoginPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (data) => {
    setIsSubmitting(true);
    try {
      await endpoints.login(data);
      showSuccessToast("Login successful!");
      // Optionally redirect or handle post-login logic here
    } catch (err) {
      showErrorToast(
        err?.response?.data?.message ||
          err?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return <LoginForm onSubmit={handleLogin} isSubmitting={isSubmitting} />;
};

export default LoginPage;
