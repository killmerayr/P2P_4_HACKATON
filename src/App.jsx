import Card from "./components/Card";

const items = [
  { title: "Project 1", text: "first project" },
  { title: "Project 2", text: "second project" },
  { title: "Project 3", text: "third project" },
];

export default function App() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center p-10 gap-8 bg-blue-600">
      <h1 className="text-4xl font-bold">Projects</h1>

      <div className="flex flex-wrap gap-6 justify-center max-w-6xl">
        {items.map((item, index) => (
          <Card key={index} title={item.title} text={item.text} />
        ))}
      </div>
    </div>
  );
}