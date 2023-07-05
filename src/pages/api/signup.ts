// pages/api/signup.ts

import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import { z } from "zod";
import { Logger } from "@/app/utils/Logger";

const prisma = new PrismaClient();

const signupSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  password: z.string(),
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
  Logger.info(`Request body: ${JSON.stringify(req.body)}`);
  const { email, name, password } = signupSchema.parse(req.body);

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    Logger.error(`User with email ${email} already exists.`);
    return res.status(400).json({ message: "User with this email already exists." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
    },
  });

  // You may also want to create a session for the newly signed up user.
  // If you do, uncomment the lines below.

  req.session.set("user", {
    id: user.id,
    name: user.name,
  });

  await req.session.save();

  res.json({ message: "Signup successful", id: user.id });
};
