import { itemRouter } from "./api/items";
import { sessionRouter } from "./api/session";
import { settingsRouter } from "./api/settings";
import { createRouter } from "./context";

export const appRouter = createRouter()
  .merge("session.", sessionRouter)
  .merge("items.", itemRouter)
  .merge("settings.", settingsRouter);

export type AppRouter = typeof appRouter;

