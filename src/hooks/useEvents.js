import { useState, useEffect } from 'react';
import { eventAPI } from '../services/api'; // ← РАСКОММЕНТИРОВАТЬ

export const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadEvents = async () => {
    try {
      const response = await eventAPI.getAllEvents();
      setEvents(response.data);
    } catch (error) {
      console.error('API Error:', error);
      // Временная заглушка если API не отвечает
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
        }
      ];
      setEvents(mockEvents);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  return { events, loading, refetch: loadEvents };
};