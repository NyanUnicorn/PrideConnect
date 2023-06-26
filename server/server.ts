import { createServer } from "http";
import nextServer from "next";
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import url from "url";
import { z } from "zod";

import { Server, Socket } from "socket.io";
import usersRoutes from "./routes/users.routes";
import playersRoutes from "./routes/players.routes";
import roomsRoutes from "./routes/rooms.routes";

const port = Number(process.env.PORT) || 8989;
const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const nextApp = nextServer({ dev, hostname, port });
const handle = nextApp.getRequestHandler();

// GLOBAL VARIABLES
const app = new Koa();
nextApp.prepare().then(async () => {
  const server = createServer(app.callback());
  const io = new Server(server);

  app.use(bodyParser());

  // Register the users routes
  app.use(usersRoutes.routes());
  app.use(usersRoutes.allowedMethods());

  // Register the players routes
  app.use(playersRoutes.routes());
  app.use(playersRoutes.allowedMethods());

  // Register the rooms routes
  app.use(roomsRoutes.routes());
  app.use(roomsRoutes.allowedMethods());

  // Handle other requests using Next.js

  const urlSchema = z.string().url();
  app.use(async (ctx: Koa.Context) => {
    const parsedUrl = url.parse(urlSchema.parse(ctx.request.URL.href), true);
    await handle(ctx.req, ctx.res, parsedUrl);
    ctx.respond = false;
  });

  server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is running on port ${port}`);
  });

  type PlayerId = string;
  interface Player {
    playerName: string;
    x: number;
    y: number;
    imageId: number;
    speed: number;
    dir: 'up' | 'down' | 'left' | 'right';
  }

  interface Players {
    [key: PlayerId]: Player;
  }

  const players: Players = {};

  // Start Cnnection Handshake
  io.on('connection', (socket: Socket) => {
    socket.on('new player', (player) => {
      console.log('test');
      console.log(socket.id);
      console.log(players);
      players[player.playerName] = player;
    });

    // On movement, will update the player's position on the server

    socket.on('movement', (id, data) => {
      // const player = players[socket.id] || {};
      players[socket.id] = ({ ...players[socket.id], ...data });
    });
  });

  // Braodcast player state on setInterval
  setInterval(() => {
    io.sockets.emit('state', players);
  }, 1000 / 60);
});

export default nextApp;
