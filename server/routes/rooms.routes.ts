import Router from "koa-router";
import { DefaultState, Context } from "koa";
import * as roomsController from "../controllers/rooms.controller";

const router = new Router<DefaultState, Context>();

// GET /rooms - Retrieves a list of all rooms
router.get("/rooms", roomsController.getAllRooms);

// GET /rooms/:id - Retrieves a specific room by ID
router.get("/rooms/:id", roomsController.getRoomById);

// POST /rooms - Creates a new room
router.post("/rooms", roomsController.createRoom);

// PUT /rooms/:id - Updates a specific room by ID
router.put("/rooms/:id", roomsController.joinRoom);

// Delete /rooms/:id/leave - Leaves a specific room by ID
router.put("/rooms/:id/leave", roomsController.leaveRoom);

// DELETE /rooms/:id - Deletes a specific room by ID
router.delete("/rooms/:id", roomsController.deleteRoom);

// GET /rooms/:id/messages - Retrieves all messages in a specific room
router.get("/rooms/:id/messages", roomsController.getRoomMessages);

// GET /rooms/:id/users - Retrieves all users in a specific room
router.get("/rooms/:id/users", roomsController.getRoomUsers);

export default router;
