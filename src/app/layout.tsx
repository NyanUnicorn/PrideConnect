import "./globals.css";
import { Inter } from "next/font/google";
import AuthProvider from "./authProvider";
import type { Session } from "next-auth"

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PrideConnect",
  description:
    "PrideConnect is a multiplayer chatroom/gameroom, designed and built to foster a sense of community and belonging for lgbtq individuals in tech!",
};

export default function RootLayout({
  children, session
}: {
  children: React.ReactNode;
  session: Session;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider session={session}>
          { children }
        </AuthProvider>
      </body>
    </html>
  );
}
