export default function ChatSidebar({ events, activeEvent, onEventSelect }) {
  return (
    <div className="chat-sidebar text-stone-800">
      <h3>Мероприятия</h3>
      <div className="events-list text-stone-800">
        {events.map(event => (
          <div
            key={event.id}
            className={`chat-item ${activeEvent?.id === event.id ? 'active' : ''} ${event.unreadCount > 0 ? 'unread' : ''}`}
            onClick={() => onEventSelect(event)}
          >
            <div className="chat-item-header text-stone-800">
              <div className="chat-item-name text-stone-800">{event.name}</div>
              {event.unreadCount > 0 && (
                <div className="chat-item-unread text-stone-800">{event.unreadCount}</div>
              )}
            </div>
            <div className="chat-item-preview">
              {event.lastMessage || 'Нет сообщений'}
            </div>
          </div>
        ))}
      </div>
      
      {events.length === 0 && (
        <div className="no-events text-stone-800">
          <p>Нет активных мероприятий</p>
        </div>
      )}
    </div>
  );
}