
import apiClient from "../utils/apiClient";

const profileService = {
  getUserProfile: async (userId) => {
    // console.log("Fetching profile for user ID:", userId);
    const response = await apiClient.get(`/users/${userId}`);
    // console.log("Profile response:", response.data);
    return response;
  },

  getUserPosts: async (userId, page = 1, pageSize = 10) => {
    // console.log("Fetching posts for user ID:", userId, { page, pageSize });
    const response = await apiClient.get(`/users/${userId}/posts`, {
      params: { page, pageSize },
    });
    // console.log("Posts response:", response.data);
    return response;
  },

  getUserFollowers: async (userId, page = 1, pageSize = 10) => {
    // console.log("Fetching followers for user ID:", userId, { page, pageSize });
    const response = await apiClient.get(`/users/${userId}/followers`, {
      params: { page, pageSize },
    });
    // console.log("Followers response:", response.data);
    return response;
  },

  getUserFollowing: async (userId, page = 1, pageSize = 10) => {
    // console.log("Fetching following for user ID:", userId, { page, pageSize });
    const response = await apiClient.get(`/users/${userId}/following`, {
      params: { page, pageSize },
    });
    // console.log("Following response:", response.data);
    return response;
  },

  followUser: async (userId) => {
    // console.log("Following user ID:", userId);
    const response = await apiClient.post(`/users/${userId}/follow`);
    // console.log("Follow response:", response);
    return response;
  },

  unfollowUser: async (userId) => {
    // console.log("Unfollowing user ID:", userId);
    const response = await apiClient.delete(`/users/${userId}/follow`);
    // console.log("Unfollow response:", response);
    return response;
  },

  updateProfile: async (userId, data) => {
    // console.log("Updating profile for user ID:", userId, data);
    const response = await apiClient.patch(`/users/${userId}`, data);
    // console.log("Update profile response:", response);
    return response;
  },

  updateAvatar: async (userId, file) => {
    // console.log("Updating avatar for user ID:", userId);
    const formData = new FormData();
    formData.append("avatar", file);
    const response = await apiClient.patch(
      `/users/${userId}/avatar`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    // console.log("Update avatar response:", response);
    return response;
  },

  resetAvatar: async (userId) => {
    // console.log("Resetting avatar for user ID:", userId);
    const response = await apiClient.delete(`/users/${userId}/avatar`);
    // console.log("Reset avatar response:", response);
    return response;
  },

  searchUsers: async (query = "", page = 1, pageSize = 10) => {
    // console.log("Searching users with query:", query, { page, pageSize });
    const response = await apiClient.get("/users", {
      params: { search: query, page, pageSize },
    });
    // console.log("Search users response:", response.data);
    return response;
  },
};

export default profileService;
