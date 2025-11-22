import EventCard from './EventCard';

export default function EventGrid() {
  const events = [
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
      {events.map(event => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}