import { Server as HTTPServer } from "http";
import { Server as SocketIOServer } from "socket.io";

declare module "net" {
  interface Socket {
    server?: HTTPServer;
  }
}

declare module "http" {
  interface Server {
    io?: SocketIOServer;
  }
}
