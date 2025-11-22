import { Link } from 'react-router-dom';
// import { eventAPI } from '../services/api'; //

export default function EventCard({ event }) {
  const participationPercent = (event.participants / event.maxParticipants) * 100;

  const checkRegistration = () => {
    return event.id % 2 === 0;
  };

  const userIsRegistered = checkRegistration(); // ← исправил опечатку

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition cursor-pointer flex flex-col h-full">
      <div className="bg-stone-200 text-stone-700 text-sm font-semibold px-3 py-1">
        {event.category}
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-gray-800 mb-3">{event.title}</h3>
        
        <div className="space-y-2 text-gray-600 flex-1">
          <div className="flex items-center gap-2">
            <span>📅</span>
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>⏰</span>
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>📍</span>
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>👤</span>
            <span>{event.organizer}</span>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Участники:</span>
            <span>{event.participants}/{event.maxParticipants}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-yellow-500 h-2 rounded-full" 
              style={{ width: `${participationPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Кнопка - исправленная версия */}
        <Link 
          to={`/events/${event.id}`}
          className={`w-full mt-4 py-3 rounded-lg font-semibold text-center transition ${
            userIsRegistered
              ? 'bg-green-500 text-white cursor-default'
              : event.participants >= event.maxParticipants
              ? 'bg-red-400 text-white cursor-default'
              : 'bg-stone-500 hover:bg-stone-600 text-white'
          }`}
        >
          {userIsRegistered 
            ? '✓ Вы записаны'
            : event.participants >= event.maxParticipants
            ? 'Мест нет'
            : 'Подробнее и запись'
          }
        </Link>
      </div>
    </div>
  );
}