import Image from "next/image";
import Navbar from "./components/navbar/Navbar";

export default function Home() {
  return (
    <>
      <header className="flex min-h-screen flex-col justify-between p-6">
        <Navbar />
      </header>
      <main className="flex min-h-screen flex-col justify-between p-6">
        <></>
      </main>
    </>
  );
}
