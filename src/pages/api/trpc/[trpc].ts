// src/pages/api/trpc/[trpc].ts
import { createNextApiHandler } from "@trpc/server/adapters/next";
import { appRouter } from "../../../server/router";
import { createContext } from "../../../server/router/context";
import { ItemService } from "../../../services/ItemService";

// This is a hack to place this task here as NextJS doesn't provide any better place
setInterval(() => ItemService.cleanExpiredItems(), 1000 * 60 * 5);

export default createNextApiHandler({
  router: appRouter,
  createContext: createContext,
});

// Avoid incorrect messages about API calls without responses because of session cookie handling
export const config = {
  api: {
    externalResolver: true,
  },
};

