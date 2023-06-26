import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const Player = prisma.player;

// get all players from database
export async function getAllPlayers() {
  return Player.findMany();
}

// get specific player from database by ID
export async function getPlayerById(id: string) {
  return Player.findUnique({
    where: { id },
  });
}

// create a new player
export async function createPlayer(
  userId: string,
  x: number | undefined,
  y: number | undefined
) {
  const newPlayer = await prisma.player.create({
    data: {
      user: { connect: { id: userId } },
      x,
      y,
    },
  });
  return newPlayer;
}

export async function updatePlayer(
  id: string,
  x: number | undefined,
  y: number | undefined
) {
  const updatedPlayer = await prisma.player.update({
    where: { id },
    data: { x, y },
  });
  return updatedPlayer;
}

// Example server call to delete a player
export async function deletePlayer(id: string) {
  const deletedPlayer = await prisma.player.delete({
    where: { id },
  });
  return deletedPlayer;
}
