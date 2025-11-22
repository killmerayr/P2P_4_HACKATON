import { useState } from 'react';
import EventCard from '../components/EventCard';
import { useEvents } from '../hooks/useEvents';

export default function AllEvents() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const { events, loading } = useEvents(); // ← используем данные из хука

  // Фильтрация мероприятий
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.organizer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Уникальные категории для фильтра
  const categories = [...new Set(events.map(event => event.category))];

  if (loading) return <div>Загрузка...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-yellow-300 py-8">
      <div className="container mx-auto px-4">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Все мероприятия</h1>
          <p className="text-xl text-gray-600">Найдите мероприятие по интересам</p>
        </div>

        {/* Фильтры и поиск */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Поиск */}
            <div className="flex-1 w-full">
              <input
                type="text"
                placeholder="Поиск мероприятий или организаторов..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Фильтр по категориям */}
            <div className="w-full md:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="">Все категории</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Сброс фильтров */}
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
              }}
              className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition font-semibold outline-none"
            >
              Сбросить
            </button>
          </div>
        </div>

        {/* Счетчик найденных мероприятий */}
        <div className="mb-6">
          <p className="text-gray-600">
            Найдено мероприятий: <span className="font-semibold">{filteredEvents.length}</span>
          </p>
        </div>

        {/* Сетка мероприятий */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          // Сообщение если ничего не найдено
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Мероприятия не найдены</h3>
            <p className="text-gray-600">Попробуйте изменить параметры поиска</p>
          </div>
        )}
      </div>
    </div>
  );
}