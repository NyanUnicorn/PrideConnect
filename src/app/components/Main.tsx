"use client";

import { useSession } from "next-auth/react";
import Login from "./auth/Login";
import Game from "./Game";

export default function Main() {
  const { data: session } = useSession();
  return (
    <div className='flex justify-center items-center'>
      {!session ? <Login /> : <Game />}
    </div>
  );
}
