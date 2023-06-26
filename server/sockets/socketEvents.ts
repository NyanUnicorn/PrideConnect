import { WebSocket } from "ws";
import { Logger } from "pino";
import { z } from "zod";
import * as Room from "../models/rooms.model";
import * as User from "../models/users.model";

/**
 * Global Variables
 */

const state = {
  userActiveRooms: [],
  currentUser: null,
  currentRoom: null,
  messages: [],
  messageQueue: [],
  currentRoomUsers: [],
};

const currentUserSchema = z.object({
  email: z.string().email(),
  id: z.string().cuid(),
  name: z.string().optional(),
});

const sendSocketMessage = (ws: WebSocket, type: string, payload: any) => {
  ws.send(JSON.stringify({ type, payload }));
};

const handleConnect = async (ws: WebSocket, payload: any) => {
  const { email } = payload;
  sendSocketMessage(ws, "welcome", "Welcome to the Game!");

  return currentUserSchema.parse(await User.getUserByEmail(email));
};

const handleJoin = async (
  ws: WebSocket,
  logger: Logger,
  payload: any,
  currentUser: string
) => {
  const { room, user } = payload;

  // Join the user to the room
  const foundRoom = await Room.joinRoom(room, currentUser.id);

  if (foundRoom === null) {
    const status = await Room.createRoom({ name: room });
    logger.info(`New room created: ${status}`);
  }

  const foundMessages = await Room.getRoomMessages(room);

  sendSocketMessage(ws, "messageHistory", foundMessages);
  sendSocketMessage(ws, "userJoined", `${user} has joined the room.`);

  return room;
};

const handleSendMessage = async (
  ws: WebSocket,
  logger: Logger,
  payload: any,
  currentUser: any
) => {
  const { message, room } = payload;

  const newMessage = await User.sendUserMessage(currentUser.id, room, message);
  logger.info("New message created");

  return newMessage;
};

const handleReceiveMessage = async (
  ws: WebSocket,
  logger: Logger,
  payload: any,
  currentUser: any
) => {
  sendSocketMessage(ws, "message", payload);

  logger.info(`Received: ${payload}`);
  return payload;
};

const handleSocketEvents = (ws: WebSocket, logger: Logger) => {
  let currentRoom: string;
  let currentUser: z.infer<typeof currentUserSchema>;

  ws.on("message", async (data: string) => {
    let message: { type: string; payload: any };

    try {
      message = JSON.parse(data);
    } catch (error) {
      logger.error(`Error parsing message: ${error}`);
      return;
    }

    switch (message.type) {
      case "connect":
        currentUser = await handleConnect(ws, message.payload);
        break;
      case "join":
        currentRoom = await handleJoin(ws, logger, message.payload, currentUser);
        break;
      case "sendMessage":
        await handleSendMessage(ws, logger, message.payload, currentUser);
        break;
      case "receiveMessage":
        await handleReceiveMessage(ws, logger, message.payload, currentUser);
        break;
      default:
        logger.warn(`Unhandled event type: ${message.type}`);
        break;
    }
  });

  ws.on("close", () => {
    logger.info("User disconnected");
  });

  ws.on("error", (error) => {
    logger.error(`WebSocket error: ${error}`);
  });
};
export default handleSocketEvents;
