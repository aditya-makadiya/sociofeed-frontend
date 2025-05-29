// src/pages/auth/ForgotPassword.jsx
import React, { useState } from "react";
import endpoints from "../../utils/api/endpoints";
import {
  showSuccessToast,
  showErrorToast,
} from "../../components/notifications/toastUtils";
import { Box, Paper, Typography, TextField, Button } from "@mui/material";

const ForgotPasswordPage = () => {
  const [identifier, setIdentifier] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await endpoints.forgotPassword({ identifier });
      setSent(true);
      showSuccessToast("Reset password link sent! Please check your email.");
    } catch (err) {
      showErrorToast(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to send reset password link."
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
          Forgot Password
        </Typography>
        {sent ? (
          <Typography color="success.main" align="center">
            If that email is registered, you’ll receive a password reset link
            soon.
          </Typography>
        ) : (
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
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
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        )}
      </Paper>
    </Box>
  );
};

export default ForgotPasswordPage;
