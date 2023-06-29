import Main from "@/components/Main";

export default function Home() {
  return (
    <div className='h-screen'>
      <header className='flex flex-col justify-between p-6' />
      <main className='flex flex-col justify-between p-6'>
        <Main />
      </main>
    </div>
  );
}
