import { useState, useEffect } from "react";
import { queueAPI, participantAPI, ownerAPI } from "../services/api";

export default function TestQueuePage() {
  const [queues, setQueues] = useState([]);
  const [myParticipants, setMyParticipants] = useState([]);
  const [ownerId, setOwnerId] = useState("");
  const [newQueueName, setNewQueueName] = useState("");

  // Получаем владельца
  useEffect(() => {
    async function fetchOwner() {
      try {
        const owners = await ownerAPI.getAllOwners();
        if (owners.length > 0) setOwnerId(owners[0].id);
      } catch (err) {
        console.error("Ошибка получения владельца:", err);
      }
    }
    fetchOwner();
  }, []);

  // Получаем очереди
  useEffect(() => {
    async function fetchQueues() {
      try {
        const res = await queueAPI.getAllQueues();
        setQueues(res.data);
      } catch (err) {
        console.error("Ошибка получения очередей:", err);
      }
    }
    fetchQueues();
  }, []);

  // Получаем мои регистрации
  useEffect(() => {
    async function fetchMyParticipants() {
      try {
        const res = await participantAPI.getMyParticipants();
        setMyParticipants(res.data);
      } catch (err) {
        console.error("Ошибка получения участников:", err);
      }
    }
    fetchMyParticipants();
  }, []);

  // Создать очередь
  const handleCreateQueue = async () => {
    if (!newQueueName || !ownerId) return;
    try {
      const res = await queueAPI.createQueue({ name: newQueueName, owner: ownerId });
      setQueues([...queues, res.data]);
      setNewQueueName("");
    } catch (err) {
      console.error("Ошибка создания очереди:", err.response?.data || err);
    }
  };

  // Присоединиться к очереди
  const handleJoinQueue = async (id) => {
    try {
      await queueAPI.joinQueue(id);
      alert(`Присоединились к очереди ${id}`);
    } catch (err) {
      console.error("Ошибка присоединения:", err.response?.data || err);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Тест очередей</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Название новой очереди"
          value={newQueueName}
          onChange={(e) => setNewQueueName(e.target.value)}
          className="border px-2 py-1 mr-2"
        />
        <button onClick={handleCreateQueue} className="bg-blue-500 text-white px-3 py-1 rounded">
          Создать очередь
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-2">Существующие очереди</h2>
      <ul className="mb-6">
        {queues.map(q => (
          <li key={q.id} className="mb-1 flex justify-between items-center">
            {q.name} (ID: {q.id})
            <button
              onClick={() => handleJoinQueue(q.id)}
              className="bg-green-500 text-white px-2 py-1 rounded"
            >
              Присоединиться
            </button>
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mb-2">Мои регистрации</h2>
      <ul>
        {myParticipants.map(p => (
          <li key={p.id}>
            {p.name} (очередь {p.queue}) — статус: {p.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
