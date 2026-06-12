import axios from 'axios';

const isCapacitor = typeof window !== 'undefined' && window.Capacitor;

const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api` 
  : isCapacitor
    ? 'http://10.36.48.45:5000/api'
    : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach JWT token from localStorage to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('xephora_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  verify: () => api.get('/auth/verify'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  verifyOTP: (email, otp) => api.post('/auth/verify-otp', { email, otp }),
  resetPassword: (email, newPassword, token) =>
    api.post('/auth/reset-password', { email, newPassword, token }),
};

// ─── Game Scores ─────────────────────────────────────────────────────────────
export const gameAPI = {
  submitScore: (data) => api.post('/game/score', data),
  getHistory: () => api.get('/game/history'),
};

// ─── Leaderboard ─────────────────────────────────────────────────────────────
export const leaderboardAPI = {
  getLeaderboard: (subnet = 'GLOBAL') =>
    api.post('/leaderboard', { subnet }),
};

// ─── Multiplayer ─────────────────────────────────────────────────────────────
export const multiplayerAPI = {
  getRooms: () => api.get('/multiplayer/rooms'),
  createRoom: (gameMode) => api.post('/multiplayer/room/create', { gameMode }),
  joinRoom: (roomId) => api.post('/multiplayer/room/join', { roomId }),
};

// ─── Support ─────────────────────────────────────────────────────────────────
export const supportAPI = {
  submitTicket: (data) => api.post('/support/ticket', data),
};

// ─── Admin ───────────────────────────────────────────────────────────────────
export const adminAPI = {
  getUsers: () => api.get('/admin/users'),
  updateRole: (id, role) => api.put(`/admin/user/${id}/role`, { role }),
  deleteUser: (id) => api.delete(`/admin/user/${id}`),
};

// ─── Tournaments ─────────────────────────────────────────────────────────────
export const tournamentsAPI = {
  getTournaments: () => api.get('/tournaments'),
  register: (id) => api.post(`/tournaments/register/${id}`),
};

export default api;
