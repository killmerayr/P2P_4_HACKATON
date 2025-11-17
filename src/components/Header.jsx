export default function Header() {
  return (
    <header className="bg-gradient-to-t from-sky-50 to-white-950 shadow-sb border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Логотип */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="text-xl font-bold text-gray-800">SkillSwap</span>
        </div>
        
        {/* Навигация с закрашиванием */}
        <nav className="flex gap-2">
          <button className="font-semibold text-gray-800 hover:bg-purple-50 hover:text-blue-600 transition-colors px-4 py-2 rounded-lg">
            Главная
          </button>
          <button className="font-semibold text-gray-800 hover:bg-purple-50 hover:text-blue-600 transition-colors px-4 py-2 rounded-lg">
            Разместить объявление
          </button>
          <button className="font-semibold text-gray-800 hover:bg-purple-50 hover:text-blue-600 transition-colors px-4 py-2 rounded-lg">
            Сообщения
          </button>
        </nav>
        
        {/* Кнопка входа */}
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md hover:shadow-lg">
          Войти
        </button>
      </div>
    </header>
  );
}