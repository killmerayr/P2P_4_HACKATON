import EventGrid from '../components/EventGrid';
import Header from '../components/Header';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-orange-800">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Приветствие */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Мероприятия
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Открывай новые возможности, находи единомышленников и участвуй в событиях университета
          </p>
        </div>

        <EventGrid />
      </main>
    </div>
  );
}