import axiosInstance from '../utils/axiosInstance';

export const interviewApi = {
    start: (data) => axiosInstance.post('/interviews/start', data),
    getQuestion: (id) => axiosInstance.get(`/interviews/${id}/question`),
    submitAnswer: (id, data) => axiosInstance.post(`/interviews/${id}/answer`, data),
    complete: (id) => axiosInstance.post(`/interviews/${id}/complete`),
    abandon: (id) => axiosInstance.post(`/interviews/${id}/abandon`),
    getHistory: (params) => axiosInstance.get('/interviews/history', { params }),
};
