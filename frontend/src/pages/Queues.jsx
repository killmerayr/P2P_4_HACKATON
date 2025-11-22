// src/pages/Queues.jsx
import React from "react";
import { useQueues } from "../hooks/useQueues";
import QueueCard from "../components/QueueCard";

export default function Queues() {
  const { queues, loading } = useQueues();

  if (loading) return <p>Загрузка очередей...</p>;

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Все очереди</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {queues.map((queue) => (
          <QueueCard key={queue.id} queue={queue} />
        ))}
      </div>
    </main>
  );
}
