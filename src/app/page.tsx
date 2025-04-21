import { Header } from "./components/Header";
import { Form } from "./components/Form";
import { Graph } from "./components/Graph";
import { StockSocketManager } from "./components/Graph/StockGraphManager";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-800 text-white">
      <StockSocketManager />
      <Header />
      <main className="flex flex-col xl:flex-row w-full justify-between py-10 items-center">
        <Form />
        <Graph />
      </main>
    </div>
  );
}
