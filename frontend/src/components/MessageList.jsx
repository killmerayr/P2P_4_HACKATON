export default function MessageList({ messages, currentUserType }) {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="messages-list text-stone-800">
      {messages.length === 0 ? (
        <div className="no-messages text-stone-800">
          <p>Пока нет сообщений. Начните общение!</p>
        </div>
      ) : (
        messages.map(message => (
          <div
            key={message.id}
            className={`message ${message.sender}`}
          >
            <p className="message-content text-stone-800">{message.text}</p>
            <div className="message-time text-stone-800">
              {formatTime(message.timestamp)}
            </div>
          </div>
        ))
      )}
    </div>
  );
}