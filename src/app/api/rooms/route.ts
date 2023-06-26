import { PrismaClient } from "@prisma/client";
import { ErrorResponse } from "@/app/utils/ErrorResponse";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";

const prisma = new PrismaClient();

export const config = {
  runtime: "edge",
};

const headers = new Headers({
  "content-type": "application/json",
  "cache-control": "max-age=60, s-maxage=120",
});

const getAllRoomIds = async () => {
  try {
    const listRoomIds = await prisma.room.findMany({
      select: {
        id: true,
      },
    });

    return new NextResponse(
      JSON.stringify({
        listRoomIds,
      }),
      {
        status: 200,
        headers: new Headers({
          "content-type": "application/json",
          "cache-control": "max-age=60, s-maxage=120",
        }),
      }
    );
  } catch (err) {
    const error = err as Error;
    return ErrorResponse(error);
  }
};

/**
 *  GET /api/rooms
 * @summary Get all room IDs
 * @tags rooms
 * @return {array<RoomIds>} 200 - List of room IDs
 */
export function GET() {
  try {
    return getAllRoomIds();
  } catch (err) {
    const error = err as Error;
    return ErrorResponse(error, 400);
  }
}

/**
 * createRoom() : Create a new room with a name, id autogenerated ideally
 * @property {string} name.required - Room name
 * @returns {id} 201 - Room ID
 */
const createRoom = async (req: NextRequest) => {
  const createRoomSchema = z.object({
    name: z.string(),
  });

  const roomData = createRoomSchema.parse(req.body);

  try {
    const roomId = await prisma.room.create({
      data: roomData,
    });

    return new NextResponse(JSON.stringify({ roomId }), {
      status: 201,
      headers,
    });
  } catch (err) {
    const error = err as Error;
    return ErrorResponse(error);
  }
};

export function POST(req: NextRequest) {
  return createRoom(req);
}

const updateRoom = async (req: NextRequest) => {
  const updateRoomSchema = z.object({
    id: z.number().int(),
    name: z.string().optional(),
    // include other room properties here as needed
  });
  const roomData = updateRoomSchema.parse(req.body);

  try {
    const room = await prisma.room.update({
      where: { id: roomData.id },
      data: roomData,
    });

    return new NextResponse(JSON.stringify({ room }), {
      status: 200,
      headers,
    });
  } catch (err) {
    const error = err as Error;
    return ErrorResponse(error);
  }
};

export function PUT(req: NextRequest) {
  return updateRoom(req);
}

const deleteRoom = async (data: { id: number }) => {
  const idSchema = z.object({
    id: z.number().int(),
  });

  try {
    await prisma.room.delete({
      where: { id: idSchema.parse(data).id },
    });

    return new NextResponse(
      JSON.stringify({ message: "Room deleted successfully" }),
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

export async function DELETE(request: NextRequest) {
  const data = await request.json();
  return deleteRoom(data);
}
