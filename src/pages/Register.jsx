import { Link } from 'react-router-dom';

export default function Register() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-sky-300 to-violet-200 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Регистрация</h2>
        
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Имя"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <input
            type="password"
            placeholder="Пароль"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <input
            type="password"
            placeholder="Повторите пароль"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          
          <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold">
            Зарегистрироваться
          </button>
        </div>
        
        <p className="text-center mt-4 text-gray-800">
          Уже есть аккаунт? 
          <Link to="/login" className="text-semibold text-blue-600 hover:underline ml-1 px-1">
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
}