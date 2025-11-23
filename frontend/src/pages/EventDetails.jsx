import { useParams, Link, useNavigate } from 'react-router-dom'; 
import { useState, useEffect } from 'react';

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate(); 
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleShare = (platform) => {
    const eventUrl = `${window.location.origin}/events/${event.id}`;
    const text = `Посмотри это мероприятие: ${event.title}`;
    
    const shareUrls = {
      telegram: `https://t.me/share/url?url=${encodeURIComponent(eventUrl)}&text=${encodeURIComponent(text)}`,
      vk: `https://vk.com/share.php?url=${encodeURIComponent(eventUrl)}&title=${encodeURIComponent(event.title)}&description=${encodeURIComponent(event.description)}`
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  const handleCopyLink = async () => {
    const eventUrl = `${window.location.origin}/events/${event.id}`;
    try {
      await navigator.clipboard.writeText(eventUrl);
      alert('✅ Ссылка скопирована в буфер обмена!');
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = eventUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('✅ Ссылка скопирована!');
    }
  };

  const handleOpenChat = () => {
    navigate(`/event/${event.id}/chat`);
  };

  useEffect(() => {
    const mockEvents = [
      {
        id: 1,
        title: "Хакатон по веб-разработке",
        description: "Присоединяйтесь к нашему хакатону по веб-разработке! 24 часа кодинга, пицца, энергетики и крутые призы. Подходит для начинающих и опытных разработчиков.",
        date: "15 декабря 2024",
        time: "10:00 - 18:00",
        location: "Главный корпус, ауд. 301",
        organizer: "IT-клуб НГТУ",
        contactInfo: "@it_club_ngtu",
        participants: 24,
        maxParticipants: 30,
        category: "Технологии",
        requirements: "Ноутбук, базовые знания HTML/CSS/JS"
      },
      {
        id: 2,
        title: "Мастер-класс по публичным выступлениям",
        description: "Научитесь уверенно выступать перед аудиторией. Практические упражнения, работа с голосом и жестами, преодоление страха сцены.",
        date: "18 декабря 2024", 
        time: "15:00 - 17:00",
        location: "Библиотека, конференц-зал",
        organizer: "Клуб ораторского искусства",
        contactInfo: "speechclub@ngtu.ru",
        participants: 15,
        maxParticipants: 25,
        category: "Личностный рост",
        requirements: "Только хорошее настроение!"
      }
    ];

    const foundEvent = mockEvents.find(e => e.id === parseInt(id));
    
    setTimeout(() => {
      setEvent(foundEvent);
      setLoading(false);
    }, 500);
  }, [id]);

  const handleRegister = async () => {
    setIsRegistering(true);
    try {
      setTimeout(() => {
        alert('✅ Вы успешно записались на мероприятие!');
        setIsRegistering(false);
      }, 1000);
    } catch (error) {
      alert('❌ Ошибка записи');
      setIsRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-yellow-300 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="text-2xl">Загрузка...</div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-yellow-300 py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Мероприятие не найдено</h1>
          <Link to="/events" className="text-blue-600 hover:underline">
            Вернуться к списку мероприятий
          </Link>
        </div>
      </div>
    );
  }

  const participationPercent = (event.participants / event.maxParticipants) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-yellow-300 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Хлебные крошки */}
        <nav className="mb-6">
          <Link to="/events" className="text-gray-600 hover:text-gray-800">
            ← Все мероприятия
          </Link>
        </nav>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Заголовок */}
          <div className="bg-yellow-400 p-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="bg-white text-yellow-600 text-sm font-semibold px-3 py-1 rounded-full">
                  {event.category}
                </span>
                <h1 className="text-3xl font-bold text-white mt-3">{event.title}</h1>
              </div>
              <div className="text-right">
                <div className="text-white text-lg font-semibold">{event.date}</div>
                <div className="text-white">{event.time}</div>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Основная информация */}
              <div className="lg:col-span-2">
                <h2 className="text-4xl text-stone-600 font-bold mb-4">Описание</h2>
                <p className="text-gray-700 mb-6 leading-relaxed">{event.description}</p>

                {event.requirements && (
                  <div className="mb-6">
                    <h3 className="text-xl text-stone-600 font-semibold mb-2">Что понадобится:</h3>
                    <p className="text-gray-600">{event.requirements}</p>
                  </div>
                )}

                {/* Детали мероприятия */}
                <div className="bg-stone-200 rounded-lg p-6">
                  <h3 className="text-gray-600 font-semibold mb-4">Детали мероприятия</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📍</span>
                      <div>
                        <div className="text-gray-600 font-medium">Место</div>
                        <div className="text-gray-800">{event.location}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">👤</span>
                      <div>
                        <div className="text-gray-600 font-medium">Организатор</div>
                        <div className="text-gray-800">{event.organizer}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📞</span>
                      <div>
                        <div className="text-gray-600 font-medium">Контакты</div>
                        <div className="text-gray-600">{event.contactInfo}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Боковая панель */}
              <div className="space-y-6">
                {/* Участники */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-gray-600 font-semibold mb-4">Участники</h3>
                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Записано:</span>
                      <span>{event.participants}/{event.maxParticipants}</span>
                    </div>  
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full" 
                        style={{ width: `${participationPercent}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleRegister}
                    disabled={isRegistering || event.participants >= event.maxParticipants}
                    className={`w-full py-3 rounded-lg font-semibold transition mb-3 ${
                      isRegistering 
                        ? 'bg-gray-400 cursor-not-allowed text-white'
                        : event.participants >= event.maxParticipants
                        ? 'bg-red-400 cursor-not-allowed text-white'
                        : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                    }`}
                  >
                    {isRegistering 
                      ? 'Записываем...' 
                      : event.participants >= event.maxParticipants
                      ? 'Мест нет'
                      : 'Записаться на мероприятие'
                    }
                  </button>

                  /*{}
                  <button
                    onClick={handleOpenChat}
                    className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2"
                  >
                    <span>💬</span>
                    организатором
                  </button>
                </div>*/

                {/* Быстрые действия */}
                <div className="bg-stone-200 rounded-lg p-4">
                  <h4 className="text-gray-600 font-semibold mb-3">Поделиться:</h4>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleShare('telegram')}
                      className="flex-1 bg-blue-500 text-white py-2 rounded text-sm hover:bg-blue-600 transition"
                    >
                      Telegram
                    </button>
                    <button 
                      onClick={() => handleShare('vk')}
                      className="flex-1 bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700 transition"
                    >
                      VK
                    </button>
                    <button
                      onClick={handleCopyLink}
                      className="flex-1 bg-gray-600 text-white py-2 rounded text-sm hover:bg-gray-700 transition-colors"
                    >
                      Копировать
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
