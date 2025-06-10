import { useDispatch, useSelector } from "react-redux";
import {
  toggleLikePost,
  toggleSavePost,
  addComment,
  updateComment,
  deleteComment,
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
  const currentUser = useSelector((state) => state.auth.user); // Assuming auth slice

  const handleLikePost = async (postId, isCurrentlyLiked) => {
    try {
      const result = await dispatch(
        toggleLikePost({ postId, isCurrentlyLiked }),
      );
      console.log("handleLikePost result:", {
        type: result.type,
        payload: result.payload,
      });
      if (toggleLikePost.fulfilled.match(result)) {
        const { isLiked, likeCount } = result.payload;
        console.log("handleLikePost success:", { isLiked, likeCount });
        showSuccessToast(isLiked ? "Post liked!" : "Post unliked!");
        return {
          isLiked,
          likeCount: Number(likeCount) || 0,
        };
      }
      throw new Error(result.payload || "Failed to toggle like");
    } catch (error) {
      console.error("handleLikePost error:", {
        message: error.message,
        stack: error.stack,
      });
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
      console.error("handleAddComment error:", error);
      showErrorToast(error.message || "Failed to add comment");
      return null;
    }
  };

  const handleUpdateComment = async (postId, commentId, content) => {
    try {
      const result = await dispatch(
        updateComment({ postId, commentId, content }),
      );
      if (updateComment.fulfilled.match(result)) {
        showSuccessToast("Comment updated successfully!");
        return result.payload;
      }
      throw new Error(result.payload || "Failed to update comment");
    } catch (error) {
      console.error("handleUpdateComment error:", error);
      showErrorToast(error.message || "Failed to update comment");
      return null;
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      const result = await dispatch(deleteComment({ postId, commentId }));
      if (deleteComment.fulfilled.match(result)) {
        showSuccessToast("Comment deleted successfully!");
        return result.payload;
      }
      throw new Error(result.payload || "Failed to delete comment");
    } catch (error) {
      console.error("handleDeleteComment error:", error);
      showErrorToast(error.message || "Failed to delete comment");
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
    currentUser,
    handleLikePost,
    handleSavePost,
    handleAddComment,
    handleUpdateComment,
    handleDeleteComment,
    handleGetComments,
    clearError: () => dispatch(clearError()),
    clearComments: () => dispatch(clearComments()),
  };
};

export default usePost;
