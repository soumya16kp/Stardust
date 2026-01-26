import axios from 'axios';

const API_URL = 'http://localhost:8000/api/social';

const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getCommunities = async () => {
    const response = await axios.get(`${API_URL}/communities/`);
    return response.data;
};

export const getPosts = async (communitySlug = null) => {
    const params = communitySlug ? { community: communitySlug } : {};
    const response = await axios.get(`${API_URL}/posts/`, { params });
    return response.data;
};

export const createPost = async (postData) => {
    const response = await axios.post(`${API_URL}/posts/`, postData, {
        headers: {
            ...getAuthHeaders(),
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

export const likePost = async (postId) => {
    const response = await axios.post(`${API_URL}/posts/${postId}/like/`, {}, {
        headers: getAuthHeaders()
    });
    return response.data;
};

export const createComment = async (commentData) => {
    const response = await axios.post(`${API_URL}/comments/`, commentData, {
        headers: getAuthHeaders()
    });
    return response.data;
};
