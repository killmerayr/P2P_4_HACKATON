import toast from 'react-hot-toast';
import React from 'react';

export const useNotifications = () => {
  const renderToast = (message, type = "default") => {
    toast.custom((t) => {
      const base = "rounded-xl shadow-md border px-4 py-3 flex items-center gap-4";

      const theme = {
        default: "bg-white border-gray-300 text-gray-900",
        success: "bg-green-50 border-green-300 text-green-800",
        error: "bg-red-50 border-red-300 text-red-700",
        warning: "bg-yellow-50 border-yellow-300 text-yellow-800",
        info: "bg-blue-50 border-blue-300 text-blue-800"
      };

      return React.createElement(
        "div",
        { className: `${base} ${theme[type]}` },
        React.createElement("span", { className: "font-medium" }, message),
        React.createElement(
          "button",
          {
            onClick: () => toast.dismiss(t.id),
            className: "ml-auto text-gray-600 hover:text-red-500 transition"
          },
          "✕"
        )
      );
    });
  };

  const showSuccess = (message) => renderToast(message, "success");
  const showError = (message) => renderToast(message, "error");
  const showWarning = (message) => renderToast(message, "warning");
  const showInfo = (message) => renderToast(message, "info");

  const showLoading = (message) => toast.loading(message);

  const showUserRemoved = (eventTitle) =>
    showWarning(`🚫 Вы были удалены с мероприятия "${eventTitle}"`);

  const showQueuePosition = (position, eventTitle) =>
    showInfo(`🎯 Ваша очередь на "${eventTitle}": ${position} место`);

  const showEventFull = (eventTitle) =>
    showWarning(`📋 "${eventTitle}" — мест нет. Вы в листе ожидания`);

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
