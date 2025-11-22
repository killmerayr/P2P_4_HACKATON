import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

export default function Header() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const handleCreateEventClick = (e) => {
    if (!user) {
      // Если не авторизован - ничего не делаем, Link сам переведет на /login
      return;
    }
    
    if (user.role !== 'admin') {
      // Если обычный пользователь - показываем сообщение и блокируем переход
      e.preventDefault();
      alert('Только организаторы могут создавать мероприятия');
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="text-xl font-bold text-gray-800">EventHub</span>
          </Link>
          
          <nav className="flex gap-4">
            <Link to="/events" className="font-semibold text-gray-800 hover:bg-yellow-200 transition px-4 py-2 rounded-lg outline-none">
              Мероприятия
            </Link>
            
            {/* Умная кнопка "Создать мероприятие" */}
            {user ? (
              user.role === 'admin' ? (
                <Link to="/create-event" className="font-semibold text-gray-800 hover:bg-yellow-200 transition px-4 py-2 rounded-lg outline-none">
                  Создать мероприятие
                </Link>
              ) : (
                <button 
                  onClick={() => alert('Только организаторы могут создавать мероприятия')}
                  className="font-semibold text-gray-800 hover:bg-yellow-200 transition px-4 py-2 rounded-lg outline-none opacity-50 cursor-not-allowed"
                  title="Только для организаторов"
                >
                  Создать мероприятие
                </button>
              )
            ) : (
              <Link 
                to="/login" 
                className="font-semibold text-gray-800 hover:bg-yellow-200 transition px-4 py-2 rounded-lg outline-none"
              >
                Создать мероприятие
              </Link>
            )}
            
            <Link to="/my-registrations" className="font-semibold text-gray-800 hover:bg-yellow-200 transition px-4 py-2 rounded-lg outline-none">
              Мои записи
            </Link>
            
            {/* Админка */}
            {user?.role === 'admin' && ( 
              <Link to="/admin" className="font-semibold text-gray-800 hover:bg-yellow-200 transition px-4 py-2 rounded-lg outline-none">
                Админка
              </Link>
            )}
          </nav>
          
          <div className="flex gap-4">
            {user ? (
              // Если пользователь залогинен
              <div className="flex items-center gap-4">
                <span className="text-gray-700">Привет, {user.name}!</span>
                {user?.role === 'admin' && (
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-sm">ADMIN</span>
                )}
                <button 
                  onClick={handleLogout}
                  className="bg-stone-600 text-white px-6 py-2 rounded-lg hover:bg-stone-700 transition-colors font-semibold outline-none"
                >
                  Выйти
                </button>
              </div>
            ) : ( 
              // Если пользователь не залогинен
              <div className="flex gap-4">
                <Link to="/login" className="bg-stone-600 text-white px-6 py-2 rounded-lg hover:bg-stone-700 transition-colors font-semibold outline-none">
                  Войти
                </Link>
                <Link to="/register" className="border border-stone-400 text-stone-600 px-6 py-2 rounded-lg hover:bg-stone-50 transition-colors font-semibold outline-none">
                  Регистрация
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}