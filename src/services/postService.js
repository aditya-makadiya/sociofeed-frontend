// services/postService.js
import apiClient from "../utils/apiClient";

const postService = {
  // Like a post
  likePost: async (postId) => {
    const response = await apiClient.post(`/posts/${postId}/like`);
    return response;
  },

  // Unlike a post
  unlikePost: async (postId) => {
    const response = await apiClient.delete(`/posts/${postId}/unlike`);
    return response;
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
};

export default postService;
