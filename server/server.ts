import { createServer } from "http";
import nextServer from "next";
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import pino from "pino";
import { WebSocket, Server } from "ws";
import url from "url";
import { z } from "zod";

import usersRoutes from "./routes/users.routes";
import playersRoutes from "./routes/players.routes";
import roomsRoutes from "./routes/rooms.routes";

const port = Number(process.env.PORT) || 8989;
const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const nextApp = nextServer({ dev, hostname, port });
const handle = nextApp.getRequestHandler();

const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      ignore: "pid,hostname",
    },
  },
});

nextApp.prepare().then(async () => {
  const app = new Koa();
  const server = createServer(app.callback());
  const wss = new Server({ server, path: "/api/ws" });

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

  wss.on("connection", (ws: WebSocket) => {
    ws.on("message", (data: string) => {
      logger.info("received: %s", data);
      ws.emit("message", "Hello World");
    });

    ws.send("something");
  });

  // Handle other requests using Next.js

  const urlSchema = z.string().url();
  app.use(async (ctx: Koa.Context) => {
    const parsedUrl = url.parse(urlSchema.parse(ctx.req.url), true);
    await handle(ctx.req, ctx.res, parsedUrl);
    ctx.respond = false;
  });

  server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is running on port ${port}`);
  });
});

export default nextApp;
