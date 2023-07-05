"use client";

import { Input, Button, Typography } from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { Logger } from "../utils/Logger";

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [message, setMessage] = useState<string>(""); // TODO: [optional] Implement a message to show to the user if the login fails.

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/signup", {
        name,
        email,
        password,
      });

      Logger.info(response);

      if (response.ok) {
        router.push("/game"); // Redirect to the dashboard or any other protected page
      } else if (response.status === 400) {
        Logger.error("Invalid username or password");
        setMessage("Invalid username or password");
      } else {
        const data = await response.json();
        Logger.error(data.message); // Display the error message
      }
    } catch (error: unknown) {
      Logger.error(error.message);
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("Unknown error");
      }
    }
  };

  return (
    <div className='inline-flex flex-col items-center bg-white rounded-md border-2 border-black py-7 px-20 mx-auto space-y-2'>
      <Typography variant='h6'>Sign up!!!</Typography>

      <div className='space-y-2 flex flex-col items-center'>
        <Input label='Email' onChange={(e) => setEmail(e.target.value)} />
        <Input label='Password' onChange={(e) => setPassword(e.target.value)} />
        <Input label='Name' onChange={(e) => setName(e.target.value)} />
        <Button size='sm' onClick={handleSubmit}>
          Submbit
        </Button>
      </div>
    </div>
  );
}
