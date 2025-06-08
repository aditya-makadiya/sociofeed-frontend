import { useDispatch, useSelector } from "react-redux";
import {
  fetchProfile,
  fetchUserPosts,
  followUser,
  unfollowUser,
  searchUsers,
  clearError,
  clearUsers,
} from "../app/slices/profileSlice";
import {
  showErrorToast,
  showSuccessToast,
} from "../components/notifications/toastUtils";

const useProfile = () => {
  const dispatch = useDispatch();
  const {
    profile,
    posts,
    users,
    usersTotal,
    loading,
    searchLoading,
    followLoading,
    error,
  } = useSelector((state) => state.profile);

  const getUserProfile = async (userId) => {
    try {
      const result = await dispatch(fetchProfile(userId));
      if (fetchProfile.fulfilled.match(result)) {
        return result.payload;
      }
      throw new Error(result.payload || "Failed to fetch profile");
    } catch (error) {
      showErrorToast(error.message || "Failed to fetch profile");
      return null;
    }
  };

  const getUserPosts = async (userId, page = 1, pageSize = 10) => {
    try {
      const result = await dispatch(fetchUserPosts({ userId, page, pageSize }));
      if (fetchUserPosts.fulfilled.match(result)) {
        return result.payload;
      }
      throw new Error(result.payload || "Failed to fetch posts");
    } catch (error) {
      showErrorToast(error.message || "Failed to fetch posts");
      return [];
    }
  };

  const handleSearchUsers = async (query, page = 1, pageSize = 10) => {
    try {
      const result = await dispatch(searchUsers({ query, page, pageSize }));
      if (searchUsers.fulfilled.match(result)) {
        return result.payload;
      }
      throw new Error(result.payload || "Failed to search users");
    } catch (error) {
      showErrorToast(error.message || "Failed to search users");
      return { users: [], total: 0 };
    }
  };

  const handleFollowUser = async (userId, isViewedProfile = false) => {
    try {
      const result = await dispatch(followUser({ userId, isViewedProfile }));
      if (followUser.fulfilled.match(result)) {
        showSuccessToast("Followed successfully!");
        if (isViewedProfile) {
          await dispatch(fetchProfile(userId));
        }
        return result.payload; // Return updated user data
      }
      throw new Error(result.payload || "Failed to follow user");
    } catch (error) {
      showErrorToast(error.message || "Failed to follow user");
      return null;
    }
  };

  const handleUnfollowUser = async (userId, isViewedProfile = false) => {
    try {
      const result = await dispatch(unfollowUser({ userId, isViewedProfile }));
      if (unfollowUser.fulfilled.match(result)) {
        showSuccessToast("Unfollowed successfully!");
        if (isViewedProfile) {
          await dispatch(fetchProfile(userId));
        }
        return result.payload; // Return updated user data
      }
      throw new Error(result.payload || "Failed to unfollow user");
    } catch (error) {
      showErrorToast(error.message || "Failed to unfollow user");
      return null;
    }
  };

  return {
    profile,
    posts,
    users,
    usersTotal,
    loading,
    searchLoading,
    followLoading,
    error,
    getUserProfile,
    getUserPosts,
    searchUsers: handleSearchUsers,
    followUser: handleFollowUser,
    unfollowUser: handleUnfollowUser,
    clearError: () => dispatch(clearError()),
    clearUsers: () => dispatch(clearUsers()),
  };
};

export default useProfile;
