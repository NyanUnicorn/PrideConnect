import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const Room = prisma.room;

// Retrieve a list of all rooms
export async function getAllRooms() {
  return Room.findMany();
}

// Retrieve a specific room by ID
export async function getRoomById(id: string) {
  return Room.findUnique({
    where: { id },
  });
}

// Create a new room
export async function createRoom(data: { name: string }) {
  return Room.create({ data });
}

// Join a specific room by ID
export async function joinRoom(roomId: string, userId: string) {
  return prisma.userRoom.create({
    data: {
      userId,
      roomId,
    },
  });
}

// Leave a specific room by ID
export async function leaveRoom(roomId: string, userId: string) {
  return prisma.userRoom.delete({
    where: {
      userId_roomId: {
        userId,
        roomId,
      },
    },
  });
}

// Delete a specific room by ID
export async function deleteRoom(id: string) {
  return Room.delete({
    where: { id },
  });
}

// Retrieve all messages in a specific room
export async function getRoomMessages(id: string) {
  return prisma.message.findMany({
    where: { roomId: id },
    orderBy: { timestamp: "asc" },
  });
}

export async function getRoomUsers(roomId: string) {
  return prisma.user.findMany({
    where: {
      rooms: {
        some: {
          id: roomId,
        },
      },
    },
  });
}
