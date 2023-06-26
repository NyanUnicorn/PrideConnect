import { Logger } from "pino";
import { send } from "process";
import { WebSocket } from "ws";
import { z } from "zod";


const sendSocketMessage = (ws: WebSocket, type: string, { user, payload } : { user: string, payload: unknown}) => {
  return ws.send(JSON.stringify({ type, payload: { user, payload } }));
}
const gameDataSchema = z.object({
  user: z.string(),
  room: z.string(),
  position: z.unknown(),

});

// gameMove event
const handleGameMove = (
  ws: WebSocket,
  payload: z.infer<typeof gameDataSchema>,
  roomClientsMap: Map<string, Set<WebSocket>>
) => {
  // Handle player movement logic
  // Update player's position in the game world

  const { room, user, position } = payload;

  // Broadcast the updated position to all connected game clients
  roomClientsMap.get(room)?.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      sendSocketMessage(client, "gameMove", {
        user,
        payload
      });
    }
  });
};


// gameSyncData event
const handleGameSyncData = (ws: WebSocket, payload: z.infer<typeof gameDataSchema>, roomClientsMap: Map<string, Set<WebSocket>>) => {
  // Gather necessary game data to sync
  const { room, user, position } = payload;

  // Send updates about game state to the user
  roomClientsMap.get(room)?.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      sendSocketMessage(client, "gameSync", {
        user: user,
        payload: { room, position }
      });
    }
  })

};

const handlePlayerSocketEvents = async (
  logger: Logger,
  ws: WebSocket,
  roomClientsMap: Map<string, Set<WebSocket>>
) => {
  ws.on("message", async (data: string) => {
    const dataSchema = z.object({
      type: z.string(),
      payload: z.object({
        user: z.string(),
        room: z.string(),
        position: z.unknown(),
      }),
    });



    let parsedData;

    try {
      parsedData = dataSchema.parse(JSON.parse(data));
    } catch (error) {
      logger.error(`Error parsing message: ${error}`);
      return;
    }

    const { payload } = parsedData;

    switch (parsedData.type) {
      case "gameMove":
        // Handle game movement
        handleGameMove(ws, payload ,roomClientsMap);
        break;

      case "gameSyncData":
        // Handle game data synchronization
        handleGameSyncData(ws, payload, roomClientsMap);
        break;

      default:
        // Handle unknown event
        break;
    }
  });
};

export default handlePlayerSocketEvents;