import Header from './components/Header';
import SkillGrid from './components/SkillGrid';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-sky-300 to-violet-200">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Заголовок с контрастом */}
        <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
          Скилл Свап
        </h1>
        
        {/* Описание */}
        <p className="text-center text-gray-950 mb-12 max-w-2xl mx-auto text-lg leading-relaxed">
          Обменивайся знаниями с учащимися. Программирование, музыка, языки и многое другое!
        </p>
        
        <SkillGrid />
      </main>
    </div>
  );
}