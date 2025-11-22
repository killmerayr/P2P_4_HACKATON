import axios from "axios";

const API_BASE_URL = "http://localhost:5174/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
});

// Авторизация (добавить позже)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; 
    }
    return config;
});

export const eventAPI = {
  // Мероприятия
  getAllEvents: () => api.get('/events'),
  getEvent: (id) => api.get(`/events/${id}`),
  createEvent: (data) => api.post('/events', data),
  updateEvent: (id, data) => api.put(`/events/${id}`, data),
  deleteEvent: (id) => api.delete(`/events/${id}`),
  
  // Регистрации
  getMyRegistrations: () => api.get('/registrations'),
  registerForEvent: (eventId) => api.post('/registrations', { eventId }),
  cancelRegistration: (registrationId) => api.delete(`/registrations/${registrationId}`),
};

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
};

export default api;