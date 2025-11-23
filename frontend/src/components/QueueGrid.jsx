import { useQueues } from '../hooks/useQueues';
import QueueCard from './QueueCard';

export default function QueueGrid() {
  const { queues, loading, error } = useQueues();

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Загрузка очередей...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Ошибка загрузки: {error}
      </div>
    );
  }

  if (queues.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Нет доступных очередей</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
      {queues.map(queue => (
        <QueueCard key={queue.id} queue={queue} />
      ))}
    </div>
  );
}
