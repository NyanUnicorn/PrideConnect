import { NextApiRequest, NextApiResponse } from "next";
import http from "http";
import { Server, Socket } from "socket.io";
import pino from "pino";
import { PrismaClient, type Room, type User } from "@prisma/client";
import { z } from "zod";

const logger = pino({ level: process.env.LOG_LEVEL || "info" });

const SocketHandler = (req: NextApiRequest, res: NextApiResponse) => {
  if (!res.socket) {
    // pino log message
    logger.error(" > [socket.io] Socket Handler: No socket");
    return;
  }

  if (!res.socket.server || !res.socket.server.io) {
    // pino log message
    logger.info(" > [socket.io] Socket Handler starting...");

    const io = new Server(res.socket.server as unknown as http.Server);
    (res.socket.server as any).io = io;

    io.on("connection", (socket) => {
      let currentUser: { username: string; roomName: string };
      socket.emit("hello", "hello from socket.io");
    });
  } else {
    // pino log message
    logger.info(" > [socket.io] Using existing socket.io instance");
  }
  res.end();
};

export default SocketHandler;
