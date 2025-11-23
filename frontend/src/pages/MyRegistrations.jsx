import { useState, useEffect } from "react";
// import { eventAPI } from "../services/api"; 

export default function MyRegistrations() {
  const statusConfig = {
    confirmed: { text: "Подтверждено", color: "bg-green-100 text-green-800" },
    waiting: { text: "Ожидание", color: "bg-yellow-100 text-yellow-800" },
    cancelled: { text: "Отменено", color: "bg-red-100 text-red-800" }
  };

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRegistrations();
  }, []);

  const loadRegistrations = async () => {
    try {
      // Временные данные
      const mockRegistrations = [
        {
          id: 1,
          eventId: 1,
          eventTitle: "Хакатон по веб-разработке",
          date: "15 декабря 2024",
          time: "10:00 - 18:00",
          location: "Главный корпус, ауд. 301",
          status: "confirmed",
          organizer: "IT-клуб НГТУ"
        },
        {
          id: 2,
          eventId: 2,
          eventTitle: "Мастер-класс по публичным выступлениям",
          date: "18 декабря 2024",
          time: "15:00 - 17:00", 
          location: "Библиотека, конференц-зал",
          status: "waiting",
          organizer: "Клуб ораторского искусства"
        },
        {
          id: 3,
          eventId: 3,
          eventTitle: "Турнир по настольным играм",
          date: "20 декабря 2024",
          time: "18:00 - 22:00",
          location: "Студенческий клуб",
          status: "confirmed",
          organizer: "Клуб настольных игр"
        }
      ];

      setTimeout(() => {
        setRegistrations(mockRegistrations);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      setLoading(false);
    }
  }

  const handleCancelRegistration = async (registrationId) => {
    if (!window.confirm('Вы уверены, что хотите отменить запись?')) {
      return;
    }

    try {
      // Временная заглушка - потом заменишь на API
      // await eventAPI.cancelRegistration(registrationId);
      
      // Обновляем статус локально
      setRegistrations(prev => 
        prev.map(reg => 
          reg.id === registrationId 
            ? { ...reg, status: 'cancelled' }
            : reg
        )
      );
      
      alert('✅ Запись отменена');
    } catch (error) {
      console.error('Ошибка отмены:', error);
      alert('❌ Не удалось отменить запись');
    }
  };

  const handleFindEvents = () => {
    window.location.href = '/events'; // Простой редирект
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-yellow-300 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-stone-800 text-2xl">Загрузка...</div>
          </div>
        </div>
      </div>
    );
  }

  const activeRegistrations = registrations.filter(reg => reg.status !== 'cancelled');

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-yellow-300 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Мои записи
          </h1>

          {activeRegistrations.length > 0 ? (
            <div className="space-y-6">
              {registrations.map(registration => (
                <div key={registration.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">{registration.eventTitle}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig[registration.status].color}`}>
                      {statusConfig[registration.status].text}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span>📅</span>
                        <span>{registration.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>⏰</span>
                        <span>{registration.time}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span>📍</span>
                        <span>{registration.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>👤</span>
                        <span>{registration.organizer}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <a 
                      href={`/events/${registration.eventId}`}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition font-semibold text-sm outline-none"
                    >
                      Подробнее
                    </a>
                    {registration.status !== 'cancelled' && (
                      <button 
                        onClick={() => handleCancelRegistration(registration.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-semibold text-sm outline-none"
                      >
                        Отменить запись
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Записей пока нет</h3>
              <p className="text-gray-600 mb-6">Найдите интересные мероприятия и запишитесь на них!</p>
              <button 
                onClick={handleFindEvents}
                className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition font-semibold outline-none"
              >
                Найти мероприятия
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}