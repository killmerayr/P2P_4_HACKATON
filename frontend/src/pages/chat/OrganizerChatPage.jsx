import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import ChatRoom from "../../components/ChatRoom";
import ChatSidebar from "../../components/ChatSidebar";
import "./chat.css";

export default function OrganizerChatPage() {
  const { user } = useAuth();
  const [activeEvent, setActiveEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [messages, setMessages] = useState({}); // { eventId: [messages] }

  useEffect(() => {
    loadOrganizerEvents();
  }, []);

  const loadOrganizerEvents = async () => {
    // TODO: Заменить на реальный API
    const mockEvents = [
      { 
        id: 1, 
        name: "Конференция 2024", 
        unreadCount: 3,
        lastMessage: "Когда будет расписание?" 
      },
      { 
        id: 2, 
        name: "Воркшоп по React", 
        unreadCount: 0,
        lastMessage: "Спасибо за организацию!" 
      },
      { 
        id: 3, 
        name: "Хакатон", 
        unreadCount: 7,
        lastMessage: "Нужна помощь с регистрацией" 
      }
    ];
    setEvents(mockEvents);
    setActiveEvent(mockEvents[0]);
  };

  const loadMessages = async (eventId) => {
    // TODO: Заменить на реальный API
    const mockMessages = {
      1: [
        {
          id: 1,
          text: "Когда начинается регистрация?",
          sender: 'participant',
          timestamp: new Date('2024-01-20T10:00:00'),
          read: true
        },
        {
          id: 2,
          text: "Регистрация начнется завтра в 10:00",
          sender: 'organizer',
          timestamp: new Date('2024-01-20T10:05:00'),
          read: true
        }
      ],
      2: [
        {
          id: 1,
          text: "Спасибо за отличный воркшоп!",
          sender: 'participant',
          timestamp: new Date('2024-01-19T15:30:00'),
          read: true
        }
      ],
      3: [
        {
          id: 1,
          text: "Не могу зарегистрироваться на хакатон",
          sender: 'participant',
          timestamp: new Date('2024-01-21T09:15:00'),
          read: false
        }
      ]
    };
    
    setMessages(prev => ({
      ...prev,
      [eventId]: mockMessages[eventId] || []
    }));
  };

  const sendMessage = async (text) => {
    if (!activeEvent) return;
    
    const newMessage = {
      id: Date.now(),
      text,
      sender: 'organizer',
      timestamp: new Date(),
      read: true
    };
    
    setMessages(prev => ({
      ...prev,
      [activeEvent.id]: [...(prev[activeEvent.id] || []), newMessage]
    }));
    // TODO: Отправка на сервер
  };

  const handleEventSelect = (event) => {
    setActiveEvent(event);
    if (!messages[event.id]) {
      loadMessages(event.id);
    }
  };

  return (
    <div className="organizer-chat-page text-stone-800">
      <div className="chat-header">
        <h1>Управление чатами</h1>
        <p>Отвечайте на вопросы участников</p>
      </div>

      <div className="organizer-chat-layout text-stone-800">
        <ChatSidebar 
          events={events}
          activeEvent={activeEvent}
          onEventSelect={handleEventSelect}
        />
        
        <div className="chat-main text-stone-800">
          {activeEvent ? (
            <>
              <div className="event-header font-semibold">
                <h2>{activeEvent.name}</h2>
                {activeEvent.unreadCount > 0 && (
                  <span className="unread-badge font-semibold">{activeEvent.unreadCount} новых</span>
                )}
              </div>
              
              <ChatRoom 
                messages={messages[activeEvent.id] || []}
                onSendMessage={sendMessage}
                currentUserType="organizer"
              />
            </>
          ) : (
            <div className="no-chat-selected">
              <p>Выберите мероприятие для просмотра чата</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}