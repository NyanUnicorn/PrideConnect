import { WebSocket } from "ws";
import { Logger } from "pino";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { z } from "zod";
import * as Room from "../models/rooms.model";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as User from "../models/users.model";

// Schema
const messageSchema = z.object({
  id: z.string(),
  content: z.string(),
  timestamp: z.date(),
  senderId: z.string(),
  roomId: z.string(),
});

// helpers
const sendSocketMessage = (ws: WebSocket, type: string, payload: unknown) => {
  ws.send(JSON.stringify({ type, payload }));
};

const handleUserListRooms = async (ws: WebSocket) => {
  // Send a list of rooms to the user
  const rooms = await Room.getAllRooms();
  if (!rooms.length) {
    const defaultRoom = await Room.createRoom({ name: "general" });
    return [defaultRoom];
  }

  sendSocketMessage(ws, "listRooms", { rooms });
  return rooms;
};

const handleListUsersInRoom = (ws: WebSocket, user: string, room: string, roomClientsMap: Map<string, Set<WebSocket>>) => {
  // Get list of users in room
  const users = Room.getRoomUsers(room);
  sendSocketMessage(ws, "listUsersInRoom", { room, users });
};

// handlers
const handleUserJoinRoom = async (ws: WebSocket, user: string, room: string, roomClientsMap: Map<string, Set<WebSocket>>) => {
  // Add user to the room
  await Room.joinRoom(room, user);

  // add to roomClientsMap
  if (!roomClientsMap.has(room)) {
    roomClientsMap.set(room, new Set());
  }

  // Add user to room
  roomClientsMap.get(room)?.add(ws);

  // Notify room users that user has joined
  roomClientsMap.get(room)?.forEach((client) => {
    if (client !== ws && client.readyState === WebSocket.OPEN) {
      sendSocketMessage(client, "userJoinRoom", { room, user });
    }
  });

  // Send back a confirmation to the user that they have joined the room
  sendSocketMessage(ws, "joinRoom", { room, user });
};

const handleUserLeaveRoom = async (ws: WebSocket, user: string, room: string, roomClientsMap: Map<string, Set<WebSocket>>) => {
  // Remove user from the room
  roomClientsMap.get(room)?.delete(ws);
  await Room.leaveRoom(room, user);
};

const handleUserSendMessage = async (
  ws: WebSocket,
  user: string,
  payload: { message: z.infer<typeof messageSchema>; room: string },
  roomClientsMap: Map<string, Set<WebSocket>>
) => {
  // Send message to all users in the room
  roomClientsMap.get(payload.room)?.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      sendSocketMessage(client, "message", payload.message);
    }
  });
};

const handleUserConnection = async (ws: WebSocket, user: string, roomClientsMap: Map<string, Set<WebSocket>>) => {
  // Send a list of rooms to the user
  const rooms = await handleUserListRooms(ws);

  if (!roomClientsMap) {
    roomClientsMap = new Map();
  }

  // Join room
  await handleUserJoinRoom(ws, user, rooms[0].id, roomClientsMap);
};

// handle chat events

const handleChatSocketEvents = async (
  logger: Logger,
  ws: WebSocket,
  roomClientsMap: Map<string, Set<WebSocket>>
) => {
  ws.on("message", async (data: string) => {
    const dataSchema = z.object({
      type: z.string(),
      payload: z.object({
        user: z.string(),
        room: z.string().optional(),
        message: messageSchema.optional(),
      }),
    });

    let parsedData;

    try {
      parsedData = dataSchema.parse(JSON.parse(data));
    } catch (error) {
      logger.error(`Error parsing message: ${error}`);
      return;
    }

    switch (parsedData.type) {
      case "connect":
        // Handle user connection
        await handleUserConnection(ws, parsedData.payload.user as string, roomClientsMap);
        break;

      case "joinRoom":
        // Handle user joining a room
        await handleUserJoinRoom(
          ws,
          parsedData.payload.user as string,
          parsedData.payload.room as string,
          roomClientsMap
        );
        break;

      case "leaveRoom":
        // Handle user leaving a room
        await handleUserLeaveRoom(
          ws,
          parsedData.payload.user as string,
          parsedData.payload.room as string,
          roomClientsMap
        );
        break;

      case "sendMessage":
        // Handle user sending a message
        if (!parsedData.payload.room || !parsedData.payload.message) {
          logger.error("Room or message missing from payload");
        }
        await handleUserSendMessage(ws, parsedData.payload.user as string, {
          message: parsedData.payload.message!,
          room: parsedData.payload.room!,
        }, roomClientsMap);
        break;

      case "listRooms":
        // Handle user requesting a list of rooms
        await handleUserListRooms(ws);
        break;

      case "listUsersInRoom":
        // Handle user requesting a list of users in a room
        await handleListUsersInRoom(
          ws,
          parsedData.payload.user as string,
          parsedData.payload.room as string,
          roomClientsMap
        );
        break;

      default:
        // Handle unknown event
        break;
    }
  });
};

export default handleChatSocketEvents;