import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

export const paymentApi = {
    createOrder: async (token) => {
        return axios.post(`${API_BASE_URL}/payments/create-order`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },
    verifyPayment: async (paymentData, token) => {
        return axios.post(`${API_BASE_URL}/payments/verify-payment`, paymentData, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }
};
