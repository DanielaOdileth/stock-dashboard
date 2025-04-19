import { Header } from "./components/Header";
import { Form } from "./components/Form";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="flex w-full justify-between">
        <Form />
      </main>
    </div>
  );
}
