import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../../components/auth/LoginForm";
import endpoints from "../../utils/api/endpoints";
import {
  showSuccessToast,
  showErrorToast,
} from "../../components/notifications/toastUtils";
import { motion } from "framer-motion";



const LoginPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (data) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await endpoints.login(data);
      showSuccessToast("Login successful!");
      navigate("/Home");
      // Optionally redirect or handle post-login logic here
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Login failed. Please try again.";
      setError(errorMsg);
      showErrorToast(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-red-500 to-orange-500 px-4">
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="w-full max-w-md"
      >
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-700">
              ✕
            </button>
          </div>
        )}
        <LoginForm onSubmit={handleLogin} isSubmitting={isSubmitting} />
      </motion.div>
    </div>
  );
};

export default LoginPage;
