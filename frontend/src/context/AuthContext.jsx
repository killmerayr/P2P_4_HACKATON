import { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api'; // можно оставить на будущее

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        setUser(null);
      }
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Временный тестовый login
  const login = async (credentials) => {
    let mockUser;
    if (credentials.email === 'admin@eventhub.ru') {
      mockUser = { id: 1, name: 'Админ', email: credentials.email, role: 'admin' };
    } else {
      mockUser = { id: 2, name: 'Участник', email: credentials.email, role: 'user' };
    }
    const mockToken = 'mock-jwt-token';
    localStorage.setItem('token', mockToken);
    localStorage.setItem('user', JSON.stringify(mockUser));
    setUser(mockUser);
    return mockUser;
  };

  const register = async (userData) => {
    const mockUser = { id: Date.now(), name: userData.name, email: userData.email, role: 'user' };
    const mockToken = 'mock-jwt-token';
    localStorage.setItem('token', mockToken);
    localStorage.setItem('user', JSON.stringify(mockUser));
    setUser(mockUser);
    return mockUser;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
