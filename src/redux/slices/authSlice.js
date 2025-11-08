import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Retrieve token and user from localStorage if available
const storedToken = localStorage.getItem('authToken');
const storedUser = localStorage.getItem('authUser');

const initialState = {
    user: storedUser ? JSON.parse(storedUser) : null,
    token: storedToken || null,
    loading: false,
    error: null,
};

// Async Thunk for registering a user
export const registerUser = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            console.log('Registering user with data:', userData);
            const response = await api.auth.register(userData);
            const { data } = response;
            console.log('Registration response:', data);

            // Ensure user data includes role
            const userWithRole = {
                ...data.user,
                role: data.user.role || userData.role || 'customer' // Default to customer
            };

            localStorage.setItem('authToken', data.token);
            localStorage.setItem('authUser', JSON.stringify(userWithRole));

            return {
                ...data,
                user: userWithRole
            };
        } catch (error) {
            console.error('Registration error:', error);
            return rejectWithValue(error.response?.data?.message || 'Registration failed');
        }
    }
);

// Async Thunk for logging in a user
export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            console.log('Logging in with credentials:', credentials);
            const response = await api.auth.login(credentials);
            const { data } = response;
            console.log('Login response:', data);

            // Ensure user data includes role
            const userWithRole = {
                ...data.user,
                role: data.user.role || 'customer' // Default to customer if no role is provided
            };

            console.log('User with role:', userWithRole);

            localStorage.setItem('authToken', data.token);
            localStorage.setItem('authUser', JSON.stringify(userWithRole));

            return {
                ...data,
                user: userWithRole
            };
        } catch (error) {
            console.error('Login error:', error);
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
);

// Async Thunk for updating user profile
export const updateUserProfile = createAsyncThunk(
    'auth/updateUserProfile',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await api.auth.updateProfile(userData);
            const { data } = response;

            // Extract user data from response
            const userToStore = data.user || data;

            // Store updated user in localStorage
            localStorage.setItem('authUser', JSON.stringify(userToStore));

            return userToStore;
        } catch (error) {
            console.error('Profile update error:', error);
            return rejectWithValue(error.response?.data?.message || 'Profile update failed');
        }
    }
);

// Async Thunk for updating password
export const updatePassword = createAsyncThunk(
    'auth/updatePassword',
    async (passwordData, { rejectWithValue }) => {
        try {
            const response = await api.auth.updatePassword(passwordData);
            const { data } = response;

            // Update token if new one is provided
            if (data.token) {
                localStorage.setItem('authToken', data.token);
            }

            return data;
        } catch (error) {
            console.error('Password update error:', error);
            return rejectWithValue(error.response?.data?.message || 'Password update failed');
        }
    }
);

// Redux Slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout(state) {
            state.user = null;
            state.token = null;
            state.loading = false;
            state.error = null;
            localStorage.removeItem('authToken');
            localStorage.removeItem('authUser');
        },
        clearError(state) {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Register User
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.user = payload.user;
                state.token = payload.token;
            })
            .addCase(registerUser.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })
            // Login User
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.user = payload.user;
                state.token = payload.token;
            })
            .addCase(loginUser.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })
            // Update Profile
            .addCase(updateUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserProfile.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.user = payload;
            })
            .addCase(updateUserProfile.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            })
            // Update Password
            .addCase(updatePassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePassword.fulfilled, (state, { payload }) => {
                state.loading = false;
                if (payload.token) {
                    state.token = payload.token;
                }
            })
            .addCase(updatePassword.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            });
    }
});

// Export actions
export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;

