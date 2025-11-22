import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-yellow-300 flex items-center justify-center">
        <div className="text-2xl">Загрузка...</div>
      </div>
    );
  }

  if (!user) {
    // Если пользователь не авторизован - редирект на логин
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user.role !== 'admin') {
    // Если требуется админ, но пользователь не админ
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-yellow-300 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Доступ запрещен</h1>
          <p className="text-gray-600 mb-4">Только организаторы могут создавать мероприятия</p>
          <a href="/" className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition">
            На главную
          </a>
        </div>
      </div>
    );
  }

  return children;
}
