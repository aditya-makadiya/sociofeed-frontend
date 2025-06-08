import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import profileService from "../../services/profileService";

const initialState = {
  profile: null,
  posts: [],
  users: [],
  usersTotal: 0,
  loading: false,
  error: null,
  followLoading: false,
  editLoading: false,
  searchLoading: false,
};

export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await profileService.getUserProfile(userId);
      console.log("fetchProfile response:", response.data.user);
      return response.data.user;
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to fetch profile";
      console.error("fetchProfile error:", error.response?.data || error);
      return rejectWithValue(msg);
    }
  },
);

export const fetchUserPosts = createAsyncThunk(
  "profile/fetchUserPosts",
  async ({ userId, page = 1, pageSize = 10 }, { rejectWithValue }) => {
    try {
      const response = await profileService.getUserPosts(
        userId,
        page,
        pageSize,
      );
      console.log("fetchUserPosts response:", response.data.posts);
      return response.data.posts;
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to fetch posts";
      console.error("fetchUserPosts error:", error.response?.data || error);
      return rejectWithValue(msg);
    }
  },
);

export const searchUsers = createAsyncThunk(
  "profile/searchUsers",
  async ({ query, page = 1, pageSize = 10 }, { rejectWithValue }) => {
    try {
      const response = await profileService.searchUsers(query, page, pageSize);
      console.log("searchUsers response:", response.data);
      return {
        users: response.data.users,
        total: response.data.total,
        page: response.data.page,
        pageSize: response.data.pageSize,
      };
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to search users";
      console.error("searchUsers error:", error.response?.data || error);
      return rejectWithValue(msg);
    }
  },
);

export const followUser = createAsyncThunk(
  "profile/followUser",
  async ({ userId, isViewedProfile }, { rejectWithValue }) => {
    try {
      const response = await profileService.followUser(userId);
      return { userId, isViewedProfile, data: response.data };
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to follow user";
      console.error("followUser error:", error.response?.data || error);
      return rejectWithValue(msg);
    }
  },
);

export const unfollowUser = createAsyncThunk(
  "profile/unfollowUser",
  async ({ userId, isViewedProfile }, { rejectWithValue }) => {
    try {
      const response = await profileService.unfollowUser(userId);
      return { userId, isViewedProfile, data: response.data };
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to unfollow user";
      console.error("unfollowUser error:", error.response?.data || error);
      return rejectWithValue(msg);
    }
  },
);

export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async ({ userId, data }, { rejectWithValue }) => {
    try {
      const response = await profileService.updateProfile(userId, data);
      return response.data.user;
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to update profile";
      console.error("updateProfile error:", error.response?.data || error);
      return rejectWithValue(msg);
    }
  },
);

export const updateAvatar = createAsyncThunk(
  "profile/updateAvatar",
  async ({ userId, file }, { rejectWithValue }) => {
    try {
      const response = await profileService.updateAvatar(userId, file);
      return response.data.user;
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to update avatar";
      console.error("updateAvatar error:", error.response?.data || error);
      return rejectWithValue(msg);
    }
  },
);

export const resetAvatar = createAsyncThunk(
  "profile/resetAvatar",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await profileService.resetAvatar(userId);
      return response.data.user;
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to reset avatar";
      console.error("resetAvatar error:", error.response?.data || error);
      return rejectWithValue(msg);
    }
  },
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearUsers: (state) => {
      state.users = [];
      state.usersTotal = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(followUser.pending, (state) => {
        state.followLoading = true;
        state.error = null;
      })
      .addCase(followUser.fulfilled, (state, action) => {
        state.followLoading = false;
        if (state.profile && action.payload.isViewedProfile) {
          state.profile.isFollowing = true;
          state.profile.followerCount = (state.profile.followerCount || 0) + 1;
        }
        // Update users array
        state.users = state.users.map((u) =>
          u.id === action.payload.userId ? { ...u, isFollowing: true } : u,
        );
      })
      .addCase(followUser.rejected, (state, action) => {
        state.followLoading = false;
        state.error = action.payload;
      })
      .addCase(unfollowUser.pending, (state) => {
        state.followLoading = true;
        state.error = null;
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        state.followLoading = false;
        if (state.profile && action.payload.isViewedProfile) {
          state.profile.isFollowing = false;
          state.profile.followerCount = Math.max(
            (state.profile.followerCount || 0) - 1,
            0,
          );
        }
        // Update users array
        state.users = state.users.map((u) =>
          u.id === action.payload.userId ? { ...u, isFollowing: false } : u,
        );
      })
      .addCase(unfollowUser.rejected, (state, action) => {
        state.followLoading = false;
        state.error = action.payload;
      })
      .addCase(updateProfile.pending, (state) => {
        state.editLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.editLoading = false;
        if (state.profile) {
          state.profile.bio = action.payload.bio;
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.editLoading = false;
        state.error = action.payload;
      })
      .addCase(updateAvatar.pending, (state) => {
        state.editLoading = true;
        state.error = null;
      })
      .addCase(updateAvatar.fulfilled, (state, action) => {
        state.editLoading = false;
        if (state.profile) {
          state.profile.avatar = action.payload.avatar;
        }
      })
      .addCase(updateAvatar.rejected, (state, action) => {
        state.editLoading = false;
        state.error = action.payload;
      })
      .addCase(resetAvatar.pending, (state) => {
        state.editLoading = true;
        state.error = null;
      })
      .addCase(resetAvatar.fulfilled, (state, action) => {
        state.editLoading = false;
        if (state.profile) {
          state.profile.avatar = action.payload.avatar;
        }
      })
      .addCase(resetAvatar.rejected, (state, action) => {
        state.editLoading = false;
        state.error = action.payload;
      })
      .addCase(searchUsers.pending, (state) => {
        state.searchLoading = true;
        state.error = null;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.users = action.payload.users;
        state.usersTotal = action.payload.total;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearUsers } = profileSlice.actions;
export default profileSlice.reducer;
