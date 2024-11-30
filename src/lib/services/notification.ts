import axios from 'axios';

const API_URL = 'https://finguard-backend.onrender.com/api/v1';

export const notificationsService = {
  getNotifications: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/notifications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.alerts;
  },
};