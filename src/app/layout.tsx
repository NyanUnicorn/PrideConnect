import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PrideConnect",
  description:
    "PrideConnect is a multiplayer chatroom/gameroom, designed and built to foster a sense of community and belonging for lgbtq individuals in tech!",
};

<<<<<<< HEAD
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
=======
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
>>>>>>> dev
      <body className={inter.className}>{children}</body>
    </html>
  );
}
