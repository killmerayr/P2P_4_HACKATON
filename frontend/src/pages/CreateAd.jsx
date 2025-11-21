export default function CreateAd() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-sky-300 to-violet-200 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Разместить объявление
          </h1>
          
          <form className="space-y-6">
            {/* Что предлагаю */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Что я могу предложить *
              </label>
              <input
                type="text"
                placeholder="Например: Обучение Python, Игра на гитаре..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            {/* Описание */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Подробное описание *
              </label>
              <textarea
                placeholder="Опишите чему можете научить, ваш опыт, форматы занятий..."
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                required
              ></textarea>
            </div>

            {/* Категория */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Категория *
              </label>
              <select className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
                <option value="">Выберите категорию</option>
                <option value="programming">Программирование</option>
                <option value="music">Музыка</option>
                <option value="languages">Языки</option>
                <option value="design">Дизайн</option>
                <option value="other">Другое</option>
              </select>
            </div>

            {/* Что хочу получить */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Что хочу получить в обмен *
              </label>
              <input
                type="text"
                placeholder="Например: Английский язык, Фотография..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            {/* Контакты */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Контактная информация *
              </label>
              <input
                type="text"
                placeholder="Telegram, Email или телефон"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            {/* Кнопка отправки */}
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold text-lg shadow-md hover:shadow-lg"
            >
              Опубликовать объявление
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}