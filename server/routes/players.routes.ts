import Router from "koa-router";
import { DefaultState, Context } from "koa";
import * as playersController from "../controllers/players.controller";

const router = new Router<DefaultState, Context>();

// GET /players - Retrieves a list of all players
router.get("/players", playersController.getPlayers);

// GET /players/:id - Retrieves a specific player by ID
router.get("/players/:id", playersController.getPlayerById);

// POST /players - Creates a new player
router.post("/players", playersController.createPlayer);

// PUT /players/:id - Updates a specific player by ID
router.put("/players/:id", playersController.updatePlayer);

// DELETE /players/:id - Deletes a specific player by ID
router.delete("/players/:id", playersController.deletePlayer);

export default router;
