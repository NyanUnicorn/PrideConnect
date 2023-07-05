"use client";

import { Input, Button } from "@material-tailwind/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import pino from "pino";

const logger = pino;

export default function Page() {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState(""); // TODO: [optional] Implement a message to show to the user if the login fails.
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    if (response.ok) {
      router.push("/game"); // Redirect to the dashboard or any other protected page
    } else if (response.status === 400) {
      // TODO: Show a message to the user saying "Invalid username or password"
    } else {
      const data = await response.json();
      logger.error(data.message); // Display the error message
    }
  };

  return (
    <div className='inline-flex flex-col items-center bg-white rounded-md border-2 border-black p-3 mx-auto space-y-2'>
      <h1>Please enter your username and password</h1>
      {username} {password}
      <div className='space-y-4 flex flex-col items-center'>
        <Input label='Username' onChange={(e) => setUsername(e.target.value)} />
        <Input label='Password' onChange={(e) => setPassword(e.target.value)} />
        <div className='space-x-2'>
          <Button
            size='md'
            className='py-2 px-6 text-sm hover:bg-slate-500'
            onClick={handleLogin}
          >
            Login
          </Button>
          <Button
            size='md'
            className='py-2 px-6 text-sm hover:bg-slate-500'
            onClick={() => router.push("/signup")}
          >
            Signup
          </Button>
        </div>
      </div>
    </div>
  );
}
