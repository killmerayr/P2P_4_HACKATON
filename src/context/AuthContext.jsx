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
        //заменишь на authAPI.getProfile()
        const mockUser = {
          id: 1,
          name: 'Администратор',
          email: 'admin@example.com',
          role: 'admin' //для теста админки
        };
        setUser(mockUser);
        
        //заменишь на:
        // const response = await authAPI.getProfile();
        // setUser(response.data);
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  };

  const login = async (credentials) => {
    // ВРЕМЕННАЯ ЗАГЛУШКА
    const mockUser = {
      id: 1,
      name: 'Администратор',
      email: credentials.email,
      role: 'admin'
    };
    const mockToken = 'mock-jwt-token';
    
    localStorage.setItem('token', mockToken);
    setUser(mockUser);
    return mockUser;
    
    //заменишь на:
    // const response = await authAPI.login(credentials);
    // const { token, user } = response.data;
    // localStorage.setItem('token', token);
    // setUser(user);
    // return user;
  };

  const register = async (userData) => {
    // aналогичная заглушка для регистрации
    const mockUser = {
      id: Date.now(),
      name: userData.name,
      email: userData.email,
      role: 'user'
    };
    const mockToken = 'mock-jwt-token';
    
    localStorage.setItem('token', mockToken);
    setUser(mockUser);
    return mockUser;
  };

  const logout = () => {
    localStorage.removeItem('token');
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