export default function SkillGrid() {
  const skills = [
    {
      id: 1,
      title: "Программирование",
      description: "Научу с нуля, трахну в rote",
      category: "Программирование", 
      author: "Мистер Писькин",
      wantsToLearn: "Игра на попке"
    },
    {
      id: 2,
      title: "Музыка", 
      description: "Покажу базовые аккорды, биг бой",
      category: "Музыка",
      author: "Маленький Антон",
      wantsToLearn: "Английский язык"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {skills.map(skill => (
        <div 
          key={skill.id} 
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 
                     transition-all duration-300 hover:scale-105 hover:shadow-xl 
                     cursor-pointer"
        >
          <span className="inline-block bg-blue-100 text-blue-600 text-sm px-3 py-1 rounded-full mb-3 font-medium">
            {skill.category}
          </span>
          
          <h3 className="text-xl font-bold text-gray-800 mb-3">{skill.title}</h3>
          <p className="text-gray-600 mb-4 leading-relaxed">{skill.description}</p>
          
          <div className="border-t border-gray-100 pt-4">
            <p className="text-sm text-gray-700 mb-2">
              <strong>Хочу научиться:</strong> {skill.wantsToLearn}
            </p>
            <p className="text-sm text-gray-500">
              Автор: {skill.author}
            </p>
          </div>
          
          <button className="w-full mt-4 bg-green-500 text-white py-3 rounded-lg 
                           hover:bg-green-600 transition-colors font-semibold 
                           shadow-md hover:shadow-md">
            Предложить обмен
          </button>
        </div>
      ))}
    </div>
  );
}