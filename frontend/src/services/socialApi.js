import axios from 'axios';

const API_URL = 'http://localhost:8000/api/social';

const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Communities
export const getCommunities = async () => {
    const response = await axios.get(`${API_URL}/communities/`);
    return response.data;
};

export const createCommunity = async (communityData) => {
    const response = await axios.post(`${API_URL}/communities/`, communityData, {
        headers: getAuthHeaders()
    });
    return response.data;
};

export const joinCommunity = async (slug) => {
    const response = await axios.post(`${API_URL}/communities/${slug}/join/`, {}, {
        headers: getAuthHeaders()
    });
    return response.data;
};

export const leaveCommunity = async (slug) => {
    const response = await axios.post(`${API_URL}/communities/${slug}/leave/`, {}, {
        headers: getAuthHeaders()
    });
    return response.data;
};

export const approveMember = async (slug, userId) => {
    const response = await axios.post(`${API_URL}/communities/${slug}/approve_member/`, { user_id: userId }, {
        headers: getAuthHeaders()
    });
    return response.data;
};

export const getCommunityMembers = async (slug, status = 'accepted') => {
    const response = await axios.get(`${API_URL}/communities/${slug}/members/`, {
        params: { status },
        headers: getAuthHeaders()
    });
    return response.data;
};

export const banUser = async (slug, userId) => {
    const response = await axios.post(`${API_URL}/communities/${slug}/ban_user/`, { user_id: userId }, {
        headers: getAuthHeaders()
    });
    return response.data;
};

// Posts
export const getPosts = async (communitySlug = null, type = null) => {
    const params = {};
    if (communitySlug) params.community = communitySlug;
    if (type) params.type = type;

    const response = await axios.get(`${API_URL}/posts/`, { params });
    return response.data;
};

export const createPost = async (postData) => {
    // Determine content type based on if we are sending a file
    const headers = { ...getAuthHeaders() };
    if (postData instanceof FormData) {
        headers['Content-Type'] = 'multipart/form-data';
    }

    const response = await axios.post(`${API_URL}/posts/`, postData, { headers });
    return response.data;
};

export const likePost = async (postId) => {
    const response = await axios.post(`${API_URL}/posts/${postId}/like/`, {}, {
        headers: getAuthHeaders()
    });
    return response.data;
};

// Comments
export const createComment = async (commentData) => {
    const response = await axios.post(`${API_URL}/comments/`, commentData, {
        headers: getAuthHeaders()
    });
    return response.data;
};

// Reports
export const createReport = async (reportData) => {
    const response = await axios.post(`${API_URL}/reports/`, reportData, {
        headers: getAuthHeaders()
    });
    return response.data;
};

// Notifications
export const getNotifications = async () => {
    const response = await axios.get(`${API_URL}/notifications/`, {
        headers: getAuthHeaders()
    });
    return response.data;
};

export const markNotificationRead = async (id) => {
    const response = await axios.post(`${API_URL}/notifications/${id}/mark_read/`, {}, {
        headers: getAuthHeaders()
    });
    return response.data;
};
