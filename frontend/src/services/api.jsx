import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" }
});

// Добавляем авторизацию для всех запросов
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// API для авторизации
export const authAPI = {
  login: (credentials) => api.post("/auth/login/", credentials),
  register: (userData) => api.post("/auth/register/", userData),
  registerOwner: (userData) => api.post("/auth/register_owner/", userData),
  getProfile: () => api.get("/auth/profile/")
};

// API для очередей
export const queueAPI = {
  getAllQueues: () => api.get("/queues/"),
  getQueue: (id) => api.get(`/queues/${id}/`),
  joinQueue: (queueId, data) => api.post(`/queues/${queueId}/join/`, data),
  serveNext: (queueId) => api.post(`/queues/${queueId}/serve_next/`),
  getQueueStatus: (queueId) => api.get(`/queues/${queueId}/status/`),
  getParticipantStatus: (queueId, participantId) => api.get(`/queues/${queueId}/participant_status/?participant_id=${participantId}`),
  leaveQueue: (queueId, participantId) => api.post(`/queues/${queueId}/leave/`, { participant_id: participantId })
};

export default api;
