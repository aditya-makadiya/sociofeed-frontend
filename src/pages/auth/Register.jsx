import RegisterForm from "../../components/auth/RegisterForm";
import { motion } from "framer-motion";
import useAuth from "../../hooks/useAuth";

const RegistrationPage = () => {
  const { registerUser, loading, error } = useAuth();

  return (
    <div className="min-h-screen w-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
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
