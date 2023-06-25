import Navbar from './components/navbar/Navbar';
import Main from './components/Main';

export default function Home() {
  return (
    <div className="h-screen">
      <header className="flex flex-col justify-between p-6">
        <Navbar />
      </header>
      <main className="flex flex-col justify-between p-6">
        <Main />
      </main>
    </div>
  );
}
