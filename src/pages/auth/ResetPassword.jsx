import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Paper, Typography, TextField, Button } from "@mui/material";
import { motion } from "framer-motion";
import useAuth from "../../hooks/useAuth";
import { showErrorToast } from "../../components/notifications/toastUtils";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { resetPassword, loading, error, clearError } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isDone, setIsDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showErrorToast("Passwords do not match.");
      return;
    }
    const result = await resetPassword({
      token,
      data: { password, confirmPassword },
    });
    if (result?.type === "auth/resetPassword/fulfilled") {
      setIsDone(true);
      setTimeout(() => navigate("/login"), 2000);
    }
  };

  return (
    <Box className="min-h-screen w-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-red-500 to-orange-600 px-6">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <Paper
          elevation={3}
          className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <Typography
              variant="h5"
              className="font-extrabold text-gray-900 mb-4 tracking-tight"
            >
              Reset Password
            </Typography>
            {isDone ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center w-full"
              >
                <Typography className="mb-6 text-green-600 text-sm text-center font-medium">
                  Password reset successful! Redirecting to login...
                </Typography>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => navigate("/login")}
                    className="py-3 rounded-full text-sm font-medium tracking-wide"
                    sx={{
                      backgroundColor: "#2563eb",
                      "&:hover": { backgroundColor: "#1d4ed8" },
                      textTransform: "none",
                    }}
                  >
                    Go to Login
                  </Button>
                </motion.div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="w-full">
                {error && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex justify-between items-center w-full">
                    <span>{error}</span>
                    <button onClick={clearError} className="text-red-700">
                      ✕
                    </button>
                  </div>
                )}
                <Typography className="mb-6 text-gray-500 text-sm text-center">
                  Enter your new password below.
                </Typography>
                <TextField
                  label="New Password"
                  type="password"
                  fullWidth
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  margin="normal"
                  variant="outlined"
                  size="small"
                  className="rounded-lg"
                  InputProps={{
                    className: "border rounded-lg px-4 py-2 text-sm bg-gray-50",
                  }}
                />
                <TextField
                  label="Confirm Password"
                  type="password"
                  fullWidth
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  margin="normal"
                  variant="outlined"
                  size="small"
                  className="rounded-lg"
                  InputProps={{
                    className: "border rounded-lg px-4 py-2 text-sm bg-gray-50",
                  }}
                />
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={loading}
                    className="py-3 rounded-full text-sm font-medium tracking-wide mt-4"
                    sx={{
                      backgroundColor: "#2563eb",
                      "&:hover": { backgroundColor: "#1d4ed8" },
                      textTransform: "none",
                    }}
                  >
                    {loading ? "Resetting..." : "Reset Password"}
                  </Button>
                </motion.div>
              </form>
            )}
          </motion.div>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default ResetPasswordPage;
