import { useRef, useEffect } from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

export default function ChatRoom({ messages, onSendMessage, currentUserType }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (text) => {
    if (text.trim()) {
      onSendMessage(text.trim());
    }
  };

  return (
    <div className="chat-room">
      <div className="messages-container text-stone-800">
        <MessageList 
          messages={messages} 
          currentUserType={currentUserType}
        />
        <div ref={messagesEndRef} />
      </div>
      
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
}