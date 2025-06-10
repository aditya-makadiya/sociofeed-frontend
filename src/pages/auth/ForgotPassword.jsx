import React, { useState } from "react";
import { Box, Paper, Typography, TextField, Button } from "@mui/material";
import { motion } from "framer-motion";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const { forgotPassword, loading, error, clearError } = useAuth();
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await forgotPassword({ identifier });
    if (result?.type === "auth/forgotPassword/fulfilled") {
      setIsSent(true);
    }
  };

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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex flex-col items-center"
          >
            <Typography
              variant="h5"
              className="font-bold text-gray-900 mb-4 tracking-tight"
            >
              Forgot Password
            </Typography>
            {isSent ? (
              <>
                <Typography className="mb-6 text-green-600 text-sm text-center font-medium">
                  If that email or username is registered, you'll receive a
                  password reset link soon.
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
              </>
            ) : (
              <form onSubmit={handleSubmit} className="w-full">
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex justify-between items-center w-full">
                    <span className="text-sm">{error}</span>
                    <button
                      onClick={clearError}
                      className="text-red-700 hover:text-red-900"
                    >
                      ✕
                    </button>
                  </div>
                )}
                <Typography className="mb-6 text-gray-500 text-sm text-center">
                  Enter your email or username to receive a password reset link.
                </Typography>
                <TextField
                  label="Email or Username"
                  type="text"
                  fullWidth
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  margin="normal"
                  variant="outlined"
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": {
                        borderColor: "#1e40af",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#1e40af",
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#1e40af",
                    },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={loading}
                  className="py-3 rounded-lg text-sm font-medium mt-4"
                  sx={{
                    backgroundColor: "#1e40af",
                    "&:hover": { backgroundColor: "#1d4ed8" },
                    textTransform: "none",
                  }}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            )}
          </motion.div>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default ForgotPasswordPage;
