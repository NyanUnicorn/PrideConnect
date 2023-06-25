import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const { roomId } = req.query;

const getRoomById = async (id: number) => {
  try {
    const room = await prisma.room.findUnique({
      where: { id },
    });

    return new NextResponse(
      JSON.stringify({
        room,
      }),
      {
        status: 200,
        headers,
      }
    );
  } catch (error) {
    return ErrorResponse(error);
  }
};

export function GET() {
  return getRoomById(roomId);
}
