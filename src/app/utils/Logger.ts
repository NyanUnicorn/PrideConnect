import * as pino from "pino";

export const Logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      levelFirst: true,
      colorize: true,
      translateTime: "yyyy-mm-dd HH:MM:ss.l",
      ignore: "pid,hostname",
    },
  },
});
