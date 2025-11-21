import Header from './components/Header';
import SkillGrid from './components/SkillGrid';
import Login from './pages/Login';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Register from './pages/Register';
import CreateAd from './pages/CreateAd';
import Messages from './pages/Messages';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-r from-sky-300 to-violet-200">
        <Header />
        
        <Routes>
          <Route path='/' element={
            <main className='container mx-auto px-4 py-8'>
              <h1 className='text-4xl font-bold text-center mb-6 text-gray-800'>
                Скилл свап
              </h1>
     <p className='tex         t-center text-gray-950 mb-12 max-w-2xl mx-auto text-lg leading-relaxed'>
                Обменивайся знаниями с учащимися. Программирование, музыка, языки и многое другое!
              </p>
              <SkillGrid />
            </main>
          } />
          
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/create' element={<CreateAd />} />
          <Route path='/messages' element={<Messages />} />
        </Routes>
      </div>
    </Router>
  );
}