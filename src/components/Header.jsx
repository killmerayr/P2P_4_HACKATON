import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-gradient-to-t from-sky-50 to-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Логотип с ссылкой на главную */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="text-xl font-bold text-gray-800">SkillSwap</span>
        </Link>
        
        {/* Навигация с Link */}
        <nav className="flex gap-2">
          <Link to="/" className="font-semibold text-gray-800 hover:bg-purple-50 hover:text-blue-600 transition-colors px-4 py-2 rounded-lg hover:shadow-lg focus:outline-none">
            Главная
          </Link>
          <Link to="/create" className="font-semibold text-gray-800 hover:bg-purple-50 hover:text-blue-600 transition-colors px-4 py-2 rounded-lg focus:outline-none">
            Разместить объявление
          </Link>
          <Link to="/messages" className="font-semibold text-gray-800 hover:bg-purple-50 hover:text-blue-600 transition-colors px-4 py-2 rounded-lg focus:outline-none">
            Сообщения
          </Link>
        </nav>
        
        {/* Кнопка входа с ссылкой */}
        <Link to="/login" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-purple-200 transition-colors font-semibold shadow-md hover:bg-white">
          Войти
        </Link>
      </div>
    </header>
  );
}