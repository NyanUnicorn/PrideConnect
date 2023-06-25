import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const getRoomMessages = async (req) => {
  const idSchema = z.object({
    id: z.number().int(),
  });

  const { id } = idSchema.parse(req.params);

  try {
    const messages = await prisma.message.findMany({
      where: { roomId: id },
    });

    return new NextResponse(JSON.stringify({ messages }), {
      status: 200,
      headers,
    });
  } catch (error) {
    return ErrorResponse(error);
  }
};

export function GET() {
  return getRoomMessages(req);
}
