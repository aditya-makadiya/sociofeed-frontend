// import React, { useState } from "react";
import RegisterForm from "../../components/auth/RegisterForm";
import { motion } from "framer-motion";
import useAuth from "../../hooks/useAuth";

const RegistrationPage = () => {
  // const [isSubmitting, setIsSubmitting] = useState(false);
  const { registerUser, loading, error } = useAuth();

  return (
    <div className="min-h-screen w-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-red-500 to-orange-500 px-4">
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="w-full max-w-md"
      >
        <RegisterForm
          onSubmit={registerUser}
          isSubmitting={loading}
          serverError={error}
        />
      </motion.div>
    </div>
  );
};

export default RegistrationPage;
