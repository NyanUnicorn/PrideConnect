import Game from "@/components/Game";

export default function Page() {
  return (
    <div className='h-screen'>
      <main className='flex flex-col justify-between p-6'>
        <Game />
      </main>
    </div>
  );
}
