// services/postService.js
import apiClient from "../utils/apiClient";

const postService = {
  // Like a post
  likePost: async (postId) => {
    try {
      const response = await apiClient.post(`/posts/${postId}/like`);
      console.log("likePost response:", JSON.stringify(response, null, 2)); // Log full response
      if (!response?.data?.likesCount && response.data?.likesCount !== 0) {
        throw new Error(
          `Invalid likesCount in response: ${JSON.stringify(response)}`,
        );
      }
      console.log("likePost returning:", response.data.likesCount); // Log return value
      return response;
    } catch (error) {
      console.error("likePost error:", error.message, error.response?.data);
      throw error;
    }
  },

  unlikePost: async (postId) => {
    try {
      const response = await apiClient.delete(`/posts/${postId}/unlike`);
      console.log("unlikePost response:", JSON.stringify(response, null, 2)); // Log full response
      if (!response?.data?.likesCount && response.data?.likesCount !== 0) {
        throw new Error(
          `Invalid likesCount in response: ${JSON.stringify(response)}`,
        );
      }
      console.log("unlikePost returning:", response.data.likesCount); // Log return value
      return response;
    } catch (error) {
      console.error("unlikePost error:", error.message, error.response?.data);
      throw error;
    }
  },
  // Save a post
  savePost: async (postId) => {
    const response = await apiClient.post(`/posts/${postId}/save`);
    return response;
  },

  // Unsave a post
  unsavePost: async (postId) => {
    const response = await apiClient.delete(`/posts/${postId}/unsave`);
    return response;
  },

  // Add comment
  addComment: async (postId, content) => {
    const response = await apiClient.post(`/posts/${postId}/comments`, {
      content,
    });
    return response;
  },

  // Get post comments
  getPostComments: async (postId, page = 1, limit = 10) => {
    const response = await apiClient.get(
      `/posts/${postId}/comments?page=${page}&limit=${limit}`,
    );
    return response;
  },

  // Get post details
  getPostDetails: async (postId) => {
    const response = await apiClient.get(`/posts/${postId}`);
    return response;
  },

  getFeedPosts: async (page = 1, pageSize = 10) => {
    const response = await apiClient.get(`/posts/feed`, {
      params: { page, pageSize },
    });
    return response;
  },

  getSavedPosts: async (page = 1, pageSize = 10) => {
    const response = await apiClient.get(`/posts/saved`, {
      params: { page, pageSize },
    });
    return response;
  },
};

export default postService;
