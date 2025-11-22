import { useState } from 'react';
// import { eventAPI } from '../services/api'; // ← ЗАКОММЕНТИРУЙ пока

export default function CreateEvent() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    date: '',
    time: '',
    location: '',
    maxParticipants: '',
    contactInfo: ''
  });

  // УБЕРИ лишнюю функцию - у тебя две handleSubmit
  // const handleSumbit = async (formData) => {
  //   try {
  //     await eventAPI.createEvent(formData);
  //     //уведа
  //   } catch (error){
  //     console.error('Ошибка создания:', error);
  //   }
  // }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Создаем мероприятие:', formData);
    alert('Мероприятие создано! (пока заглушка)');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-yellow-300 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Создать мероприятие
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Название мероприятия */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Название мероприятия *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Хакатон по веб-разработке, Мастер-класс..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500"
                required
              />
            </div>

            {/* Описание */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Описание *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Опишите ваше мероприятие, что будет происходить, для кого оно..."
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500 resize-none"
                required
              ></textarea>
            </div>

            {/* Категория */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Категория *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500"
                required
              >
                <option value="">Выберите категорию</option>
                <option value="Технологии">Технологии</option>
                <option value="Личностный рост">Личностный рост</option>
                <option value="Развлечения">Развлечения</option>
                <option value="Искусство">Искусство</option>
                <option value="Образование">Образование</option>
                <option value="Спорт">Спорт</option>
              </select>
            </div>

            {/* Дата и время */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Дата *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Время *
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500"
                  required
                />
              </div>
            </div>

            {/* Место проведения */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Место проведения *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Главный корпус, ауд. 301, Студенческий клуб..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500"
                required
              />
            </div>

            {/* Максимальное количество участников */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Максимальное количество участников *
              </label>
              <input
                type="number"
                name="maxParticipants"
                value={formData.maxParticipants}
                onChange={handleChange}
                placeholder="30"
                min="1"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500"
                required
              />
            </div>

            {/* Контактная информация */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Контактная информация *
              </label>
              <input
                type="text"
                name="contactInfo"
                value={formData.contactInfo}
                onChange={handleChange}
                placeholder="Telegram, Email или телефон для связи"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-500"
                required
              />
            </div>

            {/* Кнопки */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-yellow-500 text-white py-3 rounded-lg hover:bg-yellow-600 transition font-semibold text-lg outline-none"
              >
                Создать мероприятие
              </button>
              
              <button
                type="button"
                className="flex-1 bg-stone-500 text-white py-3 rounded-lg hover:bg-stone-600 transition font-semibold text-lg outline-none"
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}