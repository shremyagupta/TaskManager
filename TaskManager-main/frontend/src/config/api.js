// This will be replaced by the actual backend URL after deployment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default {
  TASKS: {
    BASE: `${API_BASE_URL}/tasks`,
    BY_ID: (id) => `${API_BASE_URL}/tasks/${id}`,
    UPDATE_STATUS: (id) => `${API_BASE_URL}/tasks/${id}/status`,
  },
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    ME: `${API_BASE_URL}/auth/me`,
    VERIFY: `${API_BASE_URL}/auth/verify`,
  },
  USERS: {
    BASE: `${API_BASE_URL}/users`,
  },
};
