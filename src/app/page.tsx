import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className='h-screen'>
      <main className='flex flex-col justify-between p-6 items-center'>
        <h2 className='text-sm font-bold lg:text-xl md:text-lg sm:text-md'>
          Welcome to our group&apos;s submission
        </h2>
        <h1 className='text-4xl md:text-6xl font-bold random-color'>PrideConnect</h1>
        <Image
          src='/unicorn-rainbow.gif'
          alt='PrideConnect Logo'
          width={400}
          height={400}
        />
        <Link
          href={{
            pathname: "/login",
          }}
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
        >
          Go to Login Page
        </Link>
      </main>
    </div>
  );
}
