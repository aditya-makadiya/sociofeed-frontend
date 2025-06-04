import { useEffect } from "react";
import { useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useProfile from "../../hooks/useProfile";
import { motion } from "framer-motion";
import ProfileHeader from "../../components/profile/ProfileHeader";
import UserPosts from "../../components/profile/UserPosts";
import { CircularProgress, Typography, Box } from "@mui/material";

const ProfilePage = () => {
  const { user } = useAuth();
  const {
    profile,
    posts,
    loading: profileLoading,
    error: profileError,
    getUserProfile,
    getUserPosts,
  } = useProfile();
  const { id } = useParams();

  useEffect(() => {
    if (!id && !user?.id) return; // Skip if no profileId
    const profileId = id || user.id;
    console.log("Fetching profile for ID:", profileId);
    Promise.all([
      getUserProfile(profileId),
      getUserPosts(profileId, 1, 10),
    ]).catch((error) => {
      console.error("Error fetching profile data:", error);
    });
  }, [id]);

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
      className="w-full h-full"
    >
      <div className="w-full max-w-4xl mx-auto">
        <div className="space-y-6">
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
            <UserPosts posts={posts} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
