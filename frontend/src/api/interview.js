import axiosInstance from '../utils/axiosInstance';

export const interviewApi = {
    start: (data) => axiosInstance.post('/interviews/start', data),
    getSetupConfig: () => axiosInstance.get('/interviews/setup'),
    getInterviewSession: (id) => axiosInstance.get(`/interviews/${id}`),
    getQuestion: (id) => axiosInstance.get(`/interviews/${id}/question`),
    submitAnswer: (id, data) => axiosInstance.post(`/interviews/${id}/answer`, data),
    complete: (id) => axiosInstance.post(`/interviews/${id}/complete`),
    abandon: (id) => axiosInstance.post(`/interviews/${id}/abandon`),
    reattempt: (id) => axiosInstance.post(`/interviews/${id}/reattempt`),
    getHistory: (params) => axiosInstance.get('/interviews/history', { params }),
    transcribe: (audioBlob) => {
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');
        return axiosInstance.post('/transcribe', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }
};
