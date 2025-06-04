import { useDispatch, useSelector } from "react-redux";
import {
  fetchProfile,
  fetchUserPosts,
  clearError,
} from "../app/slices/profileSlice";
import { showErrorToast } from "../components/notifications/toastUtils";

const useProfile = () => {
  const dispatch = useDispatch();
  const { profile, posts, loading, error } = useSelector(
    (state) => state.profile,
  );

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

  return {
    profile,
    posts,
    loading,
    error,
    getUserProfile,
    getUserPosts,
    clearError: () => dispatch(clearError()),
  };
};

export default useProfile;
