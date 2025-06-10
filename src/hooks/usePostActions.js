// hooks/usePostActions.js
import { useState } from "react";
import postService from "../services/postService";
import {
  showErrorToast,
  showSuccessToast,
} from "../components/notifications/toastUtils";

const usePostActions = () => {
  const [likeLoading, setLikeLoading] = useState({});
  const [saveLoading, setSaveLoading] = useState({});

  const handleToggleLike = async (postId, isCurrentlyLiked) => {
    setLikeLoading((prev) => ({ ...prev, [postId]: true }));
    try {
      const response = isCurrentlyLiked
        ? await postService.unlikePost(postId)
        : await postService.likePost(postId);

      showSuccessToast(isCurrentlyLiked ? "Post unliked!" : "Post liked!");

      return response.data.likesCount || response.data.likeCount;
    } catch (error) {
      showErrorToast("Failed to toggle like");
      console.error("Toggle like error:", error);
      throw error; // Re-throw to handle in component
    } finally {
      setLikeLoading((prev) => ({ ...prev, [postId]: false }));
    }
  };

  const handleToggleSave = async (postId, isCurrentlySaved) => {
    setSaveLoading((prev) => ({ ...prev, [postId]: true }));
    try {
      const response = isCurrentlySaved
        ? await postService.unsavePost(postId)
        : await postService.savePost(postId);

      showSuccessToast(isCurrentlySaved ? "Post unsaved!" : "Post saved!");
      return response;
    } catch (error) {
      showErrorToast("Failed to toggle save");
      console.error("Toggle save error:", error);
      throw error; // Re-throw to handle in component
    } finally {
      setSaveLoading((prev) => ({ ...prev, [postId]: false }));
    }
  };

  return {
    handleToggleLike,
    handleToggleSave,
    likeLoading,
    saveLoading,
  };
};

export default usePostActions;
