import { Context } from "koa";
import { z } from "zod";
import * as Rooms from "../models/rooms.model";

// Retrieve a list of all rooms
export async function getAllRooms(ctx: Context) {
  const allRooms = await Rooms.getAllRooms();
  ctx.body = allRooms;
}

// Retrieve a specific room by ID
export async function getRoomById(ctx: Context) {
  const { id } = ctx.params;
  const room = await Rooms.getRoomById(id);
  if (!room) {
    ctx.status = 404;
    ctx.body = { error: "Room not found" };
    return;
  }
  ctx.body = room;
}

// Create a new room
export async function createRoom(ctx: Context) {
  const nameSchema = z.object({
    name: z.string().min(1).max(255),
  });
  const { name } = nameSchema.parse(ctx.request.body);
  const newRoom = await Rooms.createRoom({ name });
  ctx.status = 201;
  ctx.body = newRoom;
}

//  join a room
export async function joinRoom(ctx: Context) {
  const bodySchema = z.object({
    userId: z.string().uuid(),
  });
  const { id } = ctx.params;
  const { userId } = bodySchema.parse(ctx.request.body);
  await Rooms.joinRoom(id, userId);
  ctx.status = 204;
}

// leave a room
export async function leaveRoom(ctx: Context) {
  const bodySchema = z.object({
    userId: z.string().uuid(),
  });
  const { id } = ctx.params;
  const { userId } = bodySchema.parse(ctx.request.body);
  await Rooms.leaveRoom(id, userId);
  ctx.status = 204;
}

// Delete a specific room by ID
export async function deleteRoom(ctx: Context) {
  const { id } = ctx.params;
  await Rooms.deleteRoom(id);
  ctx.status = 204;
}

// Retrieve all messages in a specific room
export async function getRoomMessages(ctx: Context) {
  const { id } = ctx.params;
  const messages = await Rooms.getRoomMessages(id);
  ctx.body = messages;
}

// Retrieve all users in a specific room
export async function getRoomUsers(ctx: Context) {
  const { id } = ctx.params;
  const users = await Rooms.getRoomUsers(id);
  ctx.body = users;
}
