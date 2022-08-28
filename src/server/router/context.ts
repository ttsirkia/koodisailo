import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { getSession } from "../../utils/session";

export const createContext = async (opts?: trpcNext.CreateNextContextOptions) => {
  const req = opts?.req;
  const res = opts?.res;
  const [session, richSession] = req && res ? await getSession(req, res) : [undefined, undefined];
  return { req, res, session, richSession };
};

type Context = trpc.inferAsyncReturnType<typeof createContext>;

export const createRouter = () => trpc.router<Context>();

