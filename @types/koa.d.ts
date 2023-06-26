import { z } from "zod";

const idSchema = z.string().cuid();

declare module "koa" {
  interface Context {
    params: {
      id: z.infer<typeof idSchema>;
    };
  }
}

interface KoaError extends Error {
  status?: number;
}
