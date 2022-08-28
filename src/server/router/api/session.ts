import { Role } from "../../../utils/session";
import { createRouter } from "../context";

// ************************************************************************************************

export interface SessionInfo {
  userName?: string;
  courseName?: string;
  language: string;
  role: Role;
  sessionId?: string;
}

// ************************************************************************************************

export const sessionRouter = createRouter().query("getSessionInfo", {
  async resolve({ ctx }) {
    const response: SessionInfo = {
      userName: ctx.richSession?.user?.fullName,
      courseName: ctx.richSession?.course?.name,
      language: ctx.session?.language ?? process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE ?? "en",
      role: ctx.session?.role ?? "student",
      sessionId: ctx.session?.id ?? "",
    };
    return response;
  },
});
