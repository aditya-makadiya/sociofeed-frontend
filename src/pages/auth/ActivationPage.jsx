import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Paper,
} from "@mui/material";
import { motion } from "framer-motion";
import useAuth from "../../hooks/useAuth";

const ActivationPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { activateAccount, loading, error, clearError } = useAuth();
  const [isActivated, setIsActivated] = useState(false);

  useEffect(() => {
    const activate = async () => {
      if (!token) {
        console.error("Invalid activation link.");
        clearError();
        return;
      }
      try {
        const result = await activateAccount(token);
        if (result?.type === "auth/activate/fulfilled") {
          setIsActivated(true);
          setTimeout(() => navigate("/login"), 2000);
        }
      } catch (err) {
        console.error("Activation error:", err.message);
      }
    };
    activate();
  }, [token]);

  return (
    <Box className="min-h-screen w-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <Paper
          elevation={3}
          className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8"
        >
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center"
            >
              <CircularProgress sx={{ color: "#1e40af" }} />
              <Typography className="mt-4 text-gray-600 text-sm">
                Activating your account...
              </Typography>
            </motion.div>
          ) : isActivated ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center"
            >
              <Typography
                variant="h5"
                className="font-bold text-green-600 mb-4 tracking-tight"
              >
                Account Activated!
              </Typography>
              <Typography className="mb-6 text-gray-500 text-sm text-center">
                Your account has been successfully activated. Redirecting to
                login...
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/login")}
                fullWidth
                className="py-3 rounded-lg text-sm font-medium"
                sx={{
                  backgroundColor: "#1e40af",
                  "&:hover": { backgroundColor: "#1d4ed8" },
                  textTransform: "none",
                }}
              >
                Go to Login
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center"
            >
              <Typography variant="h6" className="text-red-500 mb-4">
                Activation Failed
              </Typography>
              <Typography className="mb-6 text-gray-500 text-sm text-center">
                {error || "The activation link may be invalid or expired."}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  clearError();
                  navigate("/login");
                }}
                fullWidth
                className="py-3 rounded-lg text-sm font-medium"
                sx={{
                  backgroundColor: "#1e40af",
                  "&:hover": { backgroundColor: "#1d4ed8" },
                  textTransform: "none",
                }}
              >
                Go to Login
              </Button>
            </motion.div>
          )}
        </Paper>
      </motion.div>
    </Box>
  );
};

export default ActivationPage;
