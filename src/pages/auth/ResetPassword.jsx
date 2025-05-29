// src/pages/auth/ResetPassword.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import endpoints from "../../utils/api/endpoints";
import {
  showSuccessToast,
  showErrorToast,
} from "../../components/notifications/toastUtils";
import { Box, Paper, Typography, TextField, Button } from "@mui/material";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showErrorToast("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await endpoints
        .resetPassword(token, { password , confirmPassword })
      setDone(true);
      showSuccessToast("Password reset successful! You can now log in.");
    } catch (err) {
      console.log(err.message);
      
      showErrorToast(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to reset password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="#f3f4f6"
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: "100%" }}>
        <Typography variant="h5" mb={2} fontWeight="bold" align="center">
          Reset Password
        </Typography>
        {done ? (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => navigate("/login")}
          >
            Go to Login
          </Button>
        ) : (
          <form onSubmit={handleSubmit}>
            <TextField
              label="New Password"
              type="password"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
            />
            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              margin="normal"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        )}
      </Paper>
    </Box>
  );
};

export default ResetPasswordPage;
