// hooks/usePost.js
import { useDispatch, useSelector } from "react-redux";
import {
  toggleLikePost,
  toggleSavePost,
  addComment,
  getComments,
  clearError,
  clearComments,
} from "../app/slices/postSlice";
import {
  showErrorToast,
  showSuccessToast,
} from "../components/notifications/toastUtils";

const usePost = () => {
  const dispatch = useDispatch();
  const {
    posts,
    comments,
    loading,
    commentsLoading,
    likeLoading,
    saveLoading,
    commentLoading,
    error,
  } = useSelector((state) => state.post);

  const handleLikePost = async (postId, isCurrentlyLiked) => {
    try {
      const result = await dispatch(
        toggleLikePost({ postId, isCurrentlyLiked }),
      );
      if (toggleLikePost.fulfilled.match(result)) {
        const { isLiked } = result.payload;
        showSuccessToast(isLiked ? "Post liked!" : "Post unliked!");
        return result.payload;
      }
      throw new Error(result.payload || "Failed to toggle like");
    } catch (error) {
      showErrorToast(error.message || "Failed to update like status");
      return null;
    }
  };

  const handleSavePost = async (postId, isCurrentlySaved) => {
    try {
      const result = await dispatch(
        toggleSavePost({ postId, isCurrentlySaved }),
      );
      if (toggleSavePost.fulfilled.match(result)) {
        const { isSaved } = result.payload;
        showSuccessToast(isSaved ? "Post saved!" : "Post unsaved!");
        return result.payload;
      }
      throw new Error(result.payload || "Failed to toggle save");
    } catch (error) {
      showErrorToast(error.message || "Failed to update save status");
      return null;
    }
  };

  const handleAddComment = async (postId, content) => {
    try {
      const result = await dispatch(addComment({ postId, content }));
      if (addComment.fulfilled.match(result)) {
        showSuccessToast("Comment added successfully!");
        return result.payload;
      }
      throw new Error(result.payload || "Failed to add comment");
    } catch (error) {
      showErrorToast(error.message || "Failed to add comment");
      return null;
    }
  };

  const handleGetComments = async (postId, page = 1, limit = 10) => {
    try {
      const result = await dispatch(getComments({ postId, page, limit }));
      if (getComments.fulfilled.match(result)) {
        return result.payload;
      }
      throw new Error(result.payload || "Failed to fetch comments");
    } catch (error) {
      showErrorToast(error.message || "Failed to fetch comments");
      return null;
    }
  };

  return {
    posts,
    comments,
    loading,
    commentsLoading,
    likeLoading,
    saveLoading,
    commentLoading,
    error,
    handleLikePost,
    handleSavePost,
    handleAddComment,
    handleGetComments,
    clearError: () => dispatch(clearError()),
    clearComments: () => dispatch(clearComments()),
  };
};

export default usePost;
