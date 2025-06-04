import apiClient from "../utils/apiClient";

const profileService = {
  getUserProfile: async (userId) => {
    console.log("Fetching profile for user ID:", userId);
    const response = await apiClient.get(`/users/${userId}`);
    console.log("Profile response:", response.data);
    return response;
  },
  getUserPosts: async (userId, page = 1, pageSize = 10) => {
    console.log("Fetching posts for user ID:", userId, { page, pageSize });
    const response = await apiClient.get(`/users/${userId}/posts`, {
      params: { page, pageSize },
    });
    console.log("Posts response:", response.data);
    return response;
  },
};

export default profileService;
