import { Context } from "koa";
import { z } from "zod";
import * as PlayerModel from "../models/players.model";

// GET /players - Retrieves a list of all players
export const getPlayers = async (ctx: Context): Promise<void> => {
  const players = await PlayerModel.getAllPlayers();
  ctx.body = players;
};

// GET /players/:id - Retrieves a specific player by ID
export const getPlayerById = async (ctx: Context): Promise<void> => {
  const { id } = ctx.params;
  const player = await PlayerModel.getPlayerById(id);
  if (!player) {
    ctx.status = 404;
    ctx.body = { error: "Player not found" };
    return;
  }
  ctx.body = player;
};

// POST /players - Creates a new player
export const createPlayer = async (ctx: Context): Promise<void> => {
  const schema = z.object({
    name: z.string().min(3),
    x: z.number().optional(),
    y: z.number().optional(),
  });
  const { name, x, y } = schema.parse(ctx.request.body);
  const newPlayer = await PlayerModel.createPlayer(name, x, y);
  ctx.status = 201;
  ctx.body = newPlayer;
};

// PUT /players/:id - Updates a specific player by ID
export const updatePlayer = async (ctx: Context): Promise<void> => {
  const bodySchema = z.object({
    name: z.string().min(3).optional(),
    x: z.number().optional(),
    y: z.number().optional(),
  });
  const { id } = ctx.params;
  const { x, y } = bodySchema.parse(ctx.request.body);
  const updatedPlayer = await PlayerModel.updatePlayer(id, x, y);
  if (!updatedPlayer) {
    ctx.status = 404;
    ctx.body = { error: "Player not found" };
    return;
  }
  ctx.body = updatedPlayer;
};

// DELETE /players/:id - Deletes a specific player by ID
export const deletePlayer = async (ctx: Context): Promise<void> => {
  const { id } = ctx.params;
  await PlayerModel.deletePlayer(id);
  ctx.status = 204;
};
