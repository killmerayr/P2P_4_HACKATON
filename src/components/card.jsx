export default function Card({ title, text }) {
  return (
    <div className="bg-white shadow-xl rounded-xl p-6 w-full hover:scale-105 transition-transform cursor-pointer">
      <h3 className="text-2xl font-semibold mb-2">{title}</h3>
      <p className="text-blue-600">{text}</p>
    </div>
  );
}