import React from "react";
import LoginForm from "../../components/auth/LoginForm";
import { motion } from "framer-motion";
import useAuth from "../../hooks/useAuth";

const LoginPage = () => {
  const { loginUser, loading, error, clearError } = useAuth();

  return (
    <div className="min-h-screen w-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-red-500 to-orange-600 px-6">
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="w-full max-w-md"
      >
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex justify-between items-center">
            <span>{error}</span>
            <button onClick={clearError} className="text-red-700">
              ✕
            </button>
          </div>
        )}
        <LoginForm
          onSubmit={loginUser}
          isSubmitting={loading}
          serverError={error}
        />
      </motion.div>
    </div>
  );
};

export default LoginPage;
