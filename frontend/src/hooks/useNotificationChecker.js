import { useEffect } from 'react';
import { useNotifications } from './useNotifications';
// import { userAPI } from '../services/api'; // ← потом раскомментируешь

export const useNotificationChecker = () => {
  const { 
    showUserRemoved, 
    showQueuePosition, 
    showEventFull 
  } = useNotifications();

  const checkNotifications = async () => {
    try {
      // ПОТОМ заменишь на реальный API
      // const response = await userAPI.getMyNotifications();
      
      // Временная заглушка для демо
      const mockNotifications = [
        // 10% шанс показать уведомление об удалении
        ...(Math.random() > 0.9 ? [{
          type: 'user_removed',
          eventTitle: 'Хакатон по веб-разработке'
        }] : []),
        // 20% шанс показать позицию в очереди
        ...(Math.random() > 0.8 ? [{
          type: 'queue_update',
          eventTitle: 'Мастер-класс по выступлениям',
          position: Math.floor(Math.random() * 10) + 1
        }] : [])
      ];

      // Обрабатываем уведомления
      mockNotifications.forEach(notification => {
        if (notification.type === 'user_removed') {
          showUserRemoved(notification.eventTitle);
        } else if (notification.type === 'queue_update') {
          showQueuePosition(notification.position, notification.eventTitle);
        }
      });

    } catch (error) {
      console.error('Failed to check notifications:', error);
    }
  };

  // Проверяем заполненность мероприятий
  const checkEventCapacity = (events) => {
    events.forEach(event => {
      if (event.participants >= event.maxParticipants) {
        showEventFull(event.title);
      }
    });
  };

  return { checkNotifications, checkEventCapacity };
};