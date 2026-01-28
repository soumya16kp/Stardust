import api from './api';

export const getPrograms = async (type = null) => {
    try {
        const params = type ? { type } : {};
        const response = await api.get('programs/', { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getProgramDetail = async (slug) => {
    try {
        const response = await api.get(`programs/${slug}/`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const enrollProgram = async (id) => {
    try {
        const response = await api.post(`programs/${id}/enroll/`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getMyEnrollments = async () => {
    try {
        const response = await api.get('my-enrollments/');
        return response.data;
    } catch (error) {
        throw error;
    }
};
