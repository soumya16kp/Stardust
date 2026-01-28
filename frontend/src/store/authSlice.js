import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'; // Direct axios for auth calls to avoid circular dependency in api.js if needed, but here we can't use 'api' instance inside interceptors easily if 'api' imports store. 
// Actually api.js imports store, so store cannot import api.js easily if slice uses api.js. 
// To avoid circular dependency, we'll use a separate base axios instance or just pass token in thunk.

const AUTH_URL = 'http://localhost:8000/api/auth';

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${AUTH_URL}/login/`, credentials);
        // Decode token or fetch user profile could be next step, but let's assume we just store token
        localStorage.setItem('token', response.data.access);
        localStorage.setItem('refresh', response.data.refresh);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${AUTH_URL}/register/`, userData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const refreshToken = createAsyncThunk('auth/refreshToken', async (_, { getState, rejectWithValue }) => {
    try {
        const refresh = localStorage.getItem('refresh');
        const response = await axios.post(`${AUTH_URL}/token/refresh/`, { refresh });
        localStorage.setItem('token', response.data.access);
        return response.data;
    } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh');
        return rejectWithValue(error.response.data);
    }
});

export const loadUser = createAsyncThunk('auth/loadUser', async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return rejectWithValue('No token');

        // Use direct axios with header to avoid circular dependency if api.js imports store
        const response = await axios.get(`${AUTH_URL}/users/me/`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to load user');
    }
});

const initialState = {
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    user: null, // Add user state
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem('token');
            localStorage.removeItem('refresh');
            state.token = null;
            state.isAuthenticated = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.access;
                state.isAuthenticated = true;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; // simplified
            })
            .addCase(refreshToken.fulfilled, (state, action) => {
                state.token = action.payload.access;
            })
            .addCase(refreshToken.rejected, (state) => {
                state.isAuthenticated = false;
                state.token = null;
            })
            .addCase(loadUser.fulfilled, (state, action) => {
                state.isAuthenticated = true;
                state.user = action.payload; // Store user data
            })
            .addCase(loadUser.rejected, (state) => {
                // strict logout? maybe not, just invalid user data
                // state.isAuthenticated = false; 
                // state.user = null;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
