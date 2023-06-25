import { Server } from "socket.io";
import { NextApiRequest, NextApiResponse } from "next";

const SocketHandler = (req: NextApiRequest, res: NextApiResponse) => {
  if (res.socket.server.io) {
    console.log("> has io");
  } else {
    console.log("> starting socket.io");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      socket.b
    }
  }
};
