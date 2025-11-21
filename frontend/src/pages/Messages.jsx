export default function Messages() {
  // Временные данные для примера
  const conversations = [
    {
      id: 1,
      user: "Анна Сидорова",
      lastMessage: "Привет! Готов обменяться: гитара на Python",
      time: "10:30",
      unread: 2
    },
    {
      id: 2,
      user: "Мистер Писькин",
      lastMessage: "Когда можем провести первое занятие?",
      time: "Вчера",
      unread: 0
    },
    {
      id: 3,
      user: "Мария Иванова",
      lastMessage: "Спасибо за урок! Было очень полезно 👍",
      time: "12 апр",
      unread: 0
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-sky-300 to-violet-200">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Заголовок */}
          <div className="border-b border-gray-200 p-6">
            <h1 className="text-2xl font-bold text-gray-800">Сообщения</h1>
            <p className="text-gray-600 mt-1">Общайтесь с другими пользователями</p>
          </div>

          <div className="flex h-[600px]">
            {/* Список чатов */}
            <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
              {conversations.map(chat => (
                <div 
                  key={chat.id}
                  className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition"
                >
                  <div className="flex items-start gap-3">
                    {/* Аватар */}
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {chat.user.charAt(0)}
                    </div>
                    
                    {/* Информация о чате */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-gray-800 truncate">{chat.user}</h3>
                        <span className="text-sm text-gray-500">{chat.time}</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate mt-1">{chat.lastMessage}</p>
                    </div>

                    {/* Счетчик непрочитанных */}
                    {chat.unread > 0 && (
                      <div className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {chat.unread}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Область сообщений */}
            <div className="w-2/3 flex flex-col">
              {/* Заголовок чата */}
              <div className="border-b border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                    А
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Анна Сидорова</h3>
                    <p className="text-sm text-gray-500">Обмен: Гитара ↔ Python</p>
                  </div>
                </div>
              </div>

              {/* Сообщения */}
              <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                <div className="space-y-4">
                  {/* Сообщение от другого пользователя */}
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">
                      А
                    </div>
                    <div className="bg-white rounded-lg p-3 shadow-sm max-w-xs">
                      <p className="text-gray-800">Привет! Готов обменяться: я научу играть на гитаре, а ты меня Python</p>
                      <span className="text-xs text-gray-500 block mt-1">10:28</span>
                    </div>
                  </div>

                  {/* Мое сообщение */}
                  <div className="flex gap-3 justify-end">
                    <div className="bg-blue-500 rounded-lg p-3 shadow-sm max-w-xs">
                      <p className="text-white">Отлично! Предлагаю начать с базового синтаксиса Python</p>
                      <span className="text-xs text-blue-100 block mt-1">10:30</span>
                    </div>
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                      Я
                    </div>
                  </div>
                </div>
              </div>

              {/* Поле ввода */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Напишите сообщение..."
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold">
                    Отправить
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}