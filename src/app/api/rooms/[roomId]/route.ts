import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const { roomId } = req.query;

const getRoomById = async (id: number) => {
  const idSchema = z.number().int().positive();

  try {
    const room = await prisma.room.findUnique({
      where: { id: idSchema.parse(id) },
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
