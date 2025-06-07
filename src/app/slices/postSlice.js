// app/slices/postSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import postService from "../../services/postService";

const initialState = {
  posts: [],
  comments: [],
  loading: false,
  commentsLoading: false,
  likeLoading: {},
  saveLoading: {},
  commentLoading: false,
  error: null,
  hasMore: true, // Track if there are more posts to load
  currentPage: 1, // Track the current page
};

export const fetchFeedPosts = createAsyncThunk(
  "post/fetchFeedPosts",
  async (page, { rejectWithValue }) => {
    try {
      const response = await postService.getFeedPosts(page);
      return {
        posts: response.data.posts,
        total: response.data.total,
        page: response.data.page,
      };
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to fetch posts";
      return rejectWithValue(msg);
    }
  },
);

// Toggle like post (handles both like and unlike)
export const toggleLikePost = createAsyncThunk(
  "post/toggleLike",
  async ({ postId, isCurrentlyLiked }, { rejectWithValue }) => {
    try {
      let response;
      if (isCurrentlyLiked) {
        // If currently liked, unlike it
        response = await postService.unlikePost(postId);
      } else {
        // If not liked, like it
        response = await postService.likePost(postId);
      }

      // ✅ CORRECT - Use server response directly
      return {
        postId,
        isLiked: !isCurrentlyLiked,
        likeCount: response.data.likesCount, // Use actual count from server
      };
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to toggle like";
      return rejectWithValue(msg);
    }
  },
);

export const createPost = createAsyncThunk(
  "post/createPost",
  async ({ content }, { rejectWithValue }) => {
    try {
      const response = await postService.createPost({ content });
      return response.data.post; // Adjust based on your API response
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to create post";
      return rejectWithValue(msg);
    }
  },
);

// Toggle save post (handles both save and unsave)
export const toggleSavePost = createAsyncThunk(
  "post/toggleSave",
  async ({ postId, isCurrentlySaved }, { rejectWithValue }) => {
    try {
      let response;
      if (isCurrentlySaved) {
        response = await postService.unsavePost(postId);
      } else {
        response = await postService.savePost(postId);
        console.log(response);
      }

      return {
        postId,
        isSaved: !isCurrentlySaved,
      };
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to toggle save";
      return rejectWithValue(msg);
    }
  },
);

// Add comment
export const addComment = createAsyncThunk(
  "post/addComment",
  async ({ postId, content }, { rejectWithValue }) => {
    try {
      const response = await postService.addComment(postId, content);
      return {
        postId,
        comment: response.data.comment,
        commentCount: response.data.commentCount,
      };
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to add comment";
      return rejectWithValue(msg);
    }
  },
);

// Get comments
export const getComments = createAsyncThunk(
  "post/getComments",
  async ({ postId, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await postService.getPostComments(postId, page, limit);
      return {
        postId,
        comments: response.data.comments,
        total: response.data.total,
      };
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to fetch comments";
      return rejectWithValue(msg);
    }
  },
);

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearComments: (state) => {
      state.comments = [];
    },
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    updatePostInList: (state, action) => {
      const { postId, updates } = action.payload;
      const postIndex = state.posts.findIndex((post) => post.id === postId);
      if (postIndex !== -1) {
        state.posts[postIndex] = { ...state.posts[postIndex], ...updates };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Toggle Like
      .addCase(toggleLikePost.pending, (state, action) => {
        state.likeLoading[action.meta.arg.postId] = true;
        state.error = null;
      })
      .addCase(toggleLikePost.fulfilled, (state, action) => {
        const { postId, isLiked, likeCount } = action.payload;
        state.likeLoading[postId] = false;

        // Update post in posts array if it exists
        const postIndex = state.posts.findIndex((post) => post.id === postId);
        if (postIndex !== -1) {
          state.posts[postIndex].isLiked = isLiked;
          state.posts[postIndex].likeCount = likeCount;
        }
      })
      .addCase(toggleLikePost.rejected, (state, action) => {
        state.likeLoading[action.meta.arg.postId] = false;
        state.error = action.payload;
      })

      // Toggle Save
      .addCase(toggleSavePost.pending, (state, action) => {
        state.saveLoading[action.meta.arg.postId] = true;
        state.error = null;
      })
      .addCase(toggleSavePost.fulfilled, (state, action) => {
        const { postId, isSaved } = action.payload;
        state.saveLoading[postId] = false;

        // Update post in posts array if it exists
        const postIndex = state.posts.findIndex((post) => post.id === postId);
        if (postIndex !== -1) {
          state.posts[postIndex].isSaved = isSaved;
        }
      })
      .addCase(toggleSavePost.rejected, (state, action) => {
        state.saveLoading[action.meta.arg.postId] = false;
        state.error = action.payload;
      })

      // Add Comment
      .addCase(addComment.pending, (state) => {
        state.commentLoading = true;
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const { postId, comment, commentCount } = action.payload;
        state.commentLoading = false;

        // Update post comment count
        const postIndex = state.posts.findIndex((post) => post.id === postId);
        if (postIndex !== -1) {
          state.posts[postIndex].commentCount = commentCount;
        }

        // Add comment to comments array
        state.comments.unshift(comment);
      })
      .addCase(addComment.rejected, (state, action) => {
        state.commentLoading = false;
        state.error = action.payload;
      })

      // Get Comments
      .addCase(getComments.pending, (state) => {
        state.commentsLoading = true;
        state.error = null;
      })
      .addCase(getComments.fulfilled, (state, action) => {
        state.commentsLoading = false;
        state.comments = action.payload.comments;
      })
      .addCase(getComments.rejected, (state, action) => {
        state.commentsLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchFeedPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeedPosts.fulfilled, (state, action) => {
        state.loading = false;
        // Filter out duplicates before appending
        const newPosts = action.payload.posts.filter(
          (newPost) => !state.posts.some((post) => post.id === newPost.id),
        );
        state.posts.push(...newPosts); // Append new posts
        state.hasMore = newPosts.length > 0; // Check if there are more posts
        state.currentPage += 1; // Increment the current page
      })
      .addCase(fetchFeedPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.unshift(action.payload); // Add the new post to the beginning of the list
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearComments, setPosts, updatePostInList } =
  postSlice.actions;
export default postSlice.reducer;
