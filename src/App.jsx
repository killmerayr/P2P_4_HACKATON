import Header from './components/Header';
import EventGrid from './components/EventGrid';
import Home from './pages/Home';
import AllEvents from './pages/AllEvents';
import CreateEvent from './pages/CreateEvent';
import Login from './pages/Login';
import Register from './pages/Register';
import MyRegistrations from './pages/MyRegistrations';
import EventDetails from './pages/EventDetails';
import AdminPanel from './pages/AdminPanel'; // ← исправь название файла
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-white to-yellow-300">
          <Header />
          
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
            <Route path='/create-event' element={<CreateEvent />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/my-registrations' element={<MyRegistrations />} />
            <Route path='/events/:id' element={<EventDetails />} />
            <Route path='/admin' element={<AdminPanel />} /> {/* ← ДОБАВЬ ЭТУ СТРОЧКУ */}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}