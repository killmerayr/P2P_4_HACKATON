import QueueGrid from '../components/QueueGrid';
import Header from '../components/Header';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-orange-800">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Приветствие */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Электронные очереди
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Удобное управление очередями и запись на услуги
          </p>
        </div>

        <QueueGrid />
      </main>
    </div>
  );
}