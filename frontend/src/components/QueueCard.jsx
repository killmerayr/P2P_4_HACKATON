// src/components/QueueCard.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function QueueCard({ queue }) {
  return (
    <div className="border p-4 rounded shadow hover:shadow-lg transition">
      <h3 className="text-xl font-bold">{queue.name}</h3>
      <p>Статус: {queue.status}</p>
      <p>Участников в очереди: {queue.current_waiting}</p>
      <p>Примерное время ожидания: {queue.estimated_wait_display}</p>
      <Link to={`/queues/${queue.id}`} className="text-blue-500 hover:underline mt-2 block">
        Подробнее
      </Link>
    </div>
  );
}
