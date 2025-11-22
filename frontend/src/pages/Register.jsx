import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Register() {
  const [userType, setUserType] = useState('participant');

  return (
    <div className="min-h-screen bg-gradient-to-r from-white to-yellow-300 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Регистрация</h2>
        
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

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Имя"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500"
          />
          
          {/* Дополнительное поле для организаторов */}
          {userType === 'organizer' && (
            <input
              type="text"
              placeholder="Название организации или клуба"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500"
            />
          )}
          
          <input
            type="password"
            placeholder="Пароль"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500"
          />
          <input
            type="password"
            placeholder="Повторите пароль"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500"
          />
          
          <button className="w-full bg-yellow-500 text-white py-3 rounded-lg hover:bg-yellow-600 transition font-semibold">
            {userType === 'organizer' ? 'Зарегистрироваться как организатор' : 'Зарегистрироваться'}
          </button>
        </div>
        
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