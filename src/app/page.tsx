import Navbar from './components/navbar/Navbar';
import Main from './components/Main';

export default function Home() {
  return (
    <>
      <header className="flex min-h-screen flex-col justify-between p-6">
        <Navbar />
      </header>
      <main className="flex min-h-screen flex-col justify-between p-6">
        <Main />
      </main>
    </>
  );
}
