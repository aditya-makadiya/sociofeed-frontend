import React from "react";
import LoginForm from "../../components/auth/LoginForm";
import { motion } from "framer-motion";
import useAuth from "../../hooks/useAuth";

const LoginPage = () => {
  const { loginUser, loading, error, clearError } = useAuth();

  return (
    <div className="min-h-screen w-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex justify-between items-center">
            <span className="text-sm">{error}</span>
            <button
              onClick={clearError}
              className="text-red-700 hover:text-red-900"
            >
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
