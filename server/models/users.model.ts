import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const User = prisma.user;

export async function getAllUsers() {
  return User.findMany();
}

export async function getUserById(id: string) {
  const user = await User.findUnique({ where: { id } });

  if (!user) {
    throw new Error("User not found");
  }

  const userSchema = z.object({
    id: z.string(),
    name: z.string().nullable(),
    email: z.string(),
  });

  const validatedUser = userSchema.safeParse(user);

  if (validatedUser.success) {
    return validatedUser.data;
  }

  throw new Error("User validation failed");
}

export async function getUserByEmail(email: string) {
  const user = await User.findUnique({ where: { email } });
  const userSchema = z.object({
    id: z.string(),
    name: z.string().nullable(),
    email: z.string(),
  });

  const validatedUser = userSchema.safeParse(user);

  if (validatedUser.success) {
    return validatedUser.data;
  }

  throw new Error("User not found");
}

export async function createUser(email: string, name: string | undefined) {
  return User.create({
    data: {
      name,
      email,
    },
  });
}

export async function updateUser(
  id: string,
  name: string | undefined,
  email: string | undefined
) {
  return User.update({
    where: { id },
    data: {
      name,
      email,
    },
  });
}

export async function deleteUser(id: string) {
  return User.delete({
    where: { id },
  });
}

export async function getUserMessages(id: string, email?: string) {
  let user;
  if (id) {
    user = await User.findUnique({
      where: { id },
      include: { messages: true },
    });
  } else if (email) {
    user = await User.findUnique({
      where: { email },
      include: { messages: true },
    });
  } else {
    throw new Error("Invalid identifier");
  }

  return user;
}

export async function getUserPlayers(id: string) {
  return User.findUnique({
    where: { id },
    include: { Player: true },
  });
}

export async function sendUserMessage(
  userId: string,
  roomId: string,
  content: string
) {
  return prisma.message.create({
    data: {
      content,
      senderId: userId,
      roomId,
    },
  });
}
