import { Context } from "koa";
import { z } from "zod";
import * as User from "../models/users.model";

// GET /users - Retrieves a list of all users
export const getUsers = async (ctx: Context) => {
  const users = await User.getAllUsers();
  ctx.body = users;
};

// GET /users/:id - Retrieves a specific user by ID
export const getUserById = async (ctx: Context) => {
  const { id } = ctx.params;
  const user = await User.getUserById(id);
  ctx.body = user;
};

// POST /users - Creates a new user
export const createUser = async (ctx: Context) => {
  const bodySchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
  });
  const { name, email } = bodySchema.parse(ctx.request.body);
  const newUser = await User.createUser(email, name);
  ctx.status = 201;
  ctx.body = newUser;
};

// PUT /users/:id - Updates a specific user by ID
export const updateUser = async (ctx: Context) => {
  const { id } = ctx.params;
  const bodySchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
  });
  const { name, email } = bodySchema.parse(ctx.request.body);
  const updatedUser = await User.updateUser(id, name, email);
  ctx.body = updatedUser;
};

// DELETE /users/:id - Deletes a specific user by ID
export const deleteUser = async (ctx: Context) => {
  const { id } = ctx.params;
  await User.deleteUser(id);
  ctx.status = 204;
};

// GET /users/:id/messages - Retrieves all messages from a specific user
export const getUserMessages = async (ctx: Context) => {
  const bodySchema = z.object({
    email: z.string().email(),
  });
  const { email } = bodySchema.parse(ctx.request.body);
  const { id } = ctx.params;
  const userMessages = await User.getUserMessages(id, email);
  ctx.body = userMessages;
};

// GET /users/:id/players - Retrieves all players associated with a specific user
export const getUserPlayers = async (ctx: Context) => {
  const { id } = ctx.params;
  const userPlayers = await User.getUserPlayers(id);
  ctx.body = userPlayers;
};

export const sendUserMessage = async (ctx: Context) => {
  const bodySchema = z.object({
    roomId: z.string().min(1),
    message: z.string().min(1),
  });
  const { message, roomId } = bodySchema.parse(ctx.request.body);
  const { id } = ctx.params;
  const userMessage = await User.sendUserMessage(id, roomId, message);
  ctx.body = userMessage;
};
