import { createContext, useState, useContext, useEffect } from 'react';
// import { authAPI } from '../services/api'; // ← пока закомментируй

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
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
    if (token) {
      try {
        // Временная заглушка - можно оставить как админ по умолчанию
        // или определить роль из localStorage
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        } else {
          const mockUser = {
            id: 1,
            name: 'Администратор',
            email: 'admin@eventhub.ru',
            role: 'admin'
          };
          setUser(mockUser);
        }
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  };

  const login = async (credentials) => {
    // Определяем роль по email
    let userRole = 'user';
    let userName = 'Участник EventHub';
    
    if (credentials.email === 'admin@eventhub.ru') {
      userRole = 'admin';
      userName = 'Организатор EventHub';
    }

    const mockUser = {
      id: userRole === 'admin' ? 1 : 2,
      name: userName,
      email: credentials.email,
      role: userRole
    };
    const mockToken = 'mock-jwt-token';
    
    localStorage.setItem('token', mockToken);
    localStorage.setItem('user', JSON.stringify(mockUser)); // Сохраняем пользователя
    setUser(mockUser);
    return mockUser;
  };

  const register = async (userData) => {
    // Все новые пользователи - обычные участники
    const mockUser = {
      id: Date.now(),
      name: userData.name,
      email: userData.email,
      role: 'user'
    };
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

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};