import { useState } from 'react';

export default function MessageInput({ onSendMessage }) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="message-input-container bg-white">
      <form onSubmit={handleSubmit} className="message-input-form bg-white">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Введите сообщение..."
          className="message-input"
        />
        <button 
          type="submit" 
          className="send-button"
          disabled={!message.trim()}
        >
          Отправить
        </button>
      </form>
    </div>
  );
}