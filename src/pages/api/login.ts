// pages/api/login.ts

import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import { z } from "zod";
import withSession from "../../lib/session";

const prisma = new PrismaClient();

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export default withSession(async (req: NextApiRequest, res: NextApiResponse) => {
  const { username, password } = loginSchema.parse(req.body);

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    return res.status(400).json({ message: "No user found" });
  }

  const isCorrect = await bcrypt.compare(password, user.password);

  if (!isCorrect) {
    return res.status(400).json({ message: "Invalid password" });
  }

  // The password was correct, set user in session
  req.session.set("user", {
    id: user.id,
    admin: user.admin, // Assuming your user model has an 'admin' property
  });

  await req.session.save();

  res.json(user);
});
