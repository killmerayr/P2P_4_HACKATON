import toast from 'react-hot-toast';

export const useNotifications = () => {
  const showSuccess = (message) => {
    toast.success(message);
  };

  const showError = (message) => {
    toast.error(message);
  };

  const showLoading = (message) => {
    return toast.loading(message);
  };

  const showInfo = (message) => {
    toast(message, {
      icon: 'ℹ️',
    });
  };

  const showWarning = (message) => {
    toast(message, {
      icon: '⚠️',
      style: {
        background: '#fffbeb',
        color: '#d97706',
        border: '1px solid #fed7aa'
      }
    });
  };

  // Специфичные уведомления
  const showUserRemoved = (eventTitle) => {
    showWarning(`🚫 Вы были удалены с мероприятия "${eventTitle}"`);
  };

  const showQueuePosition = (position, eventTitle) => {
    showInfo(`🎯 Ваша очередь на "${eventTitle}": ${position} место`);
  };

  const showEventFull = (eventTitle) => {
    showWarning(`📋 "${eventTitle}" - мест нет. Вы в листе ожидания`);
  };

  return {
    showSuccess,
    showError,
    showLoading,
    showInfo,
    showWarning,
    showUserRemoved,
    showQueuePosition,
    showEventFull
  };
};