"use client";

import cookieCutter from "cookie-cutter";
import Login from "./auth/Login";
import Game from "./Game";

export default function Main() {
  const playerName = cookieCutter.get("playerName");

  return (
    <div className='flex justify-center items-center'>
      {!playerName ? <Login /> : <Game />}
    </div>
  );
}
