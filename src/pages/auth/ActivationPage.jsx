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
import { motion } from "framer-motion";

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
    <Box className="min-h-screen w-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-red-500 to-orange-500 px-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <Paper
          elevation={3}
          className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8"
        >
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <CircularProgress sx={{ color: "#2563eb" }} />
              <Typography className="mt-4 text-gray-600 text-sm">
                Activating your account...
              </Typography>
            </motion.div>
          ) : activated ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <Typography
                variant="h5"
                className="font-extrabold text-green-600 mb-4 tracking-tight"
              >
                Account Activated!
              </Typography>
              <Typography className="mb-6 text-gray-500 text-sm text-center">
                Your account has been successfully activated. You can now log
                in.
              </Typography>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate("/login")}
                  fullWidth
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <Typography variant="h6" className="text-red-500 mb-4">
                Activation Failed
              </Typography>
              <Typography className="mb-6 text-gray-500 text-sm text-center">
                {error}
              </Typography>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate("/login")}
                  fullWidth
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
          )}
        </Paper>
      </motion.div>
    </Box>
  );
};

export default ActivationPage;
