import React, { useState } from "react";
import RegisterForm from "../../components/auth/RegisterForm";
import endpoints from "../../utils/api/endpoints";
import {
  showSuccessToast,
  showErrorToast,
} from "../../components/notifications/toastUtils";
import { motion } from "framer-motion";

const RegistrationPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (data) => {
    setIsSubmitting(true);
    try {
      await endpoints.register(data);
      showSuccessToast(
        "Registration successful! Please check your email to activate your account."
      );
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Registration failed. Please try again.";
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
        <RegisterForm onSubmit={handleRegister} isSubmitting={isSubmitting} />
      </motion.div>
    </div>
  );
};

export default RegistrationPage;
