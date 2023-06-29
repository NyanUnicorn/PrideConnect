import "./globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";
import Navbar from "./components/navbar/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PrideConnect",
  description:
    "PrideConnect is a multiplayer chatroom/gameroom, designed and built to foster a sense of community and belonging for lgbtq individuals in tech!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <div className='flex flex-col min-h-screen'>
          <Navbar />
          <main className='flex-grow py-10 px-5 bg-slate-200 m-3 mt-0 rounded-lg'>
            {children}
          </main>
          <footer className='text-center bg-[#ACC8E5] text-[#112A46] text-sm p-5 px-5 m-3 rounded-lg'>
            <p className='mb-3 text-xs'>
              &copy; <span className='hover:underline'>2023 CS Hackathon</span> |
              Theme: <span className='random-color'>Pride</span> | Team: Nyanicorn |
              Project:{" "}
              <Link href='https://github.com/NyanUnicorn/PrideConnect'>
                PrideConnect
              </Link>
            </p>
            <p>
              PrideConnect is a multiplayer chatroom/gameroom, designed and built to
              foster a sense of community and belonging for lgbtq individuals in
              tech!
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
