import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../services/authService";

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const register = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      const response = await authService.registerUser(data);
      return response.data.user; // { username, email }
    } catch (error) {
      const msg = error.response?.data?.message || "Registration failed";
      return rejectWithValue(msg);
    }
  },
);

export const login = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const response = await authService.loginUser(data);
      return response.data.user; // { id, username, email }
    } catch (error) {
      const msg = error.response?.data?.message || "Login failed";
      return rejectWithValue(msg);
    }
  },
);

export const activate = createAsyncThunk(
  "auth/activate",
  async (token, { rejectWithValue }) => {
    try {
      const response = await authService.activateAccount(token);
      return response.data.user; // { id, username, email }
    } catch (error) {
      const msg = error.response?.data?.message || "Activation failed";
      return rejectWithValue(msg);
    }
  },
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (data, { rejectWithValue }) => {
    try {
      await authService.forgotPassword(data);
      return; // No data returned
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to send reset email";
      return rejectWithValue(msg);
    }
  },
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, data }, { rejectWithValue }) => {
    try {
      await authService.resetPassword(token, data);
      return; // No data returned
    } catch (error) {
      const msg = error.response?.data?.message || "Password reset failed";
      return rejectWithValue(msg);
    }
  },
);

export const resendActivation = createAsyncThunk(
  "auth/resendActivation",
  async (data, { rejectWithValue }) => {
    try {
      await authService.resendActivation(data);
      return;
    } catch (error) {
      const msg =
        error.response?.data?.message || "Failed to resend activation email";
      return rejectWithValue(msg);
    }
  },
);

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.refreshToken();
      return response.data.user; // { id, username, email }
    } catch (error) {
      const msg = error.response?.data?.message || "Token refresh failed";
      return rejectWithValue(msg);
    }
  },
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logoutUser();
      return;
    } catch (error) {
      const msg = error.response?.data?.message || "Logout failed";
      return rejectWithValue(msg);
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = false; // User not logged in yet
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(activate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(activate.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(activate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(resendActivation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendActivation.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resendActivation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(refreshToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
