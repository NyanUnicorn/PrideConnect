// import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next';
import { z } from 'zod';

const prisma = new PrismaClient();

export const config = {
  runtime: 'edge',
};

const headers = new Headers({
  'content-type': 'application/json',
  'cache-control': 'max-age=60, s-maxage=120',
});

// Error handler lol
const ErrorResponse = (error, status = 500) =>
  new NextResponse(
    {
      error,
    },
    {
      status,
      headers,
    }
  );

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
          'content-type': 'application/json',
          'cache-control': 'max-age=60, s-maxage=120',
        }),
      }
    );
  } catch (error) {
    return ErrorResponse(error);
  }
};

export function GET(req: NextRequest) {
  const idSchema = z.object({
    id: z.number().int(),
  });

  try {
    const validateData = idSchema.parse(req.query);
    const { id } = validateData;

    if (!id) {
      return getAllRoomIds();
    }

    return getRoomById(req);
  } catch (error) {
    return ErrorResponse(error, 400);
  }
}

const createRoom = async (req) => {
  const createRoomSchema = z.object({
    name: z.string(),
  });

  const roomData = createRoomSchema.parse(req.body);

  try {
    const room = await prisma.room.create({
      data: roomData,
    });

    return new NextResponse(JSON.stringify({ room }), {
      status: 201,
      headers,
    });
  } catch (error) {
    return ErrorResponse(error);
  }
};

export function POST(req: NextRequest) {
  return createRoom(req);
}

const updateRoom = async (req) => {
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
  } catch (error) {
    return ErrorResponse(error);
  }
};

export function PUT(req: NextRequest) {
  return updateRoom(req);
}

const deleteRoom = async (req) => {
  const { id } = idSchema.parse(req.query);

  try {
    await prisma.room.delete({
      where: { id },
    });

    return new NextResponse(
      JSON.stringify({ message: 'Room deleted successfully' }),
      {
        status: 200,
        headers,
      }
    );
  } catch (error) {
    return ErrorResponse(error);
  }
};

export function DELETE(req: NextRequest) {
  return deleteRoom(req);
}
