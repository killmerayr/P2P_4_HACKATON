import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await login(formData);
      navigate('/');
    } catch (error) {
      alert('Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Функции для быстрого заполнения тестовых данных
  const fillAdminCredentials = () => {
    setFormData({
      email: 'admin@eventhub.ru',
      password: 'admin123'
    });
  };

  const fillUserCredentials = () => {
    setFormData({
      email: 'user@eventhub.ru',
      password: 'user123'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-yellow-300 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Вход в аккаунт</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Пароль"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500"
            required
          />
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 text-white py-3 rounded-lg hover:bg-yellow-600 transition font-semibold disabled:opacity-50"
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>

        {/* Кнопки для быстрого заполнения */}
        <div className="mt-6 space-y-3">
          <p className="text-sm text-gray-600 text-center">Быстрый вход для теста:</p>
          
          <button 
            type="button"
            onClick={fillAdminCredentials}
            className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition font-semibold text-sm"
          >
            Войти как Организатор (Админ)
          </button>
          
          <button 
            type="button"
            onClick={fillUserCredentials}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition font-semibold text-sm"
          >
            Войти как Участник
          </button>
        </div>
        
        <p className="text-center mt-6 text-gray-600">
          Нет аккаунта? 
          <Link to="/register" className="text-yellow-500 hover:underline ml-1">
            Зарегистрироваться
          </Link>
        </p>

        {/* Информация о тестовых аккаунтах */}
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold mb-2 text-sm">Тестовые аккаунты:</h3>
          <div className="text-xs space-y-1">
            <div><strong>Организатор:</strong> admin@eventhub.ru / admin123</div>
            <div><strong>Участник:</strong> user@eventhub.ru / user123</div>
          </div>
        </div>
      </div>
    </div>
  );
}