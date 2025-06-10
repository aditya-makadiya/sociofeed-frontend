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
  hasMore: true,
  currentPage: 1,
  total: 0,
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

export const fetchSavedPosts = createAsyncThunk(
  "post/fetchSavedPosts",
  async (page, { rejectWithValue }) => {
    try {
      const response = await postService.getSavedPosts(page);
      return {
        posts: response.data.posts,
        total: response.data.total,
        page: response.data.page,
      };
    } catch (error) {
      const msg =
        error.response?.data?.message || "Failed to fetch saved posts";
      return rejectWithValue(msg);
    }
  },
);

export const toggleLikePost = createAsyncThunk(
  "post/toggleLike",
  async ({ postId, isCurrentlyLiked }, { rejectWithValue }) => {
    try {
      let response;
      if (isCurrentlyLiked) {
        response = await postService.unlikePost(postId);
      } else {
        response = await postService.likePost(postId);
      }
      console.log("toggleLikePost response:", response);
      if (!response.data || typeof response.data.likesCount !== "number") {
        throw new Error("Invalid response format from server");
      }
      return {
        postId,
        isLiked: !isCurrentlyLiked,
        likeCount: Number(response.data.likesCount) || 0,
      };
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Failed to toggle like";
      console.error("toggleLikePost error:", {
        message: msg,
        error: error.response?.data || error,
      });
      return rejectWithValue(msg);
    }
  },
);

export const createPost = createAsyncThunk(
  "post/createPost",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await postService.createPost(formData);
      return response.data.post;
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to create post";
      return rejectWithValue(msg);
    }
  },
);

export const toggleSavePost = createAsyncThunk(
  "post/toggleSavePost",
  async ({ postId, isCurrentlySaved }, { rejectWithValue }) => {
    try {
      let response;
      if (isCurrentlySaved) {
        response = await postService.unsavePost(postId);
      } else {
        response = await postService.savePost(postId);
      }
      return {
        response,
        postId,
        isSaved: !isCurrentlySaved,
      };
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to toggle save";
      return rejectWithValue(msg);
    }
  },
);

export const addComment = createAsyncThunk(
  "post/addComment",
  async ({ postId, content }, { rejectWithValue }) => {
    try {
      const response = await postService.addComment(postId, content);
      console.log(
        "addComment thunk response:",
        JSON.stringify(response, null, 2),
      );
      return {
        postId,
        comment: response.data.comment,
        commentCount: null,
      };
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to add comment";
      console.error("addComment error:", msg, error);
      return rejectWithValue(msg);
    }
  },
);

export const updateComment = createAsyncThunk(
  "post/updateComment",
  async ({ postId, commentId, content }, { rejectWithValue }) => {
    try {
      const response = await postService.updateComment(
        postId,
        commentId,
        content,
      );
      return {
        commentId,
        comment: response.data.comment,
      };
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to update comment";
      console.error("updateComment error:", msg, error);
      return rejectWithValue(msg);
    }
  },
);

export const deleteComment = createAsyncThunk(
  "post/deleteComment",
  async ({ postId, commentId }, { rejectWithValue }) => {
    try {
      await postService.deleteComment(postId, commentId);
      return { postId, commentId };
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to delete comment";
      console.error("deleteComment error:", msg, error);
      return rejectWithValue(msg);
    }
  },
);

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
    resetPosts: (state) => {
      state.posts = [];
      state.currentPage = 1;
      state.hasMore = true;
      state.total = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeedPosts.fulfilled, (state, action) => {
        state.loading = false;
        const newPosts = action.payload.posts.filter(
          (newPost) => !state.posts.some((post) => post.id === newPost.id),
        );
        state.posts = [...state.posts, ...newPosts];
        state.hasMore =
          newPosts.length > 0 && state.posts.length < action.payload.total;
        state.currentPage = action.payload.page;
        state.total = action.payload.total;
      })
      .addCase(fetchFeedPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSavedPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSavedPosts.fulfilled, (state, action) => {
        state.loading = false;
        const newPosts = action.payload.posts.filter(
          (newPost) => !state.posts.some((post) => post.id === newPost.id),
        );
        state.posts = [...state.posts, ...newPosts];
        state.hasMore =
          newPosts.length > 0 && state.posts.length < action.payload.total;
        state.currentPage = action.payload.page;
        state.total = action.payload.total;
      })
      .addCase(fetchSavedPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(toggleLikePost.pending, (state, action) => {
        state.likeLoading[action.meta.arg.postId] = true;
        state.error = null;
      })
      .addCase(toggleLikePost.fulfilled, (state, action) => {
        const { postId, isLiked, likeCount } = action.payload;
        state.likeLoading[postId] = false;
        const postIndex = state.posts.findIndex((post) => post.id === postId);
        if (postIndex !== -1) {
          state.posts[postIndex].isLiked = isLiked;
          state.posts[postIndex].likeCount = Number(likeCount) || 0;
          console.log("Updated post:", state.posts[postIndex]);
        }
      })
      .addCase(toggleLikePost.rejected, (state, action) => {
        state.likeLoading[action.meta.arg.postId] = false;
        state.error = action.payload;
      })
      .addCase(toggleSavePost.pending, (state, action) => {
        state.saveLoading[action.meta.arg.postId] = true;
        state.error = null;
      })
      .addCase(toggleSavePost.fulfilled, (state, action) => {
        const { postId, isSaved } = action.payload;
        state.saveLoading[postId] = false;
        const postIndex = state.posts.findIndex((post) => post.id === postId);
        if (postIndex !== -1) {
          state.posts[postIndex].isSaved = isSaved;
        }
      })
      .addCase(toggleSavePost.rejected, (state, action) => {
        state.saveLoading[action.meta.arg.postId] = false;
        state.error = action.payload;
      })
      .addCase(addComment.pending, (state) => {
        state.commentLoading = true;
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const { postId, comment } = action.payload;
        state.commentLoading = false;
        const postIndex = state.posts.findIndex((post) => post.id === postId);
        if (postIndex !== -1) {
          state.posts[postIndex].commentCount =
            (state.posts[postIndex].commentCount || 0) + 1;
        }
        state.comments.unshift(comment);
      })
      .addCase(addComment.rejected, (state, action) => {
        state.commentLoading = false;
        state.error = action.payload;
      })
      .addCase(updateComment.pending, (state) => {
        state.commentLoading = true;
        state.error = null;
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        const { commentId, comment } = action.payload;
        state.commentLoading = false;
        const commentIndex = state.comments.findIndex(
          (c) => c.id === commentId,
        );
        if (commentIndex !== -1) {
          state.comments[commentIndex] = comment;
        }
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.commentLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteComment.pending, (state) => {
        state.commentLoading = true;
        state.error = null;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        const { postId, commentId } = action.payload;
        state.commentLoading = false;
        state.comments = state.comments.filter((c) => c.id !== commentId);
        const postIndex = state.posts.findIndex((post) => post.id === postId);
        if (postIndex !== -1) {
          state.posts[postIndex].commentCount =
            (state.posts[postIndex].commentCount || 1) - 1;
        }
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.commentLoading = false;
        state.error = action.payload;
      })
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
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  clearComments,
  setPosts,
  updatePostInList,
  resetPosts,
} = postSlice.actions;
export default postSlice.reducer;
