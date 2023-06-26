import { Context } from "koa";
import pino from "pino";

const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
});

export async function loggingMiddleware(ctx: Context, next: () => Promise<any>) {
  const start = Date.now();

  await next();

  const responseTime = Date.now() - start;

  logger.info({
    method: ctx.method,
    url: ctx.url,
    status: ctx.status,
    responseTime,
  });
}

export default logger;
