import { useState, useEffect } from 'react';

export const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ВРЕМЕННЫЕ ДАННЫЕ вместо API запроса
    const mockEvents = [
      {
        id: 1,
        title: "Хакатон по веб-разработке",
        date: "15 декабря 2024",
        time: "10:00 - 18:00",
        location: "Главный корпус, ауд. 301",
        organizer: "IT-клуб НГТУ",
        participants: 24,
        maxParticipants: 30,
        category: "Технологии"
      },
      {
        id: 2,
        title: "Мастер-класс по публичным выступлениям", 
        date: "18 декабря 2024",
        time: "15:00 - 17:00",
        location: "Библиотека, конференц-зал",
        organizer: "Клуб ораторского искусства",
        participants: 15,
        maxParticipants: 25,
        category: "Личностный рост"
      },
      {
        id: 3,
        title: "Турнир по настольным играм",
        date: "20 декабря 2024", 
        time: "18:00 - 22:00",
        location: "Студенческий клуб",
        organizer: "Клуб настольных игр",
        participants: 40,
        maxParticipants: 50,
        category: "Развлечения"
      }
    ];

    // Имитируем загрузку с сервера
    setTimeout(() => {
      setEvents(mockEvents);
      setLoading(false);
    }, 500);
  }, []);

  return { events, loading, refetch: () => {} };
};