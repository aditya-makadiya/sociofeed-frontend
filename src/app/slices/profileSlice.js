import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import profileService from "../../services/profileService";

const initialState = {
  profile: null,
  posts: [],
  loading: false,
  error: null,
};

export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await profileService.getUserProfile(userId);
      console.log("fetchProfile response:", response.data.user);
      return response.data.user; // Interceptor returns { status: "success", data: { user: {...} } }
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
      return response.data.posts; // Interceptor returns { status: "success", data: { posts: [...], total, page, pageSize } }
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to fetch posts";
      console.error("fetchUserPosts error:", error.response?.data || error);
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
      });
  },
});

export const { clearError } = profileSlice.actions;
export default profileSlice.reducer;
