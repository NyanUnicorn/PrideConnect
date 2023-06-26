import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const User = prisma.user;

export async function getAllUsers() {
  return User.findMany();
}

export async function getUserById(id: string) {
  const user = await User.findUnique({ where: { id } });
  if (!user) throw new Error("User not found");
  return user;
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
