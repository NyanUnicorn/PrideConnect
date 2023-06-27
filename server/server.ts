import { createServer } from "http";
import nextServer from "next";
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import url from "url";
import { z } from "zod";
import { Server } from "socket.io";
import usersRoutes from "./routes/users.routes";
import playersRoutes from "./routes/players.routes";
import roomsRoutes from "./routes/rooms.routes";

const port = Number(process.env.PORT) || 8989;
const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const nextApp = nextServer({ dev, hostname, port });
const handle = nextApp.getRequestHandler();

const app = new Koa();

nextApp.prepare().then(async () => {
  const server = createServer(app.callback());
  const io = new Server(server);

  app.use(bodyParser());

  // Register routes
  app.use(usersRoutes.routes());
  app.use(usersRoutes.allowedMethods());
  app.use(playersRoutes.routes());
  app.use(playersRoutes.allowedMethods());
  app.use(roomsRoutes.routes());
  app.use(roomsRoutes.allowedMethods());

  // Handle other requests using Next.js
  const urlSchema = z.string().url();
  app.use(async (ctx) => {
    const parsedUrl = url.parse(urlSchema.parse(ctx.request.URL.href), true);
    await handle(ctx.req, ctx.res, parsedUrl);
    ctx.respond = false;
  });

  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

  // Player types
  type PlayerId = string;
  interface Player {
    playerName: string;
    x: number;
    y: number;
    imageId: number;
    speed: number;
    dir: "up" | "down" | "left" | "right";
    currentFrame: number;
  }

  // Players object
  const players: Record<PlayerId, Player> = {};

  // Connection handshake
  io.on("connection", (socket) => {
    socket.on("new player", (player) => {
      players[socket.id] = player;
    });

    socket.on("movement", (player: Player) => {
      players[socket.id] = { ...players[socket.id], ...player };
    });
  });

  // Broadcast player state on setInterval
  setInterval(() => {
    io.sockets.emit("state", players);
  }, 1000 / 60);
});

export default nextApp;
