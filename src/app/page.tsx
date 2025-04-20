import { Header } from "./components/Header";
import { Form } from "./components/Form";
import { Graph } from "./components/Graph";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="flex w-full justify-between">
        <Form />
        <Graph />
      </main>
    </div>
  );
}
