import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { ErrorResponse } from "@/app/utils/ErrorResponse";

const prisma = new PrismaClient();

const headers = new Headers({
  "content-type": "application/json",
  "cache-control": "max-age=60, s-maxage=120",
});

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
  } catch (err) {
    const error = err as Error;
    return ErrorResponse(error);
  }
};

export function GET({ params: { roomId } }: { params: { roomId: number } }) {
  return getRoomById(roomId);
}
