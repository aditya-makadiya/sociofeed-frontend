// src/pages/auth/Activation.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import endpoints from "../../utils/api/endpoints";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Paper,
} from "@mui/material";

const ActivationPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activated, setActivated] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const activateAccount = async () => {
      setLoading(true);
      try {
        await endpoints.activate(token);
        setActivated(true);
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Activation failed. The link may be invalid or expired."
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      activateAccount();
    } else {
      setError("Invalid activation link.");
      setLoading(false);
    }
  }, [token]);

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="#f3f4f6"
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: "100%" }}>
        {loading ? (
          <Box display="flex" flexDirection="column" alignItems="center">
            <CircularProgress />
            <Typography mt={2}>Activating your account...</Typography>
          </Box>
        ) : activated ? (
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography
              variant="h5"
              fontWeight="bold"
              color="success.main"
              gutterBottom
            >
              Account Activated!
            </Typography>
            <Typography mb={3} color="text.secondary">
              Your account has been successfully activated. You can now log in.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/login")}
              fullWidth
            >
              Go to Login
            </Button>
          </Box>
        ) : (
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography variant="h6" color="error" gutterBottom>
              Activation Failed
            </Typography>
            <Typography mb={3} color="text.secondary">
              {error}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/login")}
              fullWidth
            >
              Go to Login
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ActivationPage;
