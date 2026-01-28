import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const getEvents = async (params = {}) => {
    try {
        const response = await axios.get(`${API_URL}/events/`, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching events:", error);
        throw error;
    }
};

export const getEvent = async (slug) => {
    try {
        const response = await axios.get(`${API_URL}/events/${slug}/`);
        return response.data;
    } catch (error) {
        console.error("Error fetching event:", error);
        throw error;
    }
};

export const getEventComments = async (slug) => {
    try {
        const response = await axios.get(`${API_URL}/events/${slug}/comments/`);
        return response.data;
    } catch (error) {
        console.error("Error fetching comments:", error);
        throw error;
    }
};

export const addEventComment = async (slug, content) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/events/${slug}/add_comment/`, { content }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error("Error adding comment:", error);
        throw error;
    }
};

export const attendEvent = async (slug) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/events/${slug}/attend/`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error("Error attending event:", error);
        throw error;
    }
};

export const getPrograms = async () => {
    try {
        const response = await axios.get(`${API_URL}/programs/`);
        return response.data;
    } catch (error) {
        console.error("Error fetching programs:", error);
        throw error;
    }
};
