import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import ChatRoom from "../../components/ChatRoom"; // ← Импорт напрямую
import ChatSidebar from "../../components/ChatSidebar"; // ← Импорт напрямую
import "./chat.css";

export default function ParticipantChatPage() {
  const { eventId } = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    loadMessages();
  }, [eventId]);

  const loadMessages = async () => {
    const mockMessages = [
      {
        id: 1,
        text: "Добро пожаловать в чат мероприятия! Задавайте вопросы организатору.",
        sender: 'organizer',
        timestamp: new Date(),
        read: true
      }
    ];
    setMessages(mockMessages);
  };

  const sendMessage = async (text) => {
    const newMessage = {
      id: Date.now(),
      text,
      sender: 'participant',
      timestamp: new Date(),
      read: false
    };
    setMessages(prev => [...prev, newMessage]);
    // TODO: Отправка на сервер
  };

  return (
    <div className="chat-page text-stone-800">
      <div className="chat-header text-stone-800">
        <h1>Чат мероприятия</h1>
        <p>Общайтесь с организатором</p>
      </div>
      
      <ChatRoom 
        messages={messages}
        onSendMessage={sendMessage}
        currentUserType="participant"
      />
    </div>
  );
}