import api from './api';

const API_URL = '/social'; // api instance has baseURL /api

// No need for getAuthHeaders, api interceptor handles it

// Active Users & Profiles
export const getActiveUsers = async (search = '') => {
    const response = await api.get('/auth/users/', {
        params: { search }
    });
    return response.data;
};

export const getUserProfile = async (username) => {
    const response = await api.get(`/auth/users/by_username/${username}/`);
    return response.data;
};

export const updateUserProfile = async (userData) => {
    // Determine content type for file upload
    const headers = {};
    if (userData instanceof FormData) {
        headers['Content-Type'] = 'multipart/form-data';
    }
    const response = await api.patch('/auth/users/me/', userData, { headers });
    return response.data;
};

// Communities
export const getCommunities = async () => {
    const response = await api.get(`${API_URL}/communities/`);
    return response.data;
};

export const createCommunity = async (communityData) => {
    const response = await api.post(`${API_URL}/communities/`, communityData);
    return response.data;
};

export const joinCommunity = async (slug) => {
    const response = await api.post(`${API_URL}/communities/${slug}/join/`);
    return response.data;
};

export const leaveCommunity = async (slug) => {
    const response = await api.post(`${API_URL}/communities/${slug}/leave/`);
    return response.data;
};

export const approveMember = async (slug, userId) => {
    const response = await api.post(`${API_URL}/communities/${slug}/approve_member/`, { user_id: userId });
    return response.data;
};

export const getCommunityMembers = async (slug, status = 'accepted') => {
    const response = await api.get(`${API_URL}/communities/${slug}/members/`, {
        params: { status }
    });
    return response.data;
};

export const banUser = async (slug, userId) => {
    const response = await api.post(`${API_URL}/communities/${slug}/ban_user/`, { user_id: userId });
    return response.data;
};

export const votePoll = async (postId, optionId) => {
    const response = await api.post(`${API_URL}/posts/${postId}/vote/`, { option_id: optionId });
    return response.data;
};

// Posts
export const getPosts = async (communitySlug = null, type = null) => {
    const params = {};
    if (communitySlug) params.community = communitySlug;
    if (type) params.type = type;

    const response = await api.get(`${API_URL}/posts/`, { params });
    return response.data;
};

export const createPost = async (postData) => {
    // Determine content type based on if we are sending a file
    const headers = {};
    if (postData instanceof FormData) {
        headers['Content-Type'] = 'multipart/form-data';
    }

    const response = await api.post(`${API_URL}/posts/`, postData, { headers });
    return response.data;
};

export const likePost = async (postId) => {
    const response = await api.post(`${API_URL}/posts/${postId}/like/`);
    return response.data;
};

export const removePost = async (postId) => {
    const response = await api.delete(`${API_URL}/posts/${postId}/`);
    return response.data;
};

// Comments
export const getComments = async (postId) => {
    const response = await api.get(`${API_URL}/comments/`, {
        params: { post: postId }
    });
    return response.data;
};

export const createComment = async (commentData) => {
    const response = await api.post(`${API_URL}/comments/`, commentData);
    return response.data;
};

// Reports
export const createReport = async (reportData) => {
    const response = await api.post(`${API_URL}/reports/`, reportData);
    return response.data;
};

// Notifications
export const getNotifications = async () => {
    const response = await api.get(`${API_URL}/notifications/`);
    return response.data;
};

export const markNotificationRead = async (id) => {
    const response = await api.post(`${API_URL}/notifications/${id}/mark_read/`);
    return response.data;
};
