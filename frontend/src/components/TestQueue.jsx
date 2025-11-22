import React, { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useQueue } from "../hooks/useQueue";
import { useParticipant } from "../hooks/useParticipant";
import { useOwner } from "../hooks/useOwner";

export const TestQueue = () => {
  const { user, login, getProfile } = useAuth();
  const { queues, fetchQueues, joinQueue } = useQueue();
  const { participants, fetchMyParticipants, cancelParticipation } = useParticipant();
  const { owners, fetchOwners, registerOwner } = useOwner();

  // на старте загружаем данные
  useEffect(() => {
    fetchQueues();
    fetchMyParticipants();
    fetchOwners();
    getProfile();
  }, []);

  return (
    <div>
      <h2>Тест API</h2>

      <div>
        <h3>Пользователь</h3>
        {user ? <p>{user.username} ({user.email})</p> : <button onClick={() => login({username: "testuser", password: "testpass"})}>Login</button>}
      </div>

      <div>
        <h3>Очереди</h3>
        {queues.map(q => (
          <div key={q.id}>
            <span>{q.name}</span>
            <button onClick={() => joinQueue(q.id)}>Присоединиться</button>
          </div>
        ))}
      </div>

      <div>
        <h3>Мои участники</h3>
        {participants.map(p => (
          <div key={p.id}>
            <span>{p.name} - {p.status}</span>
            <button onClick={() => cancelParticipation(p.id)}>Отменить</button>
          </div>
        ))}
      </div>

      <div>
        <h3>Владельцы</h3>
        {owners.map(o => (
          <div key={o.id}>{o.name}</div>
        ))}
        <button onClick={() => registerOwner({name: "Новый владелец"})}>Добавить владельца</button>
      </div>
    </div>
  );
};
