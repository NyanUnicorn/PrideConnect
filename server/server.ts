// import { createServer } from "http";
// import { parse } from "url";
// import nextServer from "next";
// import Koa from "koa";
// import bodyParser from "koa-bodyparser";
// import socketIO from "socket.io";
// import socketController from "./controllers/socket.controller";

// import usersRoutes from "./routes/users.routes";
// import playersRoutes from "./routes/players.routes";
// import roomsRoutes from "./routes/rooms.routes";

const createServer = require('http');
const parse = require('url');
const nextServer = require('next');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const socketIO = require('socket.io');

const socketController = require('./controllers/socket.controller');

const usersRoutes = require('./routes/users.routes');
const playersRoutes = require('./routes/players.routes');
const roomsRoutes = require('./routes/rooms.routes');

const port = Number(process.env.PORT) || 3000;
const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const nextApp = nextServer({ dev, hostname, port });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(async () => {
  const app = new Koa();
  const server = createServer(app.callback());
  const io = new socketIO.Server(server);

  socketController(io);

  app.use(bodyParser());

  // logger

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
  app.use(async (ctx) => {
    const parsedUrl = parse(ctx.request.URL.toString(), true);
    await handle(ctx.req, ctx.res, parsedUrl);
    ctx.respond = false;
  });

  server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is running on port ${port}`);
  });
});

module.exports = nextApp;
