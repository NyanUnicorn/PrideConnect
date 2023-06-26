import Router from "koa-router";
import { DefaultState, Context } from "koa";
import * as userController from "../controllers/users.controller";

const router = new Router<DefaultState, Context>();

// User Routes
router.get("/users", userController.getUsers);
router.get("/users/:id", userController.getUserById);
router.post("/users", userController.createUser);
router.put("/users/:id", userController.updateUser);
router.delete("/users/:id", userController.deleteUser);
router.get("/users/:id/messages", userController.getUserMessages);
router.put("/users/:id/messages", userController.sendUserMessage);
router.get("/users/:id/players", userController.getUserPlayers);

export default router;
