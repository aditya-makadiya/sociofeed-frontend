import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useProfile from "../../hooks/useProfile";
import { motion } from "framer-motion";
import ProfileHeader from "../../components/profile/ProfileHeader";
import UserPosts from "../../components/profile/UserPosts";
import { CircularProgress, Typography, Box } from "@mui/material";
import { showSuccessToast, showErrorToast } from "../../components/notifications/toastUtils"; // Import your toast utility

const ProfilePage = () => {
  const { user } = useAuth();
  const {
    profile,
    posts,
    loading: profileLoading,
    postsLoading,
    error: profileError,
    getUserProfile,
    getUserPosts,
  } = useProfile();
  const { id } = useParams();
  const navigate = useNavigate();

  const isValidUUID = (id) => {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  };

  useEffect(() => {
    if (id && !isValidUUID(id)) {
      console.error("Invalid user ID format:", id);
      showErrorToast("Invalid profile ID", "error");
      navigate("/404", {
        state: { message: "Invalid profile ID format." },
      });
      return; // Important: Return early to prevent further execution
    }

    if (!id && !user?.id) return;

    const profileId = id || user.id;
    console.log("Fetching profile for ID:", profileId);

    Promise.all([
      getUserProfile(profileId),
      getUserPosts(profileId, 1, 10),
    ]).catch((error) => {
      console.error("Error fetching profile data:", error);
    });
  }, [id, user?.id]);

  if (!user) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <Box textAlign="center" padding={6}>
          <CircularProgress size={40} />
          <Typography variant="body2" color="textSecondary" mt={2}>
            Loading user data...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (profileLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <Box textAlign="center" padding={6}>
          <CircularProgress size={40} />
          <Typography variant="body2" color="textSecondary" mt={2}>
            Loading profile...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (profileError) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <Box textAlign="center" padding={6}>
          <Typography color="error" variant="h6">
            {profileError}
          </Typography>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </Box>
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <Box textAlign="center" padding={6}>
          <Typography color="error" variant="h6">
            Unable to load profile. Please try again.
          </Typography>
          <button
            onClick={() =>
              Promise.all([
                getUserProfile(id || user.id),
                getUserPosts(id || user.id, 1, 10),
              ])
            }
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </Box>
      </Box>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full min-h-screen bg-gray-50"
    >
      <div className="w-full max-w-6xl mx-auto px-4 py-6">
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <ProfileHeader
              user={profile}
              isOwnProfile={user?.id === (id || user.id)}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <UserPosts posts={posts} loading={postsLoading} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
