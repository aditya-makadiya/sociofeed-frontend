import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api/endpoints';
import { toast } from 'react-toastify';

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Register user
export const register = createAsyncThunk(
  'auth/register',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.register(data);
      toast.success('Registration successful. Check your email to activate.');
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed';
      toast.error(msg);
      return rejectWithValue({ message: msg });
    }
  }
);

// Login user
export const login = createAsyncThunk(
  'auth/login',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.login(data);
      toast.success('Login successful!');
      return response.data.user;
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed';
      toast.error(msg);
      return rejectWithValue({ message: msg });
    }
  }
);

// Activate account
export const activate = createAsyncThunk(
  'auth/activate',
  async (token, { rejectWithValue }) => {
    try {
      const response = await api.activate(token);
      toast.success('Account activated successfully.');
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Activation failed';
      toast.error(msg);
      return rejectWithValue({ message: msg });
    }
  }
);

// Forgot password
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (data, { rejectWithValue }) => {
    try {
      await api.forgotPassword(data);
      toast.success('Password reset email sent.');
      return;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to send reset email';
      toast.error(msg);
      return rejectWithValue({ message: msg });
    }
  }
);

// Reset password
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, data }, { rejectWithValue }) => {
    try {
      await api.resetPassword(token, data);
      toast.success('Password reset successful.');
      return;
    } catch (error) {
      const msg = error.response?.data?.message || 'Password reset failed';
      toast.error(msg);
      return rejectWithValue({ message: msg });
    }
  }
);

// Resend activation
export const resendActivation = createAsyncThunk(
  'auth/resendActivation',
  async (data, { rejectWithValue }) => {
    try {
      await api.resendActivation(data);
      toast.success('Activation email resent.');
      return;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to resend activation email';
      toast.error(msg);
      return rejectWithValue({ message: msg });
    }
  }
);

// Refresh token
export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.refreshToken();
      return response.data.user;
    } catch (error) {
      const msg = error.response?.data?.message || 'Token refresh failed';
      toast.error(msg);
      return rejectWithValue({ message: msg });
    }
  }
);

// Logout
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await api.logout();
      toast.success('Logged out successfully.');
      return;
    } catch (error) {
      const msg = error.response?.data?.message || 'Logout failed';
      toast.error(msg);
      return rejectWithValue({ message: msg });
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      // Login
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
        state.error = action.payload?.message;
      })
      // Activate
      .addCase(activate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(activate.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(activate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      // Resend Activation
      .addCase(resendActivation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendActivation.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resendActivation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      // Refresh Token
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
        state.error = action.payload?.message;
        state.user = null;
        state.isAuthenticated = false;
      })
      // Logout
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
        state.error = action.payload?.message;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
