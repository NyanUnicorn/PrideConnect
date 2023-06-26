import { WebSocket } from "ws";
import { Logger } from "pino";
import { z } from "zod";
import * as Room from "../models/rooms.model";
import * as User from "../models/users.model";

/**
 * Global Variables
 */

const state = {
  roomClientsMap: new Map<string, WebSocket[]>(),
};

const currentUserSchema = z.object({
  email: z.string().email(),
  id: z.string().cuid(),
  name: z.string().optional(),
});

const sendSocketMessage = (ws: WebSocket, type: string, payload: any) => {
  ws.send(JSON.stringify({ type, payload }));
};

// initiate first handshake
const handleConnect = async (ws: WebSocket, logger: Logger, payload: any) => {
  const { email, room, user } = payload;
  sendSocketMessage(ws, "welcome", "Welcome to the Game!");

  const currentUser = currentUserSchema.parse(await User.getUserByEmail(email));

  ws.on("close", () => {
    logger.info("User disconnected");
    handleCloseConnection(ws, currentUser.currentRoom);
  });

  handleNewConnection(ws, currentUser.currentRoom);

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

const handleJoinRoom = async (
  ws: WebSocket,
  logger: Logger,
  payload: any,
  currentUser: any
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

const getConnectedClientsInRoom = (room: string): WebSocket[] =>
  state.roomClientsMap.get(room) || [];

const broadcastMessageToRoom = (room: string, type: string, payload: any) => {
  // Retrieve all connected clients in the room
  const clients = getConnectedClientsInRoom(room);

  // Send the message to each connected client in the room
  clients.forEach((client) => {
    sendSocketMessage(client, type, payload);
  });
};

const handleSendMessage = async (
  ws: WebSocket,
  logger: Logger,
  payload: any,
  currentUser: any
) => {
  const { message, room } = payload;

  // Save the message to the database
  const newMessage = await User.sendUserMessage(currentUser.id, room, message);
  logger.info("New message created");

  // Broadcast the new message to all users in the room
  broadcastMessageToRoom(room, "message", newMessage);

  return newMessage;
};

const handleNewConnection = (ws: WebSocket, room: string): void => {
  // Add the client to the room's list of connected clients
  const clients = state.roomClientsMap.get(room) || [];
  clients.push(ws);
  state.roomClientsMap.set(room, clients);
};

const handleCloseConnection = (ws: WebSocket, room: string): void => {
  // Remove the client from the room's list of connected clients
  const clients = state.roomClientsMap.get(room) || [];
  const updatedClients = clients.filter((client) => client !== ws);
  state.roomClientsMap.set(room, updatedClients);
};

const handleSocketEvents = (ws: WebSocket, logger: Logger, user: string) => {
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
        currentUser = await handleConnectAndNewConnection(
          ws,
          logger,
          message.payload
        );
        break;
      case "join":
        await handleJoin(ws, logger, message.payload, currentUser);
        break;
      case "sendMessage":
        await handleSendMessage(ws, logger, message.payload, currentUser);
        break;
      default:
        logger.warn(`Unhandled event type: ${message.type}`);
        break;
    }
  });

  ws.on("error", (error) => {
    logger.error(`WebSocket error: ${error}`);
  });
};

export default handleSocketEvents;
