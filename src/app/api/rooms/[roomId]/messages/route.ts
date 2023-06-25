import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { ErrorResponse } from "@/app/utils/ErrorResponse";

const prisma = new PrismaClient();

const headers = new Headers({
  "content-type": "application/json",
  "cache-control": "max-age=60, s-maxage=120",
});

const getRoomMessages = async (roomId: number) => {
  const idSchema = z.number().int().positive();

  try {
    const messages = await prisma.message.findMany({
      where: { id: idSchema.parse(roomId) },
    });

    return new NextResponse(JSON.stringify({ messages }), {
      status: 200,
      headers,
    });
  } catch (err) {
    const error = err as Error;
    return ErrorResponse(error);
  }
};

export function GET({ params: { roomId } }: { params: { roomId: number } }) {
  return getRoomMessages(roomId);
}
