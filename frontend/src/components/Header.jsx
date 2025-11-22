import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        
        {/* Лого */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          <span className="text-xl font-bold text-gray-800">EventHub</span>
        </Link>

        {/* Меню */}
        {user && (
          <nav className="flex gap-6 justify-center flex-grow text-gray-800 font-semibold">
            <Link to="/events" className="hover:text-yellow-600 transition">Мероприятия</Link>
            {user.role === 'admin' && (
              <Link to="/create-event" className="hover:text-yellow-600 transition">Создать мероприятие</Link>
            )}
            <Link to="/my-registrations" className="hover:text-yellow-600 transition">Мои записи</Link>
            {user.role === 'admin' && <Link to="/organizer/chat" className="hover:text-yellow-600 transition">Чаты</Link>}
            {user.role === 'user' && <Link to="/events" className="hover:text-yellow-600 transition">Мои чаты</Link>}
            {user.role === 'admin' && <Link to="/admin" className="hover:text-yellow-600 transition">Аккаунт</Link>}
          </nav>
        )}

        {/* Правая часть */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-gray-700 whitespace-nowrap">Привет, {user.name}!</span>
              {user.role === 'admin' && <span className="bg-red-500 text-white px-2 py-1 rounded text-sm">ADMIN</span>}
              {user.role === 'user' && <span className="bg-blue-500 text-white px-2 py-1 rounded text-sm">УЧАСТНИК</span>}
              <button 
                onClick={logout}
                className="bg-stone-600 text-white px-5 py-2 rounded-lg hover:bg-stone-700 transition"
              >
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="bg-stone-600 text-white px-5 py-2 rounded-lg hover:bg-stone-700 transition">Войти</Link>
              <Link to="/register" className="border border-stone-400 text-stone-600 px-5 py-2 rounded-lg hover:bg-stone-50 transition">Регистрация</Link>
            </>
          )}
        </div>

      </div>
    </header>
  );
}
