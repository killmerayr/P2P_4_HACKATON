import { useState, useEffect } from 'react';
// import { eventAPI } from '../services/api'; // пока заглушка

export default function AdminPanel() {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    // Временные данные - одно мероприятие владельца
    const mockEvent = {
      id: 1,
      title: "Хакатон по веб-разработке",
      description: "Присоединяйтесь к нашему хакатону по веб-разработке! 24 часа кодинга, пицца, энергетики и крутые призы.",
      date: "2024-12-15",
      time: "10:00 - 18:00",
      location: "Главный корпус, ауд. 301",
      category: "Технологии",
      maxParticipants: 30,
      contactInfo: "@it_club_ngtu",
      participants: [
        { id: 1, name: "Иван Иванов", email: "ivan@mail.ru", registeredAt: "2024-11-20" },
        { id: 2, name: "Петр Петров", email: "petr@mail.ru", registeredAt: "2024-11-21" },
        { id: 3, name: "Мария Сидорова", email: "maria@mail.ru", registeredAt: "2024-11-22" }
      ]
    };

    setTimeout(() => {
      setEvent(mockEvent);
      setEditForm(mockEvent);
      setLoading(false);
    }, 1000);
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      // await eventAPI.updateEvent(event.id, editForm);
      setEvent(editForm);
      setIsEditing(false);
      alert('Изменения сохранены!');
    } catch (error) {
      alert('Ошибка сохранения');
    }
  };

  const handleCancel = () => {
    setEditForm(event);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const handleDeleteParticipant = (participantId) => {
    if (!window.confirm('Удалить участника из мероприятия?')) return;
    
    // Логика удаления участника
    setEvent(prev => ({
      ...prev,
      participants: prev.participants.filter(p => p.id !== participantId)
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-yellow-300 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="text-stone-800 text-2xl">Загрузка...</div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-yellow-300 py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">У вас пока нет мероприятий</h1>
          <a href="/create-event" className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition">
            Создать мероприятие
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-yellow-300 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Управление мероприятием
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Информация о мероприятии */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Мое мероприятие</h2>
                {!isEditing && (
                  <button 
                    onClick={handleEdit}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                  >
                    Редактировать
                  </button>
                )}
              </div>

              {isEditing ? (
                // Форма редактирования
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Название</label>
                    <input
                      type="text"
                      name="title"
                      value={editForm.title}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold mb-2">Описание</label>
                    <textarea
                      name="description"
                      value={editForm.description}
                      onChange={handleChange}
                      rows="3"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Дата</label>
                      <input
                        type="date"
                        name="date"
                        value={editForm.date}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Время</label>
                      <input
                        type="text"
                        name="time"
                        value={editForm.time}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Место</label>
                    <input
                      type="text"
                      name="location"
                      value={editForm.location}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={handleSave}
                      className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition"
                    >
                      Сохранить
                    </button>
                    <button 
                      onClick={handleCancel}
                      className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              ) : (
                // Просмотр информации
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-700">Название</h3>
                    <p className="text-gray-900">{event.title}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-700">Описание</h3>
                    <p className="text-gray-900">{event.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-700">Дата и время</h3>
                      <p className="text-gray-900">{event.date} • {event.time}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-700">Место</h3>
                      <p className="text-gray-900">{event.location}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-700">Контакты</h3>
                    <p className="text-gray-900">{event.contactInfo}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Участники */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-stone-600 text-xl font-semibold mb-4">Участники ({event.participants.length}/{event.maxParticipants})</h3>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {event.participants.map(participant => (
                  <div key={participant.id} className="flex justify-between items-center border-b pb-3">
                    <div>
                      <div className="text-stone-800 font-medium">{participant.name}</div>
                      <div className="text-sm text-gray-600">{participant.email}</div>
                      <div className="text-xs text-gray-500">Записан: {participant.registeredAt}</div>
                    </div>
                    <button 
                      onClick={() => handleDeleteParticipant(participant.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Удалить
                    </button>
                  </div>
                ))}
              </div>

              {event.participants.length === 0 && (
                <p className="text-gray-500 text-center py-4">Пока нет участников</p>
              )}
            </div>

            {/* Статистика */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-stone-800 text-xl font-semibold mb-4">Статистика</h3>
              <div className="space-y-2">
                <div className="text-stone-800 flex justify-between">
                  <span>Заполненность:</span>
                  <span className="font-semibold">{Math.round((event.participants.length / event.maxParticipants) * 100)}%</span>
                </div>
                <div className="text-stone-800 flex justify-between">
                  <span>Свободных мест:</span>
                  <span className="font-semibold">{event.maxParticipants - event.participants.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}