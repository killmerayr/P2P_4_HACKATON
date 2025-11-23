// src/pages/Queues.jsx
import React from "react";
import { useQueues } from "../hooks/useQueues";
import QueueCard from "../components/QueueCard";

export default function Queues() {
  const { queues, loading, error } = useQueues();

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Все очереди</h1>
        <p className="text-gray-600">Загрузка очередей...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Все очереди</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Ошибка загрузки: {error}
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Все очереди</h1>
      {queues.length === 0 ? (
        <p className="text-gray-600">Нет доступных очередей</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {queues.map((queue) => (
            <QueueCard key={queue.id} queue={queue} />
          ))}
        </div>
      )}
    </main>
  );
}
