import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { authAPI } from '../services/api';

export default function Register() {
  const [userType, setUserType] = useState('participant');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    organization: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    setLoading(true);

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password
      };

      // Use different endpoint for organizers
      if (userType === 'organizer') {
        userData.organization = formData.organization;
        const response = await authAPI.registerOwner(userData);
        
        // Save token and user info
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
      } else {
        const response = await authAPI.register(userData);
        
        // Save token and user info
        if (response.data.access) {
          localStorage.setItem('token', response.data.access);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
      }

      // Redirect to home
      navigate('/');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || err.response?.data?.error || 'Ошибка регистрации. Попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-white to-yellow-300 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Регистрация</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Выбор типа пользователя */}
        <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-lg">
          <button
            type="button"
            onClick={() => setUserType('participant')}
            className={`flex-1 py-2 rounded-md transition font-semibold ${
              userType === 'participant' 
                ? 'bg-yellow-500 text-white shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Участник
          </button>
          <button
            type="button"
            onClick={() => setUserType('organizer')}
            className={`flex-1 py-2 rounded-md transition font-semibold ${
              userType === 'organizer' 
                ? 'bg-yellow-500 text-white shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Организатор
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Имя"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500"
            required
          />
          
          {/* Дополнительное поле для организаторов */}
          {userType === 'organizer' && (
            <input
              type="text"
              name="organization"
              placeholder="Название организации или клуба"
              value={formData.organization}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500"
              required
            />
          )}
          
          <input
            type="password"
            name="password"
            placeholder="Пароль"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Повторите пароль"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500"
            required
          />
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 text-white py-3 rounded-lg hover:bg-yellow-600 transition font-semibold disabled:opacity-50"
          >
            {loading ? 'Регистрация...' : (userType === 'organizer' ? 'Зарегистрироваться как организатор' : 'Зарегистрироваться')}
          </button>
        </form>
        
        <p className="text-center mt-4 text-gray-800">
          Уже есть аккаунт? 
          <Link to="/login" className="font-semibold text-yellow-500 hover:underline hover:text-yellow-600 transition ml-1">
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
}