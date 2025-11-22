import Header from './components/Header';
import EventGrid from './components/EventGrid';
import Home from './pages/Home';
import AllEvents from './pages/AllEvents';
import CreateEvent from './pages/CreateEvent';
import Login from './pages/Login';
import Register from './pages/Register';
import MyRegistrations from './pages/MyRegistrations';
import EventDetails from './pages/EventDetails';
import AdminPanel from './pages/AdminPanel';
import ProtectedRoute from './components/ProtectedRoute';
import { useEffect } from 'react'; // ← ДОБАВЬ ЭТОТ ИМПОРТ
import { useNotificationChecker } from './hooks/useNotificationChecker'; // ← ДОБАВЬ
import { useEvents } from './hooks/useEvents'; // ← ДОБАВЬ если нужно
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast'; // уведы


export default function App() {

  const { checkNotifications, checkEventCapacity } = useNotificationChecker();
  const { events } = useEvents(); // ← если используешь события

  useEffect(() => {
    // Проверяем уведомления при загрузке
    checkNotifications();
    
    // И каждые 30 секунд
    const interval = setInterval(checkNotifications, 30000);
    return () => clearInterval(interval);
  }, [checkNotifications]);

  // Если есть события - проверяем заполненность
  useEffect(() => {
    if (events.length > 0) {
      checkEventCapacity(events);
    }
  }, [events, checkEventCapacity]);

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-white to-yellow-300">
          <Header />
          

          {/* ↓↓↓ ДОБАВЬ ЭТОТ БЛОК ↓↓↓ */}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#1f2937',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '12px 16px',
                fontSize: '14px',
                fontWeight: '500'
              },
              success: {
                style: {
                  background: '#f0fdf4',
                  color: '#166534',
                  border: '1px solid #bbf7d0'
                },
              },
              error: {
                style: {
                  background: '#fef2f2', 
                  color: '#dc2626',
                  border: '1px solid #fecaca'
                },
              },
              loading: {
                style: {
                  background: '#fffbeb',
                  color: '#d97706',
                  border: '1px solid #fed7aa'
                },
              }
            }}
          />
          
          <Routes>
            <Route path='/' element={
              <main className='container mx-auto px-4 py-8'>
                <h1 className='text-4xl font-bold text-center mb-6 text-gray-800'>
                  Мероприятия
                </h1>
                <p className='text-center text-gray-950 mb-12 max-w-2xl mx-auto text-lg leading-relaxed'>
                  Открывай новые возможности, находи единомышленников и участвуй в событиях 
                </p>
                <EventGrid />
              </main>
            } />
            
            <Route path='/events' element={<AllEvents />} />
            
            {/* Защищенные маршруты */}
            <Route path='/create-event' element={
              <ProtectedRoute requireAdmin={true}>
                <CreateEvent />
              </ProtectedRoute>
            } />
            
            <Route path='/admin' element={
              <ProtectedRoute requireAdmin={true}>
                <AdminPanel />
              </ProtectedRoute>
            } />
            
            <Route path='/my-registrations' element={
              <ProtectedRoute>
                <MyRegistrations />
              </ProtectedRoute>
            } />
            
            {/* Публичные маршруты */}
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/events/:id' element={<EventDetails />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}